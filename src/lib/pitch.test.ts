import { describe, expect, it } from "vitest";

import { FOUNDER_SCENARIOS } from "./__fixtures__/scenarios";
import { ADVISORY_PRODUCT, CAP_TABLE_PRODUCT, OUTBOUND_URLS } from "./brand";
import { evaluate } from "./evaluate";
import { FLAG_RULES, type FlagId } from "./flags";
import { FLAG_GUIDANCE } from "./guidance";
import {
  MIN_FREE_STEPS_BEFORE_PITCH,
  buildConversion,
  type PitchVariantId,
} from "./pitch";
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

function conversionFor(answers: Answers) {
  return buildConversion(answers, evaluate(answers));
}

const URGENCIES: readonly Answers["q8"][] = [
  "not_raising",
  "six_plus_months",
  "one_to_three_months",
  "term_sheet_or_diligence",
];

/** Every scenario worth exercising, crossed with every raise-timing answer. */
const EVERY_CASE = [
  ...FOUNDER_SCENARIOS.map((scenario) => ({
    id: scenario.id,
    answers: scenario.answers as Answers,
  })),
  { id: "clean", answers: cleanAnswers },
  { id: "vesting-only", answers: answersWith({ q4: "none" }) },
  { id: "roc-only", answers: answersWith({ q5: "behind" }) },
  {
    id: "self-fix-only",
    answers: answersWith({ q4: "none", q5: "behind" }),
  },
  { id: "departed-founder-only", answers: answersWith({ q4: "departed_founder" }) },
  { id: "press-note-3-only", answers: answersWith({ q6: "land_border_investor" }) },
].flatMap((base) =>
  URGENCIES.map((q8) => ({
    id: `${base.id} / ${q8}`,
    answers: { ...base.answers, q8 },
  })),
);

describe("the two-free-fixes rule — tool-spec-v1.md §1", () => {
  it.each(EVERY_CASE)(
    "never shows a pitch before $id has been given two free actions",
    ({ answers }) => {
      for (const placement of conversionFor(answers).placements) {
        expect(placement.freeStepsBefore).toBeGreaterThanOrEqual(
          MIN_FREE_STEPS_BEFORE_PITCH,
        );
      }
    },
  );

  it("sells nothing when every flag is one the founder can fix themselves", () => {
    for (const id of ["vesting-only", "roc-only", "self-fix-only"] as const) {
      const answers = {
        "vesting-only": answersWith({ q4: "none" }),
        "roc-only": answersWith({ q5: "behind" }),
        "self-fix-only": answersWith({ q4: "none", q5: "behind" }),
      }[id];

      const evaluation = evaluate(answers);
      expect(evaluation.needsSystem, id).toEqual([]);
      expect(conversionFor(answers).placements, id).toEqual([]);
    }
  });

  it("hoists the pitch for a founder in live diligence, but only once the self-fix column has paid up", () => {
    // Self-fix column present: founder vesting (5 steps) clears the bar.
    const withSelfFix = conversionFor(
      answersWith({
        q1: "sheets",
        q2: ["safes", "ccps"],
        q4: "none",
        q8: "term_sheet_or_diligence",
      }),
    );
    expect(withSelfFix.placements[0].anchor).toBe("top");
    expect(withSelfFix.placements[0].freeStepsBefore).toBeGreaterThanOrEqual(
      MIN_FREE_STEPS_BEFORE_PITCH,
    );

    // No self-fix column: the pitch stays anchored below the guidance it cites.
    const withoutSelfFix = conversionFor(
      answersWith({
        q1: "sheets",
        q2: ["safes", "ccps"],
        q8: "term_sheet_or_diligence",
      }),
    );
    expect(withoutSelfFix.placements[0].anchor).not.toBe("top");
    expect(withoutSelfFix.placements[0].freeStepsBefore).toBeGreaterThanOrEqual(
      MIN_FREE_STEPS_BEFORE_PITCH,
    );
  });

  it("only ever hoists one pitch, so two never stack into a banner", () => {
    const conversion = conversionFor(
      answersWith({
        q1: "sheets",
        q2: ["safes", "ccps"],
        q4: "none",
        q6: "filings_unsure",
        q8: "term_sheet_or_diligence",
      }),
    );

    expect(conversion.placements.length).toBe(2);
    expect(
      conversion.placements.filter((placement) => placement.anchor === "top"),
    ).toHaveLength(1);
  });
});

describe("the cliffhanger — §1's single best moment", () => {
  const answers = answersWith({
    q1: "sheets",
    q2: ["safes", "ccps", "esop_grants"],
    q8: "one_to_three_months",
  });

  it("fires on cap-table-not-a-system plus two or more instruments", () => {
    const [placement] = conversionFor(answers).placements;

    expect(placement.pitch.variant).toBe("cap-table-conversion");
    expect(placement.pitch.destination).toBe("tabulate");
  });

  it("states the count, the instruments and where the cap table lives", () => {
    const [placement] = conversionFor(answers).placements;

    expect(placement.pitch.body[0]).toBe(
      "You have 3 instrument types outstanding — SAFEs, CCPS and ESOP grants — and your cap table lives in a spreadsheet.",
    );
    expect(placement.pitch.body[1]).toBe(
      "That means you don't currently know what the founders own post-conversion — and it's question one in every diligence call.",
    );
  });

  it("adapts the cap-table clause to the answer actually given", () => {
    const viaCa = conversionFor(
      answersWith({ q1: "ca_cs", q2: ["safes", "ccps"] }),
    );
    const viaUnsure = conversionFor(
      answersWith({ q1: "not_sure", q2: ["safes", "ccps"] }),
    );

    expect(viaCa.placements[0].pitch.body[0]).toContain(
      "your cap table lives with your CA or CS",
    );
    expect(viaUnsure.placements[0].pitch.body[0]).toContain(
      "you are not sure where your cap table actually lives",
    );
  });

  it("does not fire on a single instrument", () => {
    const conversion = conversionFor(answersWith({ q1: "sheets", q2: ["safes"] }));

    expect(conversion.placements[0].pitch.variant).not.toBe(
      "cap-table-conversion",
    );
  });

  it("attaches only to flags that actually fired", () => {
    for (const { answers: caseAnswers } of EVERY_CASE) {
      const fired = new Set(evaluate(caseAnswers).flags.map((flag) => flag.id));
      for (const placement of conversionFor(caseAnswers).placements) {
        for (const flagId of placement.pitch.flagIds) {
          expect(fired.has(flagId)).toBe(true);
        }
      }
    }
  });
});

describe("the other variants", () => {
  const REACHABLE: readonly { variant: PitchVariantId; answers: Answers }[] = [
    {
      variant: "cap-table-conversion",
      answers: answersWith({ q1: "sheets", q2: ["safes", "ccps"] }),
    },
    { variant: "instruments-unknown", answers: answersWith({ q2: ["not_sure"] }) },
    {
      variant: "ownership-cleanup",
      answers: answersWith({ q4: "departed_founder" }),
    },
    {
      variant: "roc-reconciliation",
      answers: answersWith({ q1: "sheets", q5: "behind" }),
    },
    {
      variant: "instrument-stack",
      answers: answersWith({ q1: "platform", q2: ["safes", "ccps"] }),
    },
    { variant: "cap-table-only", answers: answersWith({ q1: "sheets" }) },
    { variant: "esop-pool", answers: answersWith({ q3: "no_pool" }) },
  ];

  it.each(REACHABLE)("$variant is reachable", ({ variant, answers }) => {
    expect(conversionFor(answers).placements[0].pitch.variant).toBe(variant);
  });

  it("quotes the founder's own answer in the ESOP variant", () => {
    const noPool = conversionFor(answersWith({ q3: "no_pool" }));
    const overGranted = conversionFor(answersWith({ q3: "over_granted" }));

    expect(noPool.placements[0].pitch.body[0]).toBe(
      "You told us there is no ESOP pool approved yet.",
    );
    expect(noPool.placements[0].pitch.body[1]).toContain("pre-money");
    expect(overGranted.placements[0].pitch.body[0]).toBe(
      "You told us you have granted more than your approved pool holds.",
    );
    expect(overGranted.placements[0].pitch.body[1]).toContain("mid-round");
  });

  it("tells the compounding story when the cap table and the filings both flagged", () => {
    const conversion = conversionFor(answersWith({ q1: "sheets", q5: "not_sure" }));
    const { pitch } = conversion.placements[0];

    expect(pitch.variant).toBe("roc-reconciliation");
    expect(pitch.body[0]).toBe(
      "You are not sure whether your ROC filings are current, and your cap table lives in a spreadsheet.",
    );
    expect(pitch.flagIds).toEqual([
      "cap-table-source-of-truth",
      "roc-filings-not-current",
    ]);
  });

  it("routes FEMA, Press Note 3 and Rule 11UA to Advisory, never to the cap-table product", () => {
    const answers = answersWith({
      q6: "filings_unsure",
      q7: "negotiated_no_report",
    });
    const conversion = conversionFor(answers);
    const advisory = conversion.placements.find(
      (placement) => placement.pitch.destination === "advisory",
    );

    expect(advisory?.pitch.variant).toBe("advisory-filings");
    expect(advisory?.pitch.href).toBe(OUTBOUND_URLS.advisory);
    expect(advisory?.pitch.productLine).toContain(ADVISORY_PRODUCT);
    expect(advisory?.pitch.productLine).not.toContain(CAP_TABLE_PRODUCT);
    expect(advisory?.pitch.flagIds).toEqual([
      "foreign-capital-filings-unclear",
      "valuation-report-missing",
    ]);
  });

  it("keeps the Press Note 3 pitch factual", () => {
    const conversion = conversionFor(
      answersWith({ q6: "land_border_investor" }),
    );
    const advisory = conversion.placements.find(
      (placement) => placement.pitch.destination === "advisory",
    );

    expect(advisory?.pitch.body[0]).toBe(
      "One of your investors is from a country that shares a land border with India.",
    );
    expect(advisory?.pitch.body.join(" ")).not.toMatch(
      /banned|prohibited|illegal|blocked/i,
    );
  });

  it("uses the singular connective when only one advisory flag fired", () => {
    const one = conversionFor(answersWith({ q7: "negotiated_no_report" }));
    const two = conversionFor(
      answersWith({ q6: "filings_unsure", q7: "negotiated_no_report" }),
    );

    expect(one.placements[0].pitch.body[1]).toContain("This one sits outside");
    expect(
      two.placements.find((p) => p.pitch.destination === "advisory")!.pitch
        .body[1],
    ).toContain("These sit outside");
  });

  it("shows at most one cap-table pitch and one advisory pitch", () => {
    for (const { answers } of EVERY_CASE) {
      const { placements } = conversionFor(answers);
      const byDestination = placements.map(
        (placement) => placement.pitch.destination,
      );

      expect(placements.length).toBeLessThanOrEqual(2);
      expect(byDestination.filter((d) => d === "tabulate").length).toBeLessThanOrEqual(1);
      expect(byDestination.filter((d) => d === "advisory").length).toBeLessThanOrEqual(1);
    }
  });

  it("gives every system-owned flag a route to some pitch", () => {
    const systemFlags = FLAG_RULES.filter((rule) => rule.fixedBy === "incentiv");

    for (const rule of systemFlags) {
      const answers = ANSWERS_TRIGGERING[rule.id as FlagId];
      const { placements } = conversionFor(answers);
      expect(placements.length, rule.id).toBeGreaterThanOrEqual(1);
    }
  });
});

/** One answer set per flag, isolating that flag as far as the questions allow. */
const ANSWERS_TRIGGERING: Record<FlagId, Answers> = {
  "cap-table-source-of-truth": answersWith({ q1: "sheets" }),
  "instrument-stack-unmodelled": answersWith({ q2: ["safes", "ccps"] }),
  "outstanding-instruments-unknown": answersWith({ q2: ["not_sure"] }),
  "esop-pool-not-approved": answersWith({ q3: "no_pool" }),
  "esop-pool-over-granted": answersWith({ q3: "over_granted" }),
  "founder-vesting-missing": answersWith({ q4: "none" }),
  "departed-founder-equity": answersWith({ q4: "departed_founder" }),
  "roc-filings-not-current": answersWith({ q5: "behind" }),
  "foreign-capital-filings-unclear": answersWith({ q6: "filings_unsure" }),
  "press-note-3-approval": answersWith({ q6: "land_border_investor" }),
  "valuation-report-missing": answersWith({ q7: "negotiated_no_report" }),
};

describe("urgency modulation — Q8", () => {
  const base = answersWith({ q1: "sheets", q2: ["safes", "ccps"] });

  const ctaFor = (q8: Answers["q8"]) =>
    conversionFor({ ...base, q8 }).placements[0].pitch.ctaLabel;

  it("gives the term-sheet founder the most direct CTA in the spec", () => {
    expect(ctaFor("term_sheet_or_diligence")).toBe("See your real number");
  });

  it("softens all the way down to not raising", () => {
    expect(ctaFor("one_to_three_months")).toBe("Get the number before the call");
    expect(ctaFor("six_plus_months")).toBe("Model it before you need it");
    expect(ctaFor("not_raising")).toBe("See how it would model");
  });

  it("gives every timing a distinct CTA and note", () => {
    const labels = URGENCIES.map(ctaFor);
    expect(new Set(labels).size).toBe(URGENCIES.length);

    const notes = URGENCIES.map(
      (q8) => conversionFor({ ...base, q8 }).placements[0].pitch.urgencyNote,
    );
    expect(new Set(notes).size).toBe(URGENCIES.length);
  });

  it("modulates the Advisory CTA too", () => {
    const advisoryCta = (q8: Answers["q8"]) =>
      conversionFor(answersWith({ q6: "filings_unsure", q8 })).placements[0]
        .pitch.ctaLabel;

    expect(advisoryCta("term_sheet_or_diligence")).toBe("Talk to Advisory now");
    expect(advisoryCta("not_raising")).toBe("Ask Advisory when you are ready");
  });
});

describe("cross-links", () => {
  it("shows the Funding Round Simulator only when instruments flagged", () => {
    const withInstruments = conversionFor(answersWith({ q2: ["safes", "ccps"] }));
    const without = conversionFor(answersWith({ q1: "sheets" }));

    expect(withInstruments.crossLinks.map((link) => link.id)).toContain(
      "funding-round-simulator",
    );
    expect(without.crossLinks).toEqual([]);
  });

  it("shows the ESOP Tax Calculator only when the pool flagged", () => {
    expect(
      conversionFor(answersWith({ q3: "over_granted" })).crossLinks.map(
        (link) => link.id,
      ),
    ).toEqual(["esop-tax-calculator"]);
    expect(conversionFor(answersWith({ q3: "no_pool" })).crossLinks).toHaveLength(1);
  });

  it("shows the Valuation Calculator only when the valuation flagged", () => {
    expect(
      conversionFor(answersWith({ q7: "not_sure" })).crossLinks.map(
        (link) => link.id,
      ),
    ).toEqual(["valuation-calculator"]);
  });

  it("shows none of them on a clean result", () => {
    expect(conversionFor(cleanAnswers).crossLinks).toEqual([]);
  });

  it("says why each one is on the page, from the founder's answers", () => {
    const conversion = conversionFor(answersWith({ q2: ["safes", "ccps"] }));
    const [link] = conversion.crossLinks;

    expect(link.reason).toContain("SAFEs and CCPS");
  });
});

describe("the clean state", () => {
  const conversion = conversionFor(cleanAnswers);

  it("has nothing to sell against, so it sells nothing", () => {
    expect(conversion.placements).toEqual([]);
    expect(conversion.crossLinks).toEqual([]);
  });

  it("offers one soft line and the gentlest CTA", () => {
    expect(conversion.cleanStatePitch?.variant).toBe("clean-state");
    expect(conversion.cleanStatePitch?.ctaLabel).toBe("See how it would model");
    expect(conversion.cleanStatePitch?.body[0]).toContain(
      "nothing here to sell you",
    );
  });

  it("still offers the report by email", () => {
    expect(conversion.emailCapture.heading).toBe("Email me this report");
  });
});

describe("copy hygiene", () => {
  function allPitchCopy(answers: Answers): string {
    const conversion = conversionFor(answers);
    const pitches = [
      ...conversion.placements.map((placement) => placement.pitch),
      ...(conversion.cleanStatePitch ? [conversion.cleanStatePitch] : []),
    ];

    return [
      ...pitches.flatMap((pitch) => [
        ...pitch.body,
        pitch.productLine,
        pitch.ctaLabel,
        pitch.urgencyNote,
      ]),
      ...conversion.crossLinks.flatMap((link) => [link.name, link.reason]),
      conversion.emailCapture.heading,
      conversion.emailCapture.body,
      conversion.emailCapture.reassurance,
    ].join("\n");
  }

  it.each(EVERY_CASE)("never accuses the founder — $id", ({ answers }) => {
    const copy = allPitchCopy(answers).toLowerCase();

    for (const banned of [
      "non-compliant",
      "noncompliant",
      "you failed",
      "in breach",
      "illegal",
      "violation",
      "score",
    ]) {
      expect(copy).not.toContain(banned);
    }
  });

  it.each(EVERY_CASE)("never calls the product Equity — $id", ({ answers }) => {
    expect(allPitchCopy(answers)).not.toMatch(/\bEquity\b/);
  });

  it("names the cap-table product from the single constant", () => {
    const conversion = conversionFor(answersWith({ q1: "sheets" }));

    expect(conversion.placements[0].pitch.productLine).toContain(
      CAP_TABLE_PRODUCT,
    );
    expect(CAP_TABLE_PRODUCT).toBe("Tabulate");
  });

  it("says nothing is gated, because nothing is", () => {
    const { emailCapture } = conversionFor(answersWith({ q1: "sheets" }));

    expect(emailCapture.body).toContain("no wall");
    expect(emailCapture.body).toContain("no account");
  });

  it("keeps every pitch body tied to an answer rather than a generic claim", () => {
    for (const { answers } of EVERY_CASE) {
      for (const placement of conversionFor(answers).placements) {
        // The opening line always reports something the founder selected.
        expect(placement.pitch.body[0]).toMatch(
          /^(You have|You told us|You are not sure|You took foreign capital|Your cap table|Your ROC filings|Your last round|One of your|Nothing on this check)/,
        );
      }
    }
  });
});

describe("guidance step counts feed the free-fix accounting", () => {
  it("counts real steps, not placeholders", () => {
    const conversion = conversionFor(
      answersWith({ q1: "sheets", q4: "none", q8: "term_sheet_or_diligence" }),
    );

    expect(conversion.placements[0].freeStepsBefore).toBe(
      FLAG_GUIDANCE["founder-vesting-missing"].steps.length,
    );
  });
});
