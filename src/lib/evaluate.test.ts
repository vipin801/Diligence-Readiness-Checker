import { describe, expect, it } from "vitest";

import { FOUNDER_SCENARIOS } from "./__fixtures__/scenarios";
import { evaluate } from "./evaluate";
import { FLAG_RULES } from "./flags";
import type { Answers } from "./questions";

const cleanAnswers: Answers = {
  q1: "platform",
  q2: ["nothing"],
  q3: "approved_under_half",
  q4: "documented",
  q5: "current",
  q6: "none",
  q7: "rule_11ua_report",
  q8: "not_raising",
};

function answersWith(changes: Partial<Answers>): Answers {
  return { ...cleanAnswers, ...changes };
}

describe("evaluate", () => {
  it("returns a zero-issue risk register for a clean company", () => {
    const result = evaluate(cleanAnswers);

    expect(result.flags).toEqual([]);
    expect(result.totalDelayWeeks).toEqual({ min: 0, max: 0 });
    expect(result.urgency).toBe("none");
    expect(result.selfFixable).toEqual([]);
    expect(result.needsSystem).toEqual([]);
  });

  it("handles a clean path with one cleanup item", () => {
    const result = evaluate(
      answersWith({ q7: "negotiated_no_report", q8: "six_plus_months" }),
    );

    expect(result.flags.map((flag) => flag.id)).toEqual([
      "valuation-report-missing",
    ]);
    expect(result.totalDelayWeeks).toEqual({ min: 1, max: 2 });
    expect(result.urgency).toBe("planning");
  });

  it("fires every simultaneously reachable risk group in the worst case", () => {
    const result = evaluate(
      answersWith({
        q1: "not_sure",
        q2: ["safes", "convertibles", "not_sure"],
        q3: "no_pool",
        q4: "departed_founder",
        q5: "not_sure",
        q6: "land_border_investor",
        q7: "not_sure",
        q8: "term_sheet_or_diligence",
      }),
    );

    expect(result.flags.map((flag) => flag.id)).toEqual([
      "outstanding-instruments-unknown",
      "departed-founder-equity",
      "press-note-3-approval",
      "cap-table-source-of-truth",
      "instrument-stack-unmodelled",
      "esop-pool-not-approved",
      "roc-filings-not-current",
      "valuation-report-missing",
    ]);
    expect(result.totalDelayWeeks).toEqual({ min: null, max: null });
    expect(result.urgency).toBe("live");
  });

  it.each([
    ["Q1 sheets", { q1: "sheets" }, "cap-table-source-of-truth"],
    ["Q1 CA/CS", { q1: "ca_cs" }, "cap-table-source-of-truth"],
    ["Q1 unknown", { q1: "not_sure" }, "cap-table-source-of-truth"],
    [
      "Q2 two instruments",
      { q2: ["safes", "convertibles"] },
      "instrument-stack-unmodelled",
    ],
    [
      "Q2 unknown",
      { q2: ["not_sure"] },
      "outstanding-instruments-unknown",
    ],
    ["Q3 no pool", { q3: "no_pool" }, "esop-pool-not-approved"],
    ["Q3 unknown", { q3: "not_sure" }, "esop-pool-not-approved"],
    ["Q3 over-granted", { q3: "over_granted" }, "esop-pool-over-granted"],
    [
      "Q4 partial",
      { q4: "partial_or_informal" },
      "founder-vesting-missing",
    ],
    ["Q4 no vesting", { q4: "none" }, "founder-vesting-missing"],
    [
      "Q4 departed founder",
      { q4: "departed_founder" },
      "departed-founder-equity",
    ],
    ["Q5 behind", { q5: "behind" }, "roc-filings-not-current"],
    ["Q5 unknown", { q5: "not_sure" }, "roc-filings-not-current"],
    [
      "Q6 filings unknown",
      { q6: "filings_unsure" },
      "foreign-capital-filings-unclear",
    ],
    [
      "Q6 land-border investor",
      { q6: "land_border_investor" },
      "press-note-3-approval",
    ],
    [
      "Q7 negotiated without report",
      { q7: "negotiated_no_report" },
      "valuation-report-missing",
    ],
    ["Q7 unknown", { q7: "not_sure" }, "valuation-report-missing"],
  ] as const)("isolates the %s trigger", (_label, changes, expectedFlagId) => {
    const result = evaluate(answersWith(changes as Partial<Answers>));

    expect(result.flags.map((flag) => flag.id)).toEqual([expectedFlagId]);
  });

  it("exercises every rule through the isolated trigger cases", () => {
    const firedIds = new Set(
      [
        { q1: "sheets" },
        { q2: ["safes", "ccps"] },
        { q2: ["not_sure"] },
        { q3: "no_pool" },
        { q3: "over_granted" },
        { q4: "none" },
        { q4: "departed_founder" },
        { q5: "behind" },
        { q6: "filings_unsure" },
        { q6: "land_border_investor" },
        { q7: "not_sure" },
      ].flatMap((changes) =>
        evaluate(answersWith(changes as Partial<Answers>)).flags.map(
          (flag) => flag.id,
        ),
      ),
    );

    expect(firedIds).toEqual(new Set(FLAG_RULES.map((flag) => flag.id)));
  });

  it("counts only distinct Q2 instrument types", () => {
    expect(evaluate(answersWith({ q2: ["safes"] })).flags).toEqual([]);
    expect(evaluate(answersWith({ q2: ["safes", "safes"] })).flags).toEqual([]);
    expect(
      evaluate(answersWith({ q2: ["safes", "esop_grants"] })).flags.map(
        (flag) => flag.id,
      ),
    ).toEqual(["instrument-stack-unmodelled"]);
  });

  it("treats Q2 uncertainty independently from the instrument count", () => {
    expect(
      evaluate(answersWith({ q2: ["not_sure"] })).flags.map(
        (flag) => flag.id,
      ),
    ).toEqual(["outstanding-instruments-unknown"]);

    expect(
      evaluate(
        answersWith({ q2: ["safes", "convertibles", "not_sure"] }),
      ).flags.map((flag) => flag.id),
    ).toEqual([
      "outstanding-instruments-unknown",
      "instrument-stack-unmodelled",
    ]);
  });

  it("aggregates parallel fixes by the slowest range rather than summing", () => {
    const result = evaluate(
      answersWith({ q1: "sheets", q2: ["safes", "convertibles"] }),
    );

    expect(result.flags).toHaveLength(2);
    expect(result.totalDelayWeeks).toEqual({ min: 2, max: 3 });
  });

  it.each([
    ["not_raising", "none"],
    ["six_plus_months", "planning"],
    ["one_to_three_months", "near"],
    ["term_sheet_or_diligence", "live"],
  ] as const)("maps Q8 %s to %s urgency", (answer, urgency) => {
    expect(evaluate(answersWith({ q8: answer })).urgency).toBe(urgency);
  });

  it("splits self-fixable and system flags without overlap", () => {
    const result = evaluate(
      answersWith({ q1: "sheets", q4: "none", q5: "behind" }),
    );

    expect(result.selfFixable.map((flag) => flag.id)).toEqual([
      "founder-vesting-missing",
      "roc-filings-not-current",
    ]);
    expect(result.needsSystem.map((flag) => flag.id)).toEqual([
      "cap-table-source-of-truth",
    ]);
  });

  it("keeps all six calibration personas evaluable", () => {
    expect(FOUNDER_SCENARIOS).toHaveLength(6);
    for (const scenario of FOUNDER_SCENARIOS) {
      expect(() => evaluate(scenario.answers)).not.toThrow();
    }
  });
});
