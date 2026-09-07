import {
  evaluate,
  type DelayRange,
  type EvaluationResult,
  type Urgency,
} from "./evaluate";
import { FLAG_GUIDANCE } from "./guidance";
import {
  INSTRUMENT_OPTION_IDS,
  type FixedBy,
  type Flag,
  type FlagId,
  type FlagSeverity,
} from "./flags";
import { buildConversion, type ConversionContent } from "./pitch";
import { QUESTIONS, type Answers, type QuestionId } from "./questions";
import { buildSummary, type SummaryLabels, type SummaryView } from "./summary";

/**
 * The results screen as data. Pure, framework-free, and the single place every
 * user-visible string on that screen is decided — so the copy rules in
 * CLAUDE.md can be enforced by tests rather than by review.
 *
 * Two rules govern everything below:
 *   1. No score. Never a 0–100, never a weighted average. The headline is a
 *      count and a time cost (tool-spec-v1.md §3).
 *   2. Every line traces to something the founder actually answered — which is
 *      why each flag carries `answerEcho`, the founder's own selected option.
 */

/**
 * Headlines mix two typefaces: DM Serif Display italic for words, IBM Plex Mono
 * for every numeral (DESIGN.md §3 — numbers are never set in the serif or in
 * Inter). Splitting the line into segments is what lets the renderer honour
 * that without parsing strings.
 */
export type HeadlineSegment =
  | { kind: "text"; value: string }
  | { kind: "number"; value: string };

export interface ResultFlagView {
  id: FlagId;
  questionId: QuestionId;
  title: string;
  whyInvestorAsks: string;
  severity: FlagSeverity;
  severityLabel: string;
  /** "4–8", or "—" when the timing is set by a process rather than by work. */
  delayValue: string;
  /** "weeks at close", or the reason there is no week count. */
  delayUnit: string;
  fixedBy: FixedBy;
  fixedByLabel: string;
  /** The founder's own answer, verbatim. This is the audit trail for the flag. */
  answerEcho: string;
}

export interface GuidanceView {
  id: FlagId;
  flagTitle: string;
  actionHeadline: string;
  steps: readonly string[];
  systemReason?: string;
}

export interface SplitColumn {
  count: number;
  heading: readonly HeadlineSegment[];
  intro: string;
  items: readonly GuidanceView[];
}

export interface ResultsContent {
  /** Drives the layout treatment, not the copy. */
  state: "clean" | "single" | "multiple";
  issueCount: number;
  /** The founder's Q8 answer, mapped. Drives CTA copy and analytics. */
  urgency: Urgency;
  /** The aggregate range behind the headline. Null bounds mean indefinite. */
  totalDelayWeeks: DelayRange;
  headline: readonly HeadlineSegment[];
  subline: string;
  /** How the severities read together. Null only in the clean state. */
  severityLine: string | null;
  /** What their raise timing (Q8) means for the list above. Always present. */
  urgencyLine: string;
  /** Extra weight for a lone flag, so one issue does not read as an anticlimax. */
  soloEmphasis: string | null;
  flags: readonly ResultFlagView[];
  selfFix: SplitColumn | null;
  needsSystem: SplitColumn | null;
  /** Only populated in the clean state. */
  clean: CleanContent | null;
  /** The stat tiles and the three summary visuals. See `src/lib/summary.ts`. */
  summary: SummaryView;
  /** The pitch, cross-links and email capture. See `src/lib/pitch.ts`. */
  conversion: ConversionContent;
}

export interface CleanContent {
  /** Each item is one thing the founder told us, echoed back. */
  confirmations: readonly string[];
  /** What this check does not cover. Congratulatory, not smug. */
  caveat: string;
  nextStepHeading: string;
  nextSteps: readonly string[];
}

const EN_DASH = "–";

export const SEVERITY_LABEL: Record<FlagSeverity, string> = {
  blocker: "Blocker",
  delay: "Delay",
  cleanup: "Cleanup",
};

export const FIXED_BY_LABEL: Record<FixedBy, string> = {
  you: "You",
  "ca-cs": "Your CA or CS",
  incentiv: "Incentiv",
};

/** The two label maps, handed to `summary.ts` so the visuals and the register
 *  put a severity or an owner into words in exactly one place. */
const SUMMARY_LABELS: SummaryLabels = {
  severity: SEVERITY_LABEL,
  fixedBy: FIXED_BY_LABEL,
};

/**
 * Counts inside body sentences are spelled out; counts inside the display
 * headings stay as numerals, because those are stats and DESIGN.md sets stats
 * in IBM Plex Mono. Eleven is the maximum number of flags in the table.
 */
const COUNT_WORD = [
  "None",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
] as const;

const OPTION_LABELS: Record<string, Record<string, string>> = Object.fromEntries(
  QUESTIONS.map((question) => [
    question.id,
    Object.fromEntries(
      question.options.map((option) => [option.id, option.label]),
    ),
  ]),
);

function optionLabel(questionId: string, optionId: string): string {
  return OPTION_LABELS[questionId]?.[optionId] ?? optionId;
}

/** The founder's own words, so every flag can be traced back to one answer. */
function answerEcho(answers: Answers, flag: Flag): string {
  const { trigger } = flag;

  if (trigger.kind === "one-of") {
    return optionLabel(trigger.questionId, answers[trigger.questionId]);
  }

  if (trigger.kind === "includes") {
    return optionLabel(trigger.questionId, trigger.optionId);
  }

  const selected = new Set<string>(answers.q2);
  return INSTRUMENT_OPTION_IDS.filter((id) => selected.has(id))
    .map((id) => optionLabel("q2", id))
    .join(", ");
}

function formatRange(min: number, max: number): string {
  return min === max ? String(min) : `${min}${EN_DASH}${max}`;
}

function toFlagView(answers: Answers, flag: Flag): ResultFlagView {
  const isIndefinite = flag.delayWeeksMin === null || flag.delayWeeksMax === null;

  return {
    id: flag.id as FlagId,
    questionId: flag.trigger.questionId,
    title: flag.title,
    whyInvestorAsks: flag.whyInvestorAsks,
    severity: flag.severity,
    severityLabel: SEVERITY_LABEL[flag.severity],
    delayValue: isIndefinite
      ? "—"
      : formatRange(flag.delayWeeksMin as number, flag.delayWeeksMax as number),
    delayUnit: isIndefinite
      ? "timing set by the approval, not by the work"
      : "weeks at close",
    fixedBy: flag.fixedBy,
    fixedByLabel: FIXED_BY_LABEL[flag.fixedBy],
    answerEcho: answerEcho(answers, flag),
  };
}

function buildHeadline(flags: readonly Flag[]): readonly HeadlineSegment[] {
  if (flags.length === 0) {
    return [{ kind: "text", value: "Nothing here that typically delays a close." }];
  }

  const noun = flags.length === 1 ? " issue found" : " issues found";
  const count: HeadlineSegment[] = [
    { kind: "number", value: String(flags.length) },
    { kind: "text", value: noun },
  ];

  const timed = flags.filter(
    (flag) => flag.delayWeeksMin !== null && flag.delayWeeksMax !== null,
  );
  const hasIndefinite = timed.length < flags.length;

  // Only the Press Note 3 flag is indefinite, and on its own the honest headline
  // is that the clock belongs to an approval process rather than to the founder.
  if (timed.length === 0) {
    return [
      ...count,
      { kind: "text", value: " · timing set by a government approval" },
    ];
  }

  const range = formatRange(
    Math.max(...timed.map((flag) => flag.delayWeeksMin as number)),
    Math.max(...timed.map((flag) => flag.delayWeeksMax as number)),
  );

  if (hasIndefinite) {
    return [
      ...count,
      { kind: "text", value: " · " },
      { kind: "number", value: range },
      {
        kind: "text",
        value: " weeks of delay, plus an approval that runs on its own clock",
      },
    ];
  }

  return [
    ...count,
    { kind: "text", value: " · estimated " },
    { kind: "number", value: range },
    { kind: "text", value: " weeks of delay at close" },
  ];
}

function buildSeverityLine(flags: readonly Flag[]): string | null {
  if (flags.length === 0) {
    return null;
  }

  const blockers = flags.filter((flag) => flag.severity === "blocker").length;

  if (flags.length === 1) {
    return blockers === 1
      ? "It is a blocker — the kind of item investors treat as a condition to close rather than a nice-to-have."
      : "It is not a blocker. This is the kind of item that slows a close rather than stopping one, and it is far cheaper to clear before a term sheet exists than during diligence.";
  }

  if (blockers === 0) {
    return "None of these is a blocker. They slow a close rather than stopping one — but investors raise them in the same conversation, so they tend to arrive together.";
  }

  const word = COUNT_WORD[blockers] ?? String(blockers);
  const verb = blockers === 1 ? "is a blocker" : "are blockers";
  return `${word} of these ${verb} — the kind of item investors treat as a condition to close rather than a nice-to-have.`;
}

const URGENCY_LINE: Record<Urgency, string> = {
  live: "You told us a term sheet is in hand or diligence has started. These are being looked at now, so the work below runs alongside the process rather than after it.",
  near: "You told us you are raising in the next one to three months. On these estimates the work has to start now to stay off the critical path.",
  planning:
    "You told us you are six or more months out. That is the cheapest moment this list will ever cost you — none of it is on the critical path yet.",
  none: "You told us you are not raising right now. Nothing here is urgent today, and all of it is materially cheaper to clear before a term sheet exists than during diligence.",
};

const URGENCY_LINE_CLEAN: Record<Urgency, string> = {
  live: "You told us a term sheet is in hand or diligence has started — which is exactly when this position is worth the most.",
  near: "You told us you are raising in the next one to three months. Nothing on this list should slow that down.",
  planning:
    "You told us you are six or more months out. The work now is keeping this true, not fixing it.",
  none: "You told us you are not raising right now. The work is keeping this true until you are.",
};

function buildSplit(
  flags: readonly Flag[],
  kind: "self" | "system",
): SplitColumn | null {
  if (flags.length === 0) {
    return null;
  }

  const heading: HeadlineSegment[] = [
    { kind: "number", value: String(flags.length) },
    {
      kind: "text",
      value:
        kind === "self"
          ? " of these you can fix yourself this week."
          : flags.length === 1
            ? " of these needs a system."
            : " of these need a system.",
    },
  ];

  const intro =
    kind === "self"
      ? "Specific enough to act on today. No email, no call, no gate."
      : "These stay fixed only if something keeps them fixed. Here is the first move you can make on each one yourself regardless.";

  return {
    count: flags.length,
    heading,
    intro,
    items: flags.map((flag) => {
      const guidance = FLAG_GUIDANCE[flag.id as FlagId];
      return {
        id: flag.id as FlagId,
        flagTitle: flag.title,
        actionHeadline: guidance.actionHeadline,
        steps: guidance.steps,
        ...(guidance.systemReason ? { systemReason: guidance.systemReason } : {}),
      };
    }),
  };
}

/**
 * The clean state has to be congratulatory without being smug, which means it
 * has to say what it actually checked. Every confirmation below is one of the
 * founder's own answers read back.
 */
function buildCleanContent(answers: Answers): CleanContent {
  const confirmations: string[] = [];

  if (answers.q1 === "platform") {
    confirmations.push("your cap table sits on a platform rather than in a file");
  }
  if (answers.q2.includes("nothing")) {
    confirmations.push("there is nothing outstanding beyond ordinary equity");
  } else {
    confirmations.push("you know exactly what is outstanding beyond ordinary equity");
  }
  if (answers.q3 === "approved_under_half" || answers.q3 === "approved_mostly_granted") {
    confirmations.push("your ESOP pool is approved and grants fit inside it");
  }
  if (answers.q4 === "documented") {
    confirmations.push("every founder is on documented vesting");
  }
  if (answers.q5 === "current") {
    confirmations.push("ROC and MCA filings are current");
  }
  if (answers.q6 === "none") {
    confirmations.push("there is no foreign capital on the cap table");
  }
  if (answers.q6 === "fc_gpr_on_time") {
    confirmations.push("FC-GPR was filed on time for the foreign capital you took");
  }
  if (answers.q7 === "rule_11ua_report") {
    confirmations.push("the last round's price is supported by a valuation report");
  }
  if (answers.q7 === "no_priced_round") {
    confirmations.push("there has been no priced round to defend yet");
  }

  return {
    confirmations,
    caveat:
      "This check covers the eight things that most often stall an Indian round. It is not a diligence review — it does not look at your contracts, IP assignments, employment records or tax positions, and investors will.",
    nextStepHeading: "What keeps it that way",
    nextSteps: [
      "The record drifts at three moments: a new grant, a new instrument, a new round. Each one carries a filing with a clock attached.",
      "The clocks worth knowing: PAS-3 within 30 days of any allotment, FC-GPR within 30 days of an allotment to a non-resident, and MGT-14 wherever a resolution requires it.",
      "Come back after any of those three things happen. Diligence-ready is a state you hold, not one you reach.",
    ],
  };
}

export function buildResults(answers: Answers): ResultsContent {
  const evaluation: EvaluationResult = evaluate(answers);
  const { flags } = evaluation;

  const state: ResultsContent["state"] =
    flags.length === 0 ? "clean" : flags.length === 1 ? "single" : "multiple";

  return {
    state,
    issueCount: flags.length,
    urgency: evaluation.urgency,
    totalDelayWeeks: evaluation.totalDelayWeeks,
    headline: buildHeadline(flags),
    subline:
      "Based on how diligence typically runs for Indian companies at your stage.",
    severityLine: buildSeverityLine(flags),
    urgencyLine:
      state === "clean"
        ? URGENCY_LINE_CLEAN[evaluation.urgency]
        : URGENCY_LINE[evaluation.urgency],
    soloEmphasis:
      state === "single"
        ? "Every other answer came back clean, which is what makes this one worth the attention — it is the single item standing between you and a data room with nothing to explain."
        : null,
    flags: flags.map((flag) => toFlagView(answers, flag)),
    selfFix: buildSplit(evaluation.selfFixable, "self"),
    needsSystem: buildSplit(evaluation.needsSystem, "system"),
    clean: state === "clean" ? buildCleanContent(answers) : null,
    summary: buildSummary(flags, evaluation.totalDelayWeeks, SUMMARY_LABELS),
    conversion: buildConversion(answers, evaluation),
  };
}

/** Flattens a headline into plain text — for tests, and for `aria-label`. */
export function headlineText(segments: readonly HeadlineSegment[]): string {
  return segments.map((segment) => segment.value).join("");
}
