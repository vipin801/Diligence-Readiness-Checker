import {
  FLAG_RULES,
  INSTRUMENT_OPTION_IDS,
  type DelayWeeks,
  type Flag,
  type FlagSeverity,
  type TriggerCondition,
} from "./flags";
import type { Answers, OptionId } from "./questions";

export type Urgency = "none" | "planning" | "near" | "live";

export interface DelayRange {
  min: DelayWeeks;
  max: DelayWeeks;
}

export interface EvaluationResult {
  flags: Flag[];
  totalDelayWeeks: DelayRange;
  urgency: Urgency;
  selfFixable: Flag[];
  needsSystem: Flag[];
}

const SEVERITY_ORDER: Record<FlagSeverity, number> = {
  blocker: 0,
  delay: 1,
  cleanup: 2,
};

const URGENCY_BY_ANSWER: Record<Answers["q8"], Urgency> = {
  not_raising: "none",
  six_plus_months: "planning",
  one_to_three_months: "near",
  term_sheet_or_diligence: "live",
};

function matchesTrigger(answers: Answers, trigger: TriggerCondition): boolean {
  switch (trigger.kind) {
    case "one-of":
      return (trigger.optionIds as readonly string[]).includes(
        answers[trigger.questionId],
      );
    case "includes":
      return answers[trigger.questionId].includes(trigger.optionId);
    case "instrument-count-at-least": {
      const selected = new Set<OptionId<"q2">>(answers.q2);
      const instrumentCount = INSTRUMENT_OPTION_IDS.filter((id) =>
        selected.has(id),
      ).length;
      return instrumentCount >= trigger.count;
    }
  }
}

/**
 * Delay model: all remediation starts together, so the estimated close delay is
 * the slowest active fix (the maximum minimum and maximum), not the sum of every
 * flag. A null bound means timing is indefinite; one indefinite fix makes the
 * combined result indefinite. No flags means zero weeks.
 */
export function aggregateParallelDelay(flags: readonly Flag[]): DelayRange {
  if (flags.length === 0) {
    return { min: 0, max: 0 };
  }

  if (
    flags.some(
      (flag) => flag.delayWeeksMin === null || flag.delayWeeksMax === null,
    )
  ) {
    return { min: null, max: null };
  }

  return {
    min: Math.max(...flags.map((flag) => flag.delayWeeksMin as number)),
    max: Math.max(...flags.map((flag) => flag.delayWeeksMax as number)),
  };
}

export function evaluate(answers: Answers): EvaluationResult {
  const flags = FLAG_RULES.filter((flag) =>
    matchesTrigger(answers, flag.trigger),
  ).sort(
    (left, right) =>
      SEVERITY_ORDER[left.severity] - SEVERITY_ORDER[right.severity],
  );

  return {
    flags,
    totalDelayWeeks: aggregateParallelDelay(flags),
    urgency: URGENCY_BY_ANSWER[answers.q8],
    selfFixable: flags.filter(
      (flag) => flag.fixedBy === "you" || flag.fixedBy === "ca-cs",
    ),
    needsSystem: flags.filter((flag) => flag.fixedBy === "incentiv"),
  };
}
