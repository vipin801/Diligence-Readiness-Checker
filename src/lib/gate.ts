import type { HeadlineSegment } from "./results";

/**
 * The lead gate on the results screen.
 *
 * Everything user-visible about the gate lives here, next to the rules that
 * decide what is valid — the same arrangement as `results.ts` and `pitch.ts`,
 * and for the same reason: the copy rules are then enforced by tests rather
 * than by review.
 *
 * **The split is by content type, not by count** (Step 14). Free is the whole
 * DIAGNOSIS: the stat tiles, all three summary visuals, and every finding in
 * full — title, severity, weeks, who fixes it and the "why an investor asks"
 * line. Gated is the REMEDY: the step-by-step self-fix guidance, the "needs a
 * system" column with its CTAs, and the cross-links.
 *
 * That split is what makes the gate correct at any flag count. The old rule
 * kept the first two findings free and gated the rest, so a two-flag result
 * showed both findings in full and then asked for an email to unlock two issues
 * already on the screen — a wall with nothing behind it. Under the new rule the
 * founder always sees every problem they have, and the email buys the how.
 */

/* --- Storage ---------------------------------------------------------------

   The unlock flag is the second thing this tool has ever persisted (the first
   is the light/dark choice). It is a single "1" — no name, no address, no
   answer and no result. An email address in localStorage is a liability with
   no upside: the page does not need it again. */

export const GATE_STORAGE_KEY = "incentiv-report-unlocked";

/**
 * Storage throws outright in some privacy modes, and returns nothing in a
 * fresh private window. Both cases mean "still locked", which is the safe
 * reading — the page renders correctly either way.
 */
export function readStoredUnlock(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(GATE_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Best effort. A visitor who blocks storage stays unlocked for this visit. */
export function persistUnlock(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(GATE_STORAGE_KEY, "1");
  } catch {
    // Nothing to do, and nothing worth breaking the page over.
  }
}

/* --- Work-email validation -------------------------------------------------

   Two lists, because the two kinds of match are genuinely different.

   `FREE_EMAIL_PROVIDERS` matches the FIRST LABEL of the domain, so every
   country variant is covered without enumerating them: yahoo.co.in,
   hotmail.co.uk, outlook.in, yandex.ru. `rediffmail` is on it because this is
   India and it is still in daily use.

   `FREE_EMAIL_DOMAINS` matches the WHOLE domain, for providers whose name is an
   ordinary word. "mail.com" is a free provider; "mail.acme.com" is a company's
   own mail host, and rejecting it would be a bug. */

const FREE_EMAIL_PROVIDERS: ReadonlySet<string> = new Set([
  "gmail",
  "googlemail",
  "yahoo",
  "ymail",
  "outlook",
  "hotmail",
  "live",
  "msn",
  "icloud",
  "aol",
  "proton",
  "protonmail",
  "zoho",
  "rediffmail",
  "yandex",
]);

const FREE_EMAIL_DOMAINS: ReadonlySet<string> = new Set([
  "me.com",
  "mail.com",
  "proton.me",
]);

/** Deliberately loose: this is a client-side sanity check, not an RFC parser. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function emailDomain(email: string): string {
  const at = email.lastIndexOf("@");
  if (at === -1) return "";
  return email
    .slice(at + 1)
    .trim()
    .toLowerCase()
    .replace(/\.$/, "");
}

export function isFreeEmailDomain(email: string): boolean {
  const domain = emailDomain(email);
  if (domain === "") return false;
  if (FREE_EMAIL_DOMAINS.has(domain)) return true;
  return FREE_EMAIL_PROVIDERS.has(domain.split(".")[0] ?? "");
}

export type GateInvalidReason = "missing" | "malformed" | "free-provider";

export interface GateValidation {
  ok: boolean;
  name: string;
  email: string;
  nameError: string | null;
  emailError: string | null;
  /** Why the address was rejected, for analytics. Never carries the address. */
  emailReason: GateInvalidReason | null;
}

/**
 * Friendly, never scolding. A founder who typed a Gmail address has not done
 * anything wrong — they have simply typed the address they type everywhere.
 */
export const GATE_ERRORS = {
  nameMissing: "Please add your name so we know who to address it to.",
  emailMissing: "Please add your work email — that's where the report goes.",
  emailMalformed:
    "That does not look like an email address. Check it and try again.",
  emailFreeProvider:
    "Please use your work email — that's where the report goes.",
} as const;

export function validateGate(name: string, email: string): GateValidation {
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();

  let emailError: string | null = null;
  let emailReason: GateInvalidReason | null = null;

  if (trimmedEmail === "") {
    emailError = GATE_ERRORS.emailMissing;
    emailReason = "missing";
  } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
    emailError = GATE_ERRORS.emailMalformed;
    emailReason = "malformed";
  } else if (isFreeEmailDomain(trimmedEmail)) {
    emailError = GATE_ERRORS.emailFreeProvider;
    emailReason = "free-provider";
  }

  const nameError = trimmedName === "" ? GATE_ERRORS.nameMissing : null;

  return {
    ok: nameError === null && emailError === null,
    name: trimmedName,
    email: trimmedEmail,
    nameError,
    emailError,
    emailReason,
  };
}

/* --- Copy ------------------------------------------------------------------ */

export const GATE_COPY = {
  sectionLabel: "The fixes",
  heading: "Get the fixes",
  nameLabel: "Name",
  namePlaceholder: "Your name",
  emailLabel: "Work email",
  emailPlaceholder: "you@company.com",
  submitLabel: "Send me the fixes",
  trust: "One email with your report. Nothing else.",
  unlockedHeading: "Unlocked",
} as const;

/**
 * "Step-by-step for the {n} issues above — what to do yourself this week, and
 * what needs help."
 *
 * It describes what is actually behind the gate, and nothing else. The old copy
 * offered "all {n} issues", which stopped being true the moment every finding
 * moved above the wall: the issues are already on the screen, and what is being
 * offered is the remedy for them.
 *
 * Segmented rather than interpolated into a string, because the count is a stat
 * and DESIGN.md §3 sets every stat in IBM Plex Mono — the renderer needs to see
 * where the numeral is.
 *
 * A single-flag result gets the singular. "the 1 issues above" on the one
 * surface that asks the founder for something is not a typo anyone forgives.
 */
export function gateBody(issueCount: number): readonly HeadlineSegment[] {
  return [
    { kind: "text", value: "Step-by-step for the " },
    { kind: "number", value: String(issueCount) },
    {
      kind: "text",
      value:
        issueCount === 1
          ? " issue above — what to do yourself this week, and what needs help."
          : " issues above — what to do yourself this week, and what needs help.",
    },
  ];
}

/** Shown in place of the form once the fixes are unlocked. */
export function gateConfirmation(email: string): string {
  return `The fixes are open below, and the report is queued for ${email}.`;
}
