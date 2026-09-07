import { CHECK_AREAS, CHECK_AREA_COUNT_WORD } from "./brand";
import type { DelayRange } from "./evaluate";
import type { FixedBy, Flag, FlagId, FlagSeverity } from "./flags";

/**
 * The summary band on the results screen, as data.
 *
 * Same arrangement as `results.ts` and `gate.ts`: every number and every word
 * that appears in the three visuals is decided here, in a pure module, so the
 * honesty rules can be enforced by tests rather than by review. The SVG
 * components in `summary-visuals.tsx` do geometry and nothing else.
 *
 * Three rules govern this file:
 *
 *   1. **Nothing here is a score.** The stat tiles are a count and a time cost.
 *      The readiness levels are a coarse 0–3 restatement of the severity that
 *      actually fired on that axis — not a weighted average, and never summed.
 *   2. **Every number in a visual is also text.** Each structure below carries
 *      its own label and status word, so a component can render the shape and
 *      the words from the same source and neither can drift from the other.
 *   3. **Severity is never colour alone.** Every severity carries a `glyph` and
 *      a `word` here, so a component cannot render one without the other.
 */

/* --- The severity vocabulary ------------------------------------------------

   BUILD-PROMPTS-PHASE2.md's validated palette. Amber ↔ green fails colour-vision
   separation at the strict threshold, which is unavoidable for a red/amber/green
   convention — so the mitigation is structural: the glyph and the word travel
   with the severity everywhere, and the colour is the third channel, never the
   first. */

export type SummarySeverity = FlagSeverity | "clear";

export const SEVERITY_GLYPH: Record<SummarySeverity, string> = {
  blocker: "▲",
  delay: "●",
  cleanup: "○",
  clear: "✓",
};

export const SEVERITY_WORD: Record<SummarySeverity, string> = {
  blocker: "Blocker",
  delay: "Delay",
  cleanup: "Cleanup",
  clear: "Clear",
};

/* --- Stat tiles ------------------------------------------------------------ */

export interface StatTile {
  id: "issues" | "delay";
  /** The numeral. IBM Plex Mono 300 at display size. "2", "2–4", "—". */
  value: string;
  /** Inter small, muted ink, under the numeral. */
  label: string;
  /** A qualifier the label cannot carry on its own. Null when there is none. */
  note: string | null;
}

/* --- The close timeline ---------------------------------------------------- */

export interface TimelineLane {
  flagId: FlagId;
  title: string;
  severity: FlagSeverity;
  severityWord: string;
  severityGlyph: string;
  fixedByLabel: string;
  /** Null on both when the timing belongs to an approval, not to the work. */
  weeksMin: number | null;
  weeksMax: number | null;
  /** "2–3", or "—". The text equivalent of the bar's length. */
  weeksLabel: string;
  /** Fraction of the axis the solid head occupies, 0–1. */
  headFraction: number;
  /** Fraction of the axis the lighter min–max tail occupies, 0–1. */
  tailFraction: number;
  /** True where the bar runs off the end rather than stopping. */
  openEnded: boolean;
  /** Everything a hover tooltip says, as one sentence. */
  tooltip: string;
}

export interface TimelineView {
  lanes: readonly TimelineLane[];
  /** The right-hand end of the relative week axis. Never a date. */
  axisMaxWeeks: number;
  /** Week numbers along the axis, always including 0. */
  ticks: readonly number[];
  /** The marker at week 0. The rail is relative — we never asked for a date. */
  startLabel: string;
  /** The aggregate, restated: the slowest fix, not the sum of all of them. */
  criticalPathLabel: string;
  criticalPathFraction: number | null;
  /** Why the lanes do not add up. Always shown; it is the model in one line. */
  caption: string;
}

/* --- The readiness map ----------------------------------------------------- */

export type ReadinessAxisId =
  | "cap-table"
  | "instruments"
  | "esop"
  | "vesting"
  | "filings"
  | "valuation";

export interface ReadinessAxis {
  id: ReadinessAxisId;
  label: string;
  /** Coarse, and deliberately so: 3 clear · 2 cleanup · 1 delay · 0 blocker. */
  level: 0 | 1 | 2 | 3;
  severity: SummarySeverity;
  statusWord: string;
  glyph: string;
  /** How many flags fired on this axis. Text, so the shape is never the only place. */
  flagCount: number;
}

export interface ReadinessView {
  axes: readonly ReadinessAxis[];
  /** The honest note. A radar exaggerates; the register is the source of truth. */
  caption: string;
}

/* --- The benchmark bar ----------------------------------------------------- */

export interface BenchmarkView {
  count: number;
  scaleMax: number;
  bandMin: number;
  bandMax: number;
  bandLabel: string;
  /** "Companies at your stage typically carry 3–5. You have 2." */
  caption: string;
}

/* --- The tally strip — Step 15 ---------------------------------------------

   Three cells that partition the nine check areas: the ones with a blocker on
   them, the ones with something smaller, and the ones with nothing.

   It is NOT a score, and the shape of it is what keeps it from becoming one.
   The three cells always add to the same nine, so no cell is a mark out of a
   total — "6 clear" is a statement about six areas, not six points. Nothing is
   weighted, nothing is averaged, and no cell is ever shown on its own. */

export interface TallyCell {
  id: "blocking" | "tidy" | "clear";
  /** Areas, not flags. Two delay findings on one area count as one area. */
  value: number;
  label: string;
}

export interface TallyView {
  cells: readonly [TallyCell, TallyCell, TallyCell];
  /** Names the denominator out loud, so the three numbers cannot read as a
   *  score out of something the page never states. */
  caption: string;
}

/**
 * The two label maps `results.ts` already owns, passed in rather than
 * duplicated. This module decides shapes and numbers; `results.ts` stays the
 * one place a severity or an owner is put into words.
 */
export interface SummaryLabels {
  severity: Record<FlagSeverity, string>;
  fixedBy: Record<FixedBy, string>;
}

export interface SummaryView {
  stats: readonly [StatTile, StatTile];
  tally: TallyView;
  timeline: TimelineView;
  readiness: ReadinessView;
  benchmark: BenchmarkView;
}

/**
 * The band's own headings. Fixed strings rather than functions because none of
 * them varies with the answers — but they live here, not in the component, for
 * the same reason every other string does: the component writes no copy, so a
 * test can hold the whole page's vocabulary without a DOM.
 */
export const SUMMARY_COPY = {
  sectionLabel: "The shape of it",
  heading: "Where the weeks go, and how it compares",
  timelineTitle: "Time cost at close",
  readinessTitle: "Where it sits",
  benchmarkTitle: "Against your stage",
} as const;

const TALLY_LABEL = {
  blocking: "Blocking",
  tidy: "To tidy",
  clear: "Clear",
} as const;

const EN_DASH = "–";

/* --- Stat tiles ------------------------------------------------------------ */

function formatRange(min: number, max: number): string {
  return min === max ? String(min) : `${min}${EN_DASH}${max}`;
}

/**
 * Two numbers, and they are the whole hero. A count and a time cost — the same
 * two figures the headline has always carried, set as a KPI row rather than as
 * a sentence, because two headline numbers inside one serif sentence is a
 * paragraph pretending to be a stat.
 */
export function buildStatTiles(
  flags: readonly Flag[],
): readonly [StatTile, StatTile] {
  const issues: StatTile = {
    id: "issues",
    value: String(flags.length),
    label: flags.length === 1 ? "issue found" : "issues found",
    note: null,
  };

  const timed = flags.filter(
    (flag) => flag.delayWeeksMin !== null && flag.delayWeeksMax !== null,
  );
  const hasIndefinite = timed.length < flags.length;

  if (flags.length === 0) {
    return [
      issues,
      {
        id: "delay",
        value: "0",
        label: "weeks of delay at close",
        note: null,
      },
    ];
  }

  // Only the Press Note 3 flag is indefinite. On its own there is no week count
  // to show, and inventing one would be the least honest number on the page.
  if (timed.length === 0) {
    return [
      issues,
      {
        id: "delay",
        value: "—",
        label: "timing set by a government approval",
        note: null,
      },
    ];
  }

  const min = Math.max(...timed.map((flag) => flag.delayWeeksMin as number));
  const max = Math.max(...timed.map((flag) => flag.delayWeeksMax as number));

  return [
    issues,
    {
      id: "delay",
      value: formatRange(min, max),
      label: "weeks of delay at close",
      note: hasIndefinite
        ? "plus an approval that runs on its own clock"
        : "estimated",
    },
  ];
}

/* --- The close timeline ---------------------------------------------------- */

/**
 * The axis is relative and always starts at "diligence starts": the tool never
 * asks for a close date, so a calendar date anywhere on this rail would be
 * invented. Four weeks is the floor so a single one-week finding does not draw
 * a bar that fills the container.
 */
function axisMaxFor(flags: readonly Flag[]): number {
  const maxima = flags
    .map((flag) => flag.delayWeeksMax)
    .filter((weeks): weeks is number => weeks !== null);

  return Math.max(4, ...(maxima.length > 0 ? maxima : [0]));
}

function ticksFor(axisMax: number): readonly number[] {
  const step = axisMax <= 6 ? 1 : axisMax <= 12 ? 2 : 4;
  const ticks: number[] = [];
  for (let week = 0; week <= axisMax; week += step) {
    ticks.push(week);
  }
  if (ticks[ticks.length - 1] !== axisMax) ticks.push(axisMax);
  return ticks;
}

/**
 * One lane per flag, all starting at week 0, all on one axis.
 *
 * They start together because that is exactly what `aggregateParallelDelay`
 * assumes: remediation runs in parallel, so the cost at close is the slowest
 * fix rather than the sum. Laying the flags end to end in a single band would
 * draw a total the headline contradicts, and a founder reading both would be
 * right to call it a bug.
 */
export function buildTimeline(
  flags: readonly Flag[],
  totalDelayWeeks: DelayRange,
  labels: SummaryLabels,
): TimelineView {
  const axisMaxWeeks = axisMaxFor(flags);

  const lanes: TimelineLane[] = flags.map((flag) => {
    const indefinite = flag.delayWeeksMin === null || flag.delayWeeksMax === null;
    const severityWord = labels.severity[flag.severity];
    const fixedByLabel = labels.fixedBy[flag.fixedBy];

    if (indefinite) {
      return {
        flagId: flag.id as FlagId,
        title: flag.title,
        severity: flag.severity,
        severityWord,
        severityGlyph: SEVERITY_GLYPH[flag.severity],
        fixedByLabel,
        weeksMin: null,
        weeksMax: null,
        weeksLabel: "—",
        // A third of the rail, then it runs off the end: enough to read as a
        // real bar, never enough to read as a measured length.
        headFraction: 0.34,
        tailFraction: 0.66,
        openEnded: true,
        tooltip: `${flag.title} — timing set by the approval, not by the work. Fixed by ${fixedByLabel}.`,
      };
    }

    const weeksMin = flag.delayWeeksMin as number;
    const weeksMax = flag.delayWeeksMax as number;
    const weeksLabel = formatRange(weeksMin, weeksMax);

    return {
      flagId: flag.id as FlagId,
      title: flag.title,
      severity: flag.severity,
      severityWord,
      severityGlyph: SEVERITY_GLYPH[flag.severity],
      fixedByLabel,
      weeksMin,
      weeksMax,
      weeksLabel,
      headFraction: weeksMin / axisMaxWeeks,
      tailFraction: (weeksMax - weeksMin) / axisMaxWeeks,
      openEnded: false,
      tooltip: `${flag.title} — ${weeksLabel} ${weeksMax === 1 ? "week" : "weeks"} at close. Fixed by ${fixedByLabel}.`,
    };
  });

  const criticalPathWeeks = totalDelayWeeks.max;

  return {
    lanes,
    axisMaxWeeks,
    ticks: ticksFor(axisMaxWeeks),
    startLabel: "Diligence starts",
    criticalPathLabel:
      criticalPathWeeks === null
        ? "One item runs on an approval clock, so there is no end marker to draw."
        : `Longest fix: ${formatRange(totalDelayWeeks.min as number, criticalPathWeeks)} weeks`,
    criticalPathFraction:
      criticalPathWeeks === null ? null : criticalPathWeeks / axisMaxWeeks,
    caption:
      "Every fix starts the day diligence does, so the cost at close is the slowest one — not the sum of the bars.",
  };
}

/* --- The readiness map ----------------------------------------------------- */

const AXIS_LABEL: Record<ReadinessAxisId, string> = {
  "cap-table": "Cap table",
  instruments: "Instruments",
  esop: "ESOP",
  vesting: "Vesting",
  filings: "Filings",
  valuation: "Valuation",
};

export const READINESS_AXIS_ORDER: readonly ReadinessAxisId[] = [
  "cap-table",
  "instruments",
  "esop",
  "vesting",
  "filings",
  "valuation",
];

/**
 * Which of the six areas each rule speaks to.
 *
 * Exhaustive over `FlagId` on purpose: a new flag added to `flags.ts` without a
 * home here is a type error rather than an axis that silently stays clear.
 */
export const FLAG_AXIS: Record<FlagId, ReadinessAxisId> = {
  "cap-table-source-of-truth": "cap-table",
  "instrument-stack-unmodelled": "instruments",
  "outstanding-instruments-unknown": "instruments",
  "esop-pool-not-approved": "esop",
  "esop-pool-over-granted": "esop",
  "founder-vesting-missing": "vesting",
  "departed-founder-equity": "vesting",
  "roc-filings-not-current": "filings",
  "foreign-capital-filings-unclear": "filings",
  "press-note-3-approval": "filings",
  "valuation-report-missing": "valuation",
};

/** 3 is clear. Each severity steps the axis down by its own weight, once. */
const LEVEL_FOR: Record<FlagSeverity, 0 | 1 | 2> = {
  blocker: 0,
  delay: 1,
  cleanup: 2,
};

const LEVEL_SEVERITY: Record<0 | 1 | 2 | 3, SummarySeverity> = {
  0: "blocker",
  1: "delay",
  2: "cleanup",
  3: "clear",
};

/**
 * A coarse 0–3 per axis, taken from the worst severity that actually fired
 * there. Not a continuous score, not an average, and not summed: two delay
 * flags on one axis read the same as one, because two delays are not twice as
 * disqualifying and pretending otherwise would be inventing data. The count
 * travels alongside as text so nothing is lost.
 */
export function buildReadiness(flags: readonly Flag[]): ReadinessView {
  const axes = READINESS_AXIS_ORDER.map((id): ReadinessAxis => {
    const onAxis = flags.filter((flag) => FLAG_AXIS[flag.id as FlagId] === id);

    const level = onAxis.reduce<0 | 1 | 2 | 3>(
      (worst, flag) => Math.min(worst, LEVEL_FOR[flag.severity]) as 0 | 1 | 2 | 3,
      3,
    );

    const severity = LEVEL_SEVERITY[level];

    return {
      id,
      label: AXIS_LABEL[id],
      level,
      severity,
      statusWord: SEVERITY_WORD[severity],
      glyph: SEVERITY_GLYPH[severity],
      flagCount: onAxis.length,
    };
  });

  return {
    axes,
    caption:
      "A shape, not a measurement: the area inside it grows with the square of each value, so it overstates the difference between a clear axis and a flagged one. The register above is the record.",
  };
}

/* --- The benchmark bar ----------------------------------------------------- */

/**
 * CALIBRATE — the 3–5 band is an estimate, exactly like every delay range in
 * `flags.ts`. It is the advisory team's read of what a seed-to-Series-A Indian
 * company typically carries into diligence, not a measured distribution, and it
 * has to be replaced from real data before launch alongside the week counts.
 */
const TYPICAL_BAND_MIN = 3;
const TYPICAL_BAND_MAX = 5;
const BENCHMARK_SCALE_MAX = 9;

/**
 * What two issues mean. Without this a small count reads as "nothing found",
 * and the founder closes the page — which is the wrong conclusion from a real
 * blocker, and the wrong conclusion from a genuinely clean record too.
 */
export function buildBenchmark(issueCount: number): BenchmarkView {
  const count = Math.min(issueCount, BENCHMARK_SCALE_MAX);

  return {
    count,
    scaleMax: BENCHMARK_SCALE_MAX,
    bandMin: TYPICAL_BAND_MIN,
    bandMax: TYPICAL_BAND_MAX,
    bandLabel: "typical at your stage",
    caption: `Companies at your stage typically carry ${TYPICAL_BAND_MIN}${EN_DASH}${TYPICAL_BAND_MAX}. You have ${issueCount}.`,
  };
}

/* --- The tally strip — Step 15 --------------------------------------------- */

/**
 * Partitions the nine check areas by the worst thing that fired on each.
 *
 * Areas rather than flags, for the same reason the readiness map is coarse: two
 * delay findings on one area are not twice the problem, and a strip whose three
 * numbers did not add to a stated total would read as a mark out of nothing.
 * `brand.test.ts` holds `CHECK_AREAS` to the rules table, so a new rule lands in
 * one of these three cells rather than falling out of the count.
 */
export function buildTally(flags: readonly Flag[]): TallyView {
  const fired = new Map<FlagId, FlagSeverity>(
    flags.map((flag) => [flag.id as FlagId, flag.severity]),
  );

  let blocking = 0;
  let tidy = 0;
  let clear = 0;

  for (const area of CHECK_AREAS) {
    const severities = area.flagIds
      .map((id) => fired.get(id))
      .filter((severity): severity is FlagSeverity => severity !== undefined);

    if (severities.length === 0) {
      clear += 1;
    } else if (severities.includes("blocker")) {
      blocking += 1;
    } else {
      tidy += 1;
    }
  }

  return {
    cells: [
      { id: "blocking", value: blocking, label: TALLY_LABEL.blocking },
      { id: "tidy", value: tidy, label: TALLY_LABEL.tidy },
      { id: "clear", value: clear, label: TALLY_LABEL.clear },
    ],
    caption: `Across the ${CHECK_AREA_COUNT_WORD} areas this check looks at.`,
  };
}

export function buildSummary(
  flags: readonly Flag[],
  totalDelayWeeks: DelayRange,
  labels: SummaryLabels,
): SummaryView {
  return {
    stats: buildStatTiles(flags),
    tally: buildTally(flags),
    timeline: buildTimeline(flags, totalDelayWeeks, labels),
    readiness: buildReadiness(flags),
    benchmark: buildBenchmark(flags.length),
  };
}
