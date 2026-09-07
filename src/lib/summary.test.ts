import { describe, expect, it } from "vitest";

import { CHECK_AREAS, CHECK_AREA_COUNT_WORD } from "./brand";
import { FOUNDER_SCENARIOS } from "./__fixtures__/scenarios";
import { evaluate } from "./evaluate";
import { FLAG_RULES, type Flag, type FlagId } from "./flags";
import type { Answers } from "./questions";
import { buildResults } from "./results";
import {
  FLAG_AXIS,
  READINESS_AXIS_ORDER,
  SEVERITY_GLYPH,
  SEVERITY_WORD,
  buildBenchmark,
  buildReadiness,
  buildStatTiles,
  buildTally,
  buildTimeline,
  type SummaryLabels,
} from "./summary";

/**
 * The summary band is the free half of the page under the Step 14 split, so
 * these are the assertions that protect what an anonymous founder is shown.
 * Three things are load-bearing and all three are checked here: no score, every
 * number also present as text, and severity never carried by colour alone.
 */

const LABELS: SummaryLabels = {
  severity: { blocker: "Blocker", delay: "Delay", cleanup: "Cleanup" },
  fixedBy: { you: "You", "ca-cs": "Your CA or CS", incentiv: "Incentiv" },
};

const CLEAN: Answers = {
  q1: "platform",
  q2: ["nothing"],
  q3: "approved_under_half",
  q4: "documented",
  q5: "current",
  q6: "none",
  q7: "rule_11ua_report",
  q8: "not_raising",
};

function flagsFor(answers: Answers): readonly Flag[] {
  return evaluate(answers).flags;
}

function ruleFor(id: FlagId): Flag {
  const rule = FLAG_RULES.find((candidate) => candidate.id === id);
  if (!rule) throw new Error(`no rule for ${id}`);
  return rule;
}

describe("the severity vocabulary", () => {
  it("gives every severity a glyph and a word, so colour is never the only channel", () => {
    for (const severity of ["blocker", "delay", "cleanup", "clear"] as const) {
      expect(SEVERITY_GLYPH[severity]).not.toBe("");
      expect(SEVERITY_WORD[severity]).not.toBe("");
    }
  });

  it("uses distinct glyphs, so the shapes cannot be confused in greyscale", () => {
    const glyphs = Object.values(SEVERITY_GLYPH);
    expect(new Set(glyphs).size).toBe(glyphs.length);
  });

  it("matches the words the register already uses", () => {
    const results = buildResults({ ...CLEAN, q1: "sheets", q4: "departed_founder" });
    for (const flag of results.flags) {
      expect(SEVERITY_WORD[flag.severity]).toBe(flag.severityLabel);
    }
  });
});

describe("stat tiles", () => {
  it("is a count and a time cost — never a score", () => {
    const [issues, delay] = buildStatTiles(flagsFor({ ...CLEAN, q1: "sheets" }));

    expect(issues.value).toBe("1");
    expect(issues.label).toBe("issue found");
    expect(delay.value).toBe("2–3");
    expect(delay.label).toBe("weeks of delay at close");
    expect(delay.note).toBe("estimated");
  });

  it("pluralises the issue label off the real count", () => {
    expect(buildStatTiles(flagsFor(CLEAN))[0].label).toBe("issues found");
    expect(
      buildStatTiles(flagsFor({ ...CLEAN, q1: "sheets", q5: "behind" }))[0].label,
    ).toBe("issues found");
  });

  it("reads zero and zero on a clean result", () => {
    const [issues, delay] = buildStatTiles(flagsFor(CLEAN));
    expect(issues.value).toBe("0");
    expect(delay.value).toBe("0");
    expect(delay.note).toBeNull();
  });

  it("never invents a week count for an approval that has no clock", () => {
    const onlyPressNote3 = flagsFor({ ...CLEAN, q6: "land_border_investor" });
    const [, delay] = buildStatTiles(onlyPressNote3);

    expect(delay.value).toBe("—");
    expect(delay.label).toBe("timing set by a government approval");
  });

  it("shows the timed range and names the approval when both are present", () => {
    const mixed = flagsFor({
      ...CLEAN,
      q1: "sheets",
      q6: "land_border_investor",
    });
    const [, delay] = buildStatTiles(mixed);

    expect(delay.value).toBe("2–3");
    expect(delay.note).toBe("plus an approval that runs on its own clock");
  });

  it("carries no percentage, no grade and no total out of anything", () => {
    for (const scenario of FOUNDER_SCENARIOS) {
      for (const tile of buildStatTiles(flagsFor(scenario.answers as Answers))) {
        expect(tile.value).not.toMatch(/%|\/\s*\d|out of/i);
        expect(`${tile.label} ${tile.note ?? ""}`.toLowerCase()).not.toMatch(
          /score|rating|grade/,
        );
      }
    }
  });
});

describe("the close timeline", () => {
  const scenario = FOUNDER_SCENARIOS[5]; // cross-border complexity — 7 flags
  const evaluation = evaluate(scenario.answers as Answers);
  const timeline = buildTimeline(
    evaluation.flags,
    evaluation.totalDelayWeeks,
    LABELS,
  );

  it("puts one lane on the rail for every flag, in severity order", () => {
    expect(timeline.lanes).toHaveLength(evaluation.flags.length);
    expect(timeline.lanes.map((lane) => lane.flagId)).toEqual(
      evaluation.flags.map((flag) => flag.id),
    );

    const weights = { blocker: 0, delay: 1, cleanup: 2 };
    const order = timeline.lanes.map((lane) => weights[lane.severity]);
    expect([...order].sort()).toEqual(order);
  });

  it("is relative — no calendar date anywhere on it", () => {
    const everyString = [
      timeline.startLabel,
      timeline.caption,
      timeline.criticalPathLabel,
      ...timeline.lanes.map((lane) => `${lane.tooltip} ${lane.weeksLabel}`),
    ].join(" ");

    // A month name only counts as a date when it sits next to a day or a year.
    // Two flag titles say an approval "may apply", and the modal verb is not a
    // calendar — the earlier bare `\bmay\b` failed on its own copy.
    expect(everyString).not.toMatch(/\b20\d\d\b/);
    expect(everyString).not.toMatch(
      /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d/i,
    );
    expect(everyString).not.toMatch(
      /\d\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/i,
    );
    expect(everyString).not.toMatch(
      /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|today's date)\b/i,
    );
    expect(timeline.startLabel).toBe("Diligence starts");
  });

  it("scales each bar against the axis, never past it", () => {
    for (const lane of timeline.lanes) {
      expect(lane.headFraction).toBeGreaterThan(0);
      expect(lane.headFraction + lane.tailFraction).toBeLessThanOrEqual(1.0001);
    }
  });

  it("gives every lane its weeks as text and a tooltip naming who fixes it", () => {
    for (const lane of timeline.lanes) {
      expect(lane.weeksLabel).not.toBe("");
      expect(lane.tooltip).toContain(lane.title);
      expect(lane.tooltip).toContain(lane.fixedByLabel);
      expect(lane.severityGlyph).toBe(SEVERITY_GLYPH[lane.severity]);
      expect(lane.severityWord).toBe(LABELS.severity[lane.severity]);
    }
  });

  it("draws the approval flag as open-ended rather than as a length", () => {
    const pressNote3 = timeline.lanes.find(
      (lane) => lane.flagId === "press-note-3-approval",
    );

    expect(pressNote3?.openEnded).toBe(true);
    expect(pressNote3?.weeksLabel).toBe("—");
    expect(pressNote3?.weeksMin).toBeNull();
    expect(timeline.criticalPathFraction).toBeNull();
  });

  it("says in words why the bars do not add up", () => {
    expect(timeline.caption).toContain("slowest");
    expect(timeline.caption).not.toContain("sum of the delays");
  });

  it("marks the critical path at the aggregate the headline already shows", () => {
    const single = evaluate({ ...CLEAN, q1: "sheets", q5: "behind" });
    const view = buildTimeline(single.flags, single.totalDelayWeeks, LABELS);

    expect(view.criticalPathLabel).toBe("Longest fix: 2–6 weeks");
    expect(view.criticalPathFraction).toBe(1);
  });

  it("keeps a floor under the axis so one short fix does not fill the rail", () => {
    const one = evaluate({ ...CLEAN, q7: "negotiated_no_report" }); // 1–2 weeks
    const view = buildTimeline(one.flags, one.totalDelayWeeks, LABELS);

    expect(view.axisMaxWeeks).toBe(4);
    expect(view.ticks[0]).toBe(0);
    expect(view.ticks[view.ticks.length - 1]).toBe(4);
  });

  it("holds an empty rail rather than a fake one when nothing fired", () => {
    const clean = evaluate(CLEAN);
    const view = buildTimeline(clean.flags, clean.totalDelayWeeks, LABELS);

    expect(view.lanes).toHaveLength(0);
    expect(view.axisMaxWeeks).toBe(4);
  });
});

describe("the readiness map", () => {
  it("always returns the six axes, in the specified order", () => {
    const axes = buildReadiness(flagsFor(CLEAN)).axes;
    expect(axes.map((axis) => axis.id)).toEqual([...READINESS_AXIS_ORDER]);
  });

  it("reads every axis clear when nothing fired", () => {
    for (const axis of buildReadiness(flagsFor(CLEAN)).axes) {
      expect(axis.level).toBe(3);
      expect(axis.statusWord).toBe("Clear");
      expect(axis.glyph).toBe("✓");
      expect(axis.flagCount).toBe(0);
    }
  });

  it("takes the worst severity on an axis, and never sums two flags into one", () => {
    // Both ESOP rules cannot fire together, so vesting is the axis with two
    // rules that can: a departed founder (blocker) outranks anything else.
    const both = buildReadiness([
      ruleFor("valuation-report-missing"), // cleanup, valuation
      ruleFor("cap-table-source-of-truth"), // delay, cap table
    ]).axes;

    expect(both.find((axis) => axis.id === "valuation")?.level).toBe(2);
    expect(both.find((axis) => axis.id === "cap-table")?.level).toBe(1);

    const twoOnFilings = buildReadiness([
      ruleFor("roc-filings-not-current"), // delay
      ruleFor("press-note-3-approval"), // blocker
    ]).axes.find((axis) => axis.id === "filings");

    expect(twoOnFilings?.level).toBe(0);
    expect(twoOnFilings?.statusWord).toBe("Blocker");
    expect(twoOnFilings?.flagCount).toBe(2);
  });

  it("gives every axis a status word and a glyph, not just a radius", () => {
    for (const scenario of FOUNDER_SCENARIOS) {
      for (const axis of buildReadiness(flagsFor(scenario.answers as Answers))
        .axes) {
        expect(axis.statusWord).toBe(SEVERITY_WORD[axis.severity]);
        expect(axis.glyph).toBe(SEVERITY_GLYPH[axis.severity]);
        expect(axis.label).not.toBe("");
      }
    }
  });

  it("says out loud that the shape exaggerates", () => {
    const caption = buildReadiness([]).caption.toLowerCase();
    expect(caption).toContain("square");
    expect(caption).toContain("register");
  });

  it("gives every rule in the table an axis, so none can go quietly missing", () => {
    for (const rule of FLAG_RULES) {
      expect(READINESS_AXIS_ORDER).toContain(FLAG_AXIS[rule.id as FlagId]);
    }

    // Every axis is reachable — an axis no rule can ever flag would be a
    // permanently clear vertex flattering the shape.
    const covered = new Set(FLAG_RULES.map((rule) => FLAG_AXIS[rule.id as FlagId]));
    expect([...READINESS_AXIS_ORDER].every((id) => covered.has(id))).toBe(true);
  });
});

describe("the benchmark bar", () => {
  it("puts the founder's count against the typical band, in words", () => {
    const view = buildBenchmark(2);

    expect(view.count).toBe(2);
    expect(view.bandMin).toBe(3);
    expect(view.bandMax).toBe(5);
    expect(view.caption).toBe(
      "Companies at your stage typically carry 3–5. You have 2.",
    );
  });

  it("reads correctly at both ends", () => {
    expect(buildBenchmark(0).caption).toContain("You have 0.");
    expect(buildBenchmark(7).caption).toContain("You have 7.");
  });

  it("clamps the marker to the scale without lying about the count", () => {
    const view = buildBenchmark(11);
    expect(view.count).toBe(9);
    expect(view.caption).toContain("You have 11.");
  });

  it("never renders as a score out of anything", () => {
    expect(buildBenchmark(4).caption).not.toMatch(/%|out of|\/\s*\d/);
  });
});

/* --- The tally strip — Step 15 --------------------------------------------- */

describe("the tally strip", () => {
  /**
   * The three cells partition the nine check areas. This is the property that
   * keeps the strip from becoming the score the tool refuses to produce: three
   * numbers that always add to one stated total are a distribution, not a mark.
   */
  it("always adds to the number of check areas, in every scenario", () => {
    const cases: Answers[] = [
      CLEAN,
      ...FOUNDER_SCENARIOS.map((scenario) => scenario.answers as Answers),
    ];

    for (const answers of cases) {
      const tally = buildTally(flagsFor(answers));
      const total = tally.cells.reduce((sum, cell) => sum + cell.value, 0);
      expect(total).toBe(CHECK_AREAS.length);
    }
  });

  it("says nine clear and nothing else when nothing fired", () => {
    const tally = buildTally(flagsFor(CLEAN));

    expect(tally.cells.map((cell) => [cell.id, cell.value])).toEqual([
      ["blocking", 0],
      ["tidy", 0],
      ["clear", CHECK_AREAS.length],
    ]);
  });

  /**
   * Areas, not flags. Two findings on the "Foreign capital and FEMA" area are
   * one area in trouble, not two — the same coarseness the readiness map uses,
   * for the same reason: a second finding on one axis is not twice the problem.
   */
  it("counts an area once however many findings landed on it", () => {
    // Built from the rules rather than from answers: no single answer set fires
    // both foreign-capital rules, and the point under test is the area maths,
    // not which answers reach it.
    const area = CHECK_AREAS.find(
      (candidate) => candidate.label === "Foreign capital and FEMA",
    );
    expect(area?.flagIds.length).toBe(2);

    const twoOnOneArea = (area?.flagIds ?? []).map(ruleFor);
    const tally = buildTally(twoOnOneArea);

    expect(tally.cells[0].value + tally.cells[1].value).toBe(1);
    expect(tally.cells[2].value).toBe(CHECK_AREAS.length - 1);
  });

  it("files an area under blocking when any finding on it is a blocker", () => {
    const blocker = ruleFor("departed-founder-equity");
    expect(blocker.severity).toBe("blocker");

    const tally = buildTally([blocker]);
    expect(tally.cells[0].value).toBe(1);
    expect(tally.cells[1].value).toBe(0);
    expect(tally.cells[2].value).toBe(CHECK_AREAS.length - 1);
  });

  it("names the denominator out loud, and never as a fraction", () => {
    const tally = buildTally(flagsFor({ ...CLEAN, q1: "sheets" }));

    expect(tally.caption).toContain(CHECK_AREA_COUNT_WORD);
    expect(tally.caption).not.toMatch(/%|out of|\/\s*\d/);
    for (const cell of tally.cells) {
      expect(cell.label).not.toBe("");
    }
  });
});
