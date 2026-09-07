import type { Urgency } from "./evaluate";
import type { FlagId } from "./flags";
import type { GateInvalidReason } from "./gate";
import type { CrossLinkId, PitchDestination, PitchVariantId } from "./pitch";
import type { QuestionId } from "./questions";

/**
 * The five metrics in tool-spec-v1.md §7 — completion rate, median flags per
 * user, CTA click rate, the "term sheet in hand" share, and email opt-in rate —
 * are all derivable from these events, and the gate adds its own funnel on top.
 *
 * v1 has no analytics provider (LOG.md open question 13), so the default adapter
 * writes to the console. Swapping in Plausible / PostHog / GA4 later is one call
 * to `setAnalyticsAdapter` in the root layout; nothing else changes.
 *
 * Privacy: no event carries the founder's answers verbatim, and neither
 * `email_submitted` nor `gate_submitted` carries an address or a name. Flag ids
 * and option ids are stable internal strings, not free text.
 */
export type AnalyticsEvent =
  | { name: "tool_started" }
  | {
      name: "question_answered";
      questionId: QuestionId;
      /** 1-based, so completion rate can be read straight off the funnel. */
      questionNumber: number;
      optionIds: readonly string[];
    }
  | {
      name: "results_viewed";
      issueCount: number;
      blockerCount: number;
      flagIds: readonly FlagId[];
      delayWeeksMin: number | null;
      delayWeeksMax: number | null;
      urgency: Urgency;
    }
  | {
      name: "pitch_shown";
      variant: PitchVariantId;
      destination: PitchDestination;
      urgency: Urgency;
    }
  | {
      name: "pitch_clicked";
      variant: PitchVariantId;
      destination: PitchDestination;
      urgency: Urgency;
    }
  | { name: "email_submitted"; issueCount: number; urgency: Urgency }
  | { name: "crosslink_clicked"; tool: CrossLinkId }
  /* The gate. `gate_shown` fires once per locked results view, so the gate's
     conversion rate is `gate_submitted / gate_shown`. No event carries the
     name or the address — `gate_invalid_email` carries only the reason, which
     is what tells you whether the work-email rule is costing you leads. */
  | {
      name: "gate_shown";
      issueCount: number;
      /** Guidance items behind the blur. Every FINDING is free (Step 14), so
       *  this is the remedy count, and it is what the gate actually offers. */
      gatedGuidanceCount: number;
      urgency: Urgency;
    }
  | { name: "gate_submitted"; issueCount: number; urgency: Urgency }
  | { name: "gate_invalid_email"; reason: GateInvalidReason };

export type AnalyticsEventName = AnalyticsEvent["name"];

export interface AnalyticsAdapter {
  track(event: AnalyticsEvent): void;
}

/** v1 default. Replace via `setAnalyticsAdapter`, do not edit call sites. */
export const consoleAnalyticsAdapter: AnalyticsAdapter = {
  track(event) {
    const { name, ...properties } = event;
    console.log(`[analytics] ${name}`, properties);
  },
};

let adapter: AnalyticsAdapter = consoleAnalyticsAdapter;

export function setAnalyticsAdapter(next: AnalyticsAdapter): void {
  adapter = next;
}

export function resetAnalyticsAdapter(): void {
  adapter = consoleAnalyticsAdapter;
}

export function track(event: AnalyticsEvent): void {
  adapter.track(event);
}
