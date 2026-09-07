import { describe, expect, it } from "vitest";

import { FOUNDER_SCENARIOS } from "./__fixtures__/scenarios";
import { evaluate } from "./evaluate";
import { FLAG_RULES, type FlagId } from "./flags";
import { FLAG_GUIDANCE } from "./guidance";
import { buildResults, headlineText } from "./results";
import { isCompleteAnswers, type Answers } from "./questions";

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

/** Every string the screen can render, for the copy-rule assertions below. */
function allCopy(answers: Answers): string {
  const results = buildResults(answers);
  const parts: string[] = [
    headlineText(results.headline),
    results.subline,
    results.severityLine ?? "",
    results.urgencyLine,
    results.soloEmphasis ?? "",
  ];

  for (const flag of results.flags) {
    parts.push(
      flag.title,
      flag.whyInvestorAsks,
      flag.severityLabel,
      flag.delayValue,
      flag.delayUnit,
      flag.fixedByLabel,
      flag.answerEcho,
    );
  }

  for (const column of [results.selfFix, results.needsSystem]) {
    if (!column) continue;
    parts.push(headlineText(column.heading), column.intro);
    for (const item of column.items) {
      parts.push(item.flagTitle, item.actionHeadline, item.systemReason ?? "");
      parts.push(...item.steps);
    }
  }

  if (results.clean) {
    parts.push(
      ...results.clean.confirmations,
      results.clean.caveat,
      results.clean.nextStepHeading,
      ...results.clean.nextSteps,
    );
  }

  const { conversion } = results;
  const pitches = [
    ...conversion.placements.map((placement) => placement.pitch),
    ...(conversion.cleanStatePitch ? [conversion.cleanStatePitch] : []),
  ];
  for (const pitch of pitches) {
    parts.push(...pitch.body, pitch.productLine, pitch.ctaLabel, pitch.urgencyNote);
  }
  for (const link of conversion.crossLinks) {
    parts.push(link.name, link.reason);
  }
  parts.push(
    conversion.emailCapture.heading,
    conversion.emailCapture.body,
    conversion.emailCapture.reassurance,
  );

  return parts.join("\n");
}

describe("guidance table", () => {
  it("covers every flag rule, with no orphan entries", () => {
    const ruleIds = FLAG_RULES.map((rule) => rule.id).sort();
    const guidanceIds = Object.keys(FLAG_GUIDANCE).sort();

    expect(guidanceIds).toEqual([...ruleIds]);
  });

  it("gives every flag at least two concrete, non-empty steps", () => {
    for (const [id, guidance] of Object.entries(FLAG_GUIDANCE)) {
      expect(guidance.steps.length, id).toBeGreaterThanOrEqual(2);
      expect(guidance.actionHeadline.length, id).toBeGreaterThan(0);
      for (const step of guidance.steps) {
        expect(step.trim().length, id).toBeGreaterThan(20);
      }
    }
  });

  it("explains why a one-off fix does not hold, for exactly the system-owned flags", () => {
    for (const rule of FLAG_RULES) {
      const guidance = FLAG_GUIDANCE[rule.id];
      if (rule.fixedBy === "incentiv") {
        expect(guidance.systemReason, rule.id).toBeTruthy();
      } else {
        expect(guidance.systemReason, rule.id).toBeUndefined();
      }
    }
  });
});

describe("buildResults — headline", () => {
  it("sets every numeral as its own segment so it can be rendered in mono", () => {
    const results = buildResults(
      answersWith({ q1: "sheets", q4: "none", q5: "behind" }),
    );

    expect(results.headline.filter((s) => s.kind === "number")).toHaveLength(2);
    expect(headlineText(results.headline)).toBe(
      "3 issues found · estimated 2–6 weeks of delay at close",
    );
  });

  it("uses the singular for a single issue", () => {
    const results = buildResults(answersWith({ q7: "negotiated_no_report" }));

    expect(results.state).toBe("single");
    expect(headlineText(results.headline)).toBe(
      "1 issue found · estimated 1–2 weeks of delay at close",
    );
  });

  it("names the government approval rather than inventing a week count", () => {
    const results = buildResults(answersWith({ q6: "land_border_investor" }));

    expect(headlineText(results.headline)).toBe(
      "1 issue found · timing set by a government approval",
    );
    expect(results.flags[0].delayValue).toBe("—");
  });

  it("keeps the determinate range visible when an indefinite flag is also present", () => {
    const results = buildResults(
      answersWith({ q1: "sheets", q6: "land_border_investor" }),
    );

    expect(headlineText(results.headline)).toBe(
      "2 issues found · 2–3 weeks of delay, plus an approval that runs on its own clock",
    );
  });

  it("leads the clean state with a sentence, not a zero", () => {
    const results = buildResults(cleanAnswers);

    expect(results.state).toBe("clean");
    expect(results.issueCount).toBe(0);
    expect(headlineText(results.headline)).toBe(
      "Nothing here that typically delays a close.",
    );
    expect(results.headline.some((s) => s.kind === "number")).toBe(false);
  });
});

describe("buildResults — traceability", () => {
  it("echoes the founder's own option label on every flag", () => {
    const results = buildResults(
      answersWith({ q4: "departed_founder", q5: "not_sure" }),
    );

    const echoes = Object.fromEntries(
      results.flags.map((flag) => [flag.id, flag.answerEcho]),
    );

    expect(echoes["departed-founder-equity"]).toBe(
      "A founder has left and still holds equity",
    );
    expect(echoes["roc-filings-not-current"]).toBe("Not sure");
  });

  it("lists the selected instruments behind the instrument-stack flag", () => {
    const results = buildResults(
      answersWith({ q2: ["safes", "ccps", "esop_grants"] }),
    );

    const flag = results.flags.find(
      (candidate) => candidate.id === "instrument-stack-unmodelled",
    );

    expect(flag?.answerEcho).toBe(
      "SAFEs, CCPS (preference shares), ESOP grants",
    );
  });

  it("never leaves a flag without an answer to trace it to", () => {
    for (const scenario of FOUNDER_SCENARIOS) {
      for (const flag of buildResults(scenario.answers).flags) {
        expect(flag.answerEcho.trim(), `${scenario.id}/${flag.id}`).not.toBe("");
      }
    }
  });

  it("says something about the raise timing the founder gave on Q8", () => {
    const live = buildResults(
      answersWith({ q1: "sheets", q8: "term_sheet_or_diligence" }),
    );
    const planning = buildResults(
      answersWith({ q1: "sheets", q8: "six_plus_months" }),
    );

    expect(live.urgencyLine).toContain("diligence has started");
    expect(planning.urgencyLine).toContain("six or more months");
    expect(live.urgencyLine).not.toBe(planning.urgencyLine);
  });
});

describe("buildResults — severity, ordering and the single-flag state", () => {
  it("keeps the evaluator's blockers-first order", () => {
    const results = buildResults(
      answersWith({ q1: "sheets", q4: "departed_founder", q7: "not_sure" }),
    );

    expect(results.flags.map((flag) => flag.severityLabel)).toEqual([
      "Blocker",
      "Delay",
      "Cleanup",
    ]);
  });

  it("counts blockers in the severity line", () => {
    const results = buildResults(
      answersWith({ q4: "departed_founder", q6: "filings_unsure" }),
    );

    expect(results.severityLine).toContain("Two of these are blockers");
  });

  it("says so plainly when nothing is a blocker", () => {
    const results = buildResults(answersWith({ q1: "sheets", q5: "behind" }));

    expect(results.severityLine).toContain("None of these is a blocker");
  });

  it("gives a lone flag singular copy and extra weight", () => {
    const results = buildResults(answersWith({ q4: "departed_founder" }));

    expect(results.state).toBe("single");
    expect(results.severityLine).toBe(
      "It is a blocker — the kind of item investors treat as a condition to close rather than a nice-to-have.",
    );
    expect(results.soloEmphasis).toBeTruthy();
    expect(results.soloEmphasis).toContain("Every other answer came back clean");
  });

  it("carries no solo emphasis once there is more than one flag", () => {
    expect(buildResults(answersWith({ q1: "sheets", q5: "behind" })).soloEmphasis)
      .toBeNull();
    expect(buildResults(cleanAnswers).soloEmphasis).toBeNull();
  });
});

describe("buildResults — the split", () => {
  it("matches the evaluator's self / system buckets", () => {
    const answers = answersWith({
      q1: "sheets",
      q4: "partial_or_informal",
      q5: "behind",
    });
    const evaluation = evaluate(answers);
    const results = buildResults(answers);

    expect(results.selfFix?.items.map((item) => item.id)).toEqual(
      evaluation.selfFixable.map((flag) => flag.id),
    );
    expect(results.needsSystem?.items.map((item) => item.id)).toEqual(
      evaluation.needsSystem.map((flag) => flag.id),
    );
  });

  it("uses the spec's split headings, with the count as its own numeral", () => {
    const results = buildResults(
      answersWith({
        q1: "sheets",
        q4: "partial_or_informal",
        q5: "behind",
      }),
    );

    expect(headlineText(results.selfFix!.heading)).toBe(
      "2 of these you can fix yourself this week.",
    );
    expect(headlineText(results.needsSystem!.heading)).toBe(
      "1 of these needs a system.",
    );
    expect(results.selfFix!.heading[0]).toEqual({ kind: "number", value: "2" });
  });

  it("omits a column rather than rendering an empty one", () => {
    const systemOnly = buildResults(answersWith({ q4: "departed_founder" }));
    expect(systemOnly.selfFix).toBeNull();
    expect(systemOnly.needsSystem?.count).toBe(1);

    const selfOnly = buildResults(answersWith({ q5: "behind" }));
    expect(selfOnly.needsSystem).toBeNull();
    expect(selfOnly.selfFix?.count).toBe(1);

    const clean = buildResults(cleanAnswers);
    expect(clean.selfFix).toBeNull();
    expect(clean.needsSystem).toBeNull();
  });

  it("hands over free, concrete steps for every flag, including the system ones", () => {
    for (const scenario of FOUNDER_SCENARIOS) {
      const results = buildResults(scenario.answers);
      const items = [
        ...(results.selfFix?.items ?? []),
        ...(results.needsSystem?.items ?? []),
      ];

      expect(items.length, scenario.id).toBe(results.flags.length);
      for (const item of items) {
        expect(item.steps.length, `${scenario.id}/${item.id}`).toBeGreaterThanOrEqual(2);
      }
    }
  });
});

describe("buildResults — the clean state", () => {
  it("reads the founder's answers back rather than congratulating in the abstract", () => {
    const results = buildResults(cleanAnswers);

    expect(results.clean?.confirmations).toContain(
      "your cap table sits on a platform rather than in a file",
    );
    expect(results.clean?.confirmations).toContain(
      "every founder is on documented vesting",
    );
    expect(results.clean?.confirmations.length ?? 0).toBeGreaterThanOrEqual(6);
  });

  it("stays short of smug by naming what the check does not cover", () => {
    const results = buildResults(cleanAnswers);

    expect(results.clean?.caveat).toContain("It is not a diligence review");
  });

  it("still offers a next step", () => {
    const results = buildResults(cleanAnswers);

    expect(results.clean?.nextSteps.length ?? 0).toBeGreaterThanOrEqual(2);
    expect(results.clean?.nextStepHeading).toBe("What keeps it that way");
  });

  it("adapts the confirmations to how the founder actually answered", () => {
    const noPricedRound = buildResults(
      answersWith({ q7: "no_priced_round", q6: "fc_gpr_on_time" }),
    );

    expect(noPricedRound.state).toBe("clean");
    expect(noPricedRound.clean?.confirmations).toContain(
      "there has been no priced round to defend yet",
    );
    expect(noPricedRound.clean?.confirmations).toContain(
      "FC-GPR was filed on time for the foreign capital you took",
    );
    expect(noPricedRound.clean?.confirmations).not.toContain(
      "there is no foreign capital on the cap table",
    );
  });
});

describe("copy rules", () => {
  const everyScenario = [
    ...FOUNDER_SCENARIOS.map((scenario) => ({
      id: scenario.id,
      answers: scenario.answers as Answers,
    })),
    { id: "clean", answers: cleanAnswers },
    { id: "single-blocker", answers: answersWith({ q4: "departed_founder" }) },
    {
      id: "press-note-3-only",
      answers: answersWith({ q6: "land_border_investor" }),
    },
  ];

  it.each(everyScenario)("never accuses the founder — $id", ({ answers }) => {
    const copy = allCopy(answers).toLowerCase();

    for (const banned of [
      "non-compliant",
      "noncompliant",
      "you failed",
      "you are in breach",
      "illegal",
      "violation",
      "penalty for your",
    ]) {
      expect(copy).not.toContain(banned);
    }
  });

  it.each(everyScenario)("never renders a score — $id", ({ answers }) => {
    const copy = allCopy(answers).toLowerCase();

    for (const banned of ["out of 100", "/100", "score", "grade", "rating"]) {
      expect(copy).not.toContain(banned);
    }
  });

  it("keeps the Press Note 3 wording factual and non-alarming", () => {
    const results = buildResults(answersWith({ q6: "land_border_investor" }));
    const item = results.needsSystem?.items.find(
      (candidate) => candidate.id === "press-note-3-approval",
    );

    expect(item?.steps.join(" ")).toContain(
      "Investment from these countries is permitted",
    );
    expect(results.flags[0].whyInvestorAsks).not.toMatch(/banned|prohibit|block/i);
  });

  it("uses the spec's subline verbatim, in every state", () => {
    for (const { answers } of everyScenario) {
      expect(buildResults(answers).subline).toBe(
        "Based on how diligence typically runs for Indian companies at your stage.",
      );
    }
  });
});

describe("the six Step 3 fixture scenarios", () => {
  it.each(FOUNDER_SCENARIOS.map((s) => ({ id: s.id, scenario: s })))(
    "produces a complete, self-consistent register — $id",
    ({ scenario }) => {
      const evaluation = evaluate(scenario.answers);
      const results = buildResults(scenario.answers);

      // The view layer never invents or drops a flag.
      expect(results.issueCount).toBe(evaluation.flags.length);
      expect(results.flags.map((flag) => flag.id)).toEqual(
        evaluation.flags.map((flag) => flag.id),
      );

      // Severity order survives, and the state matches the count.
      const severities = results.flags.map((flag) => flag.severity);
      const rank = { blocker: 0, delay: 1, cleanup: 2 } as const;
      expect(severities.map((s) => rank[s])).toEqual(
        [...severities.map((s) => rank[s])].sort((a, b) => a - b),
      );
      expect(results.state).toBe(
        results.issueCount === 0
          ? "clean"
          : results.issueCount === 1
            ? "single"
            : "multiple",
      );

      // Every flag renders a severity, a timing and an owner.
      for (const flag of results.flags) {
        expect(flag.severityLabel).not.toBe("");
        expect(flag.delayValue).not.toBe("");
        expect(flag.delayUnit).not.toBe("");
        expect(flag.fixedByLabel).not.toBe("");
      }

      // The split accounts for every flag exactly once.
      const splitIds = [
        ...(results.selfFix?.items ?? []),
        ...(results.needsSystem?.items ?? []),
      ].map((item) => item.id as FlagId);
      expect([...splitIds].sort()).toEqual(
        results.flags.map((flag) => flag.id).sort(),
      );

      // The headline always carries the count, and the clean state never does.
      const headline = headlineText(results.headline);
      if (results.issueCount === 0) {
        expect(results.clean).not.toBeNull();
        expect(headline).not.toMatch(/\d/);
      } else {
        expect(results.clean).toBeNull();
        expect(headline.startsWith(String(results.issueCount))).toBe(true);
      }

      expect(results.urgencyLine).not.toBe("");
      expect(isCompleteAnswers(scenario.answers)).toBe(true);
    },
  );

  it("reads the way the spec's worked example does, for the instrument-heavy seed", () => {
    const scenario = FOUNDER_SCENARIOS.find(
      (candidate) => candidate.id === "instrument-heavy-seed",
    )!;
    const results = buildResults(scenario.answers);

    expect(headlineText(results.headline)).toBe(
      "3 issues found · estimated 2–4 weeks of delay at close",
    );
    expect(results.flags.map((flag) => flag.id)).toEqual([
      "cap-table-source-of-truth",
      "instrument-stack-unmodelled",
      "founder-vesting-missing",
    ]);
    expect(headlineText(results.selfFix!.heading)).toBe(
      "1 of these you can fix yourself this week.",
    );
    expect(headlineText(results.needsSystem!.heading)).toBe(
      "2 of these need a system.",
    );
  });

  it("keeps the cross-border scenario honest about the indefinite item", () => {
    const scenario = FOUNDER_SCENARIOS.find(
      (candidate) => candidate.id === "cross-border-complexity",
    )!;
    const results = buildResults(scenario.answers);

    expect(headlineText(results.headline)).toContain(
      "plus an approval that runs on its own clock",
    );
    const pressNote3 = results.flags.find(
      (flag) => flag.id === "press-note-3-approval",
    );
    expect(pressNote3?.delayValue).toBe("—");
    expect(pressNote3?.delayUnit).toBe(
      "timing set by the approval, not by the work",
    );
  });
});

describe("isCompleteAnswers", () => {
  it("rejects a partially answered flow", () => {
    expect(isCompleteAnswers({ q1: "sheets" })).toBe(false);
    expect(isCompleteAnswers({ ...cleanAnswers, q2: [] })).toBe(false);
  });

  it("accepts a fully answered flow", () => {
    expect(isCompleteAnswers(cleanAnswers)).toBe(true);
  });
});
