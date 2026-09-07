import type { Urgency } from "./evaluate";
import type { FlagId } from "./flags";

/**
 * Where a captured lead goes — the one seam between the gate and whatever
 * eventually receives it.
 *
 * ---------------------------------------------------------------------------
 * LAUNCH BLOCKER: in v1 this posts NOWHERE.
 *
 * The default adapter writes to the console and resolves. Nothing is sent, no
 * report is delivered, and the address is discarded when the tab closes — so
 * the gate currently promises an email that will never arrive. Wiring a real
 * destination (Formspree / HubSpot / Loops / a Vercel function) is a single
 * `setLeadAdapter()` call in the root layout and touches nothing else.
 * See LOG.md open question 4.
 * ---------------------------------------------------------------------------
 *
 * The payload deliberately carries the FLAG IDS rather than the founder's
 * answers. A real endpoint can rebuild the full report from the same rules
 * table, so there is no reason to ship the answer sheet off the device.
 */
export interface LeadSubmission {
  name: string;
  email: string;
  issueCount: number;
  urgency: Urgency;
  flagIds: readonly FlagId[];
  delayWeeksMin: number | null;
  delayWeeksMax: number | null;
}

export interface LeadAdapter {
  submit(lead: LeadSubmission): Promise<void>;
}

/** v1 default. Replace via `setLeadAdapter`, do not edit call sites. */
export const consoleLeadAdapter: LeadAdapter = {
  async submit(lead) {
    console.log("[lead] gate_submitted (not sent anywhere)", lead);
  },
};

let adapter: LeadAdapter = consoleLeadAdapter;

export function setLeadAdapter(next: LeadAdapter): void {
  adapter = next;
}

export function resetLeadAdapter(): void {
  adapter = consoleLeadAdapter;
}

/**
 * Never rejects. The founder has already been shown the unlocked register by
 * the time this settles, and taking that away because a network call failed
 * would be the worst of both worlds — the delivery failure is the adapter's
 * problem to report, not the page's.
 */
export async function submitLead(lead: LeadSubmission): Promise<void> {
  try {
    await adapter.submit(lead);
  } catch (error) {
    console.error("[lead] submission failed", error);
  }
}
