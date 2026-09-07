import {
  ADVISORY_PRODUCT,
  ADVISORY_SHORT,
  CAP_TABLE_PRODUCT,
  OUTBOUND_URLS,
} from "./brand";
import type { EvaluationResult, Urgency } from "./evaluate";
import { INSTRUMENT_OPTION_IDS, type Flag, type FlagId } from "./flags";
import { FLAG_GUIDANCE } from "./guidance";
import type { Answers, OptionId } from "./questions";

/**
 * The conversion layer — tool-spec-v1.md §1 and §4.
 *
 * Three rules govern every line in this file:
 *
 *   1. **Never a banner.** A pitch attaches to the specific flags it solves and
 *      renders inside the "needs a system" column, next to those flags' guidance.
 *      There is no sticky bar, no interstitial, no modal.
 *   2. **Two free fixes first.** §1's corollary rule: at least two genuinely
 *      useful, self-actionable steps must be given away before any pitch appears.
 *      That is enforced by `MIN_FREE_STEPS_BEFORE_PITCH` below and asserted in
 *      `pitch.test.ts` across every scenario and every raise-timing answer — it
 *      is not left to whoever edits the layout next.
 *   3. **Create the itch, then sell the scratch.** Every pitch body quotes the
 *      founder's own answers back. A pitch that could have been written before
 *      they answered anything is an ad, and §1 is explicit that an ad does not
 *      convert here.
 *
 * At most one cap-table pitch and one advisory pitch render on a page. A results
 * screen whose only flags are founder-owned gets **no pitch at all** — the fixes
 * were given away and there is nothing to sell.
 */

export type PitchDestination = "tabulate" | "advisory";

export type PitchVariantId =
  | "cap-table-conversion"
  | "instruments-unknown"
  | "ownership-cleanup"
  | "roc-reconciliation"
  | "instrument-stack"
  | "cap-table-only"
  | "esop-pool"
  | "advisory-filings"
  | "clean-state";

export interface PitchView {
  variant: PitchVariantId;
  destination: PitchDestination;
  /** The flags this pitch is attached to. Never empty except in the clean state. */
  flagIds: readonly FlagId[];
  /** The itch. Every sentence references something the founder answered. */
  body: readonly string[];
  /** What the product actually does. One sentence, given visual weight. */
  productLine: string;
  ctaLabel: string;
  /** One line under the CTA, modulated by the Q8 raise timing. */
  urgencyNote: string;
  href: string;
}

export interface PitchPlacement {
  pitch: PitchView;
  /**
   * `"top"` hoists the pitch above the system guidance cards — only ever done
   * for a founder in live diligence, and only when the self-fix column has
   * already given away enough. Otherwise the pitch sits after the guidance card
   * for the last flag it cites, which is what makes it contextual.
   */
  anchor: "top" | { afterFlagId: FlagId };
  /** Free, self-actionable steps the reader has been given above this pitch. */
  freeStepsBefore: number;
}

export type CrossLinkId =
  | "funding-round-simulator"
  | "esop-tax-calculator"
  | "valuation-calculator";

export interface CrossLinkView {
  id: CrossLinkId;
  name: string;
  /** Why this one is on the page — references the flag that surfaced it. */
  reason: string;
  href: string;
}

export interface EmailCaptureCopy {
  heading: string;
  body: string;
  label: string;
  placeholder: string;
  submitLabel: string;
  reassurance: string;
}

export interface ConversionContent {
  placements: readonly PitchPlacement[];
  /** The clean state has nothing to remediate, so it gets one soft line instead. */
  cleanStatePitch: PitchView | null;
  crossLinks: readonly CrossLinkView[];
  emailCapture: EmailCaptureCopy;
}

/** tool-spec-v1.md §1, corollary rule. Give away two, sell the other two. */
export const MIN_FREE_STEPS_BEFORE_PITCH = 2;

// ---------------------------------------------------------------------------
// Answer clauses — the founder's own answers, in prose
// ---------------------------------------------------------------------------

const CAP_TABLE_CLAUSE: Record<OptionId<"q1">, string> = {
  platform: "your cap table is on a platform",
  sheets: "your cap table lives in a spreadsheet",
  ca_cs: "your cap table lives with your CA or CS",
  not_sure: "you are not sure where your cap table actually lives",
};

const INSTRUMENT_SHORT: Record<(typeof INSTRUMENT_OPTION_IDS)[number], string> = {
  safes: "SAFEs",
  convertibles: "convertible notes",
  ccps: "CCPS",
  esop_grants: "ESOP grants",
};

const ESOP_CLAUSE: Partial<Record<OptionId<"q3">, string>> = {
  no_pool: "there is no ESOP pool approved yet",
  not_sure: "you are not sure where your ESOP pool stands",
  over_granted: "you have granted more than your approved pool holds",
};

const ROC_CLAUSE: Partial<Record<OptionId<"q5">, string>> = {
  behind: "your ROC filings are behind",
  not_sure: "you are not sure whether your ROC filings are current",
};

const FOREIGN_CLAUSE: Partial<Record<OptionId<"q6">, string>> = {
  filings_unsure:
    "you took foreign capital and are not sure the filings went in",
  land_border_investor:
    "one of your investors is from a country that shares a land border with India",
};

const VALUATION_CLAUSE: Partial<Record<OptionId<"q7">, string>> = {
  negotiated_no_report:
    "your last round was negotiated without a formal valuation report",
  not_sure: "you are not sure what supported your last round's price",
};

/** For short noun phrases: "SAFEs, CCPS and ESOP grants". */
function listJoin(items: readonly string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/**
 * For full clauses, which often contain an "and" of their own. Always commas
 * before the final conjunction, so two clauses do not run together as
 * "...went in and your last round...".
 */
function joinClauses(items: readonly string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function selectedInstruments(answers: Answers): readonly string[] {
  const selected = new Set<string>(answers.q2);
  return INSTRUMENT_OPTION_IDS.filter((id) => selected.has(id)).map(
    (id) => INSTRUMENT_SHORT[id],
  );
}

// ---------------------------------------------------------------------------
// Urgency modulation — Q8
// ---------------------------------------------------------------------------

const TABULATE_CTA: Record<Urgency, string> = {
  live: "See your real number",
  near: "Get the number before the call",
  planning: "Model it before you need it",
  none: "See how it would model",
};

const TABULATE_URGENCY_NOTE: Record<Urgency, string> = {
  live: "Diligence has already started. This is the number the next call opens with.",
  near: "You are weeks away from being asked for this. Better to have it than to derive it live.",
  planning:
    "You have runway. This is the cheapest point at which to get it right.",
  none: "Nothing urgent here. Worth knowing before it is.",
};

const ADVISORY_CTA: Record<Urgency, string> = {
  live: `Talk to ${ADVISORY_SHORT} now`,
  near: `Talk to ${ADVISORY_SHORT}`,
  planning: `Talk to ${ADVISORY_SHORT}`,
  none: `Ask ${ADVISORY_SHORT} when you are ready`,
};

const ADVISORY_URGENCY_NOTE: Record<Urgency, string> = {
  live: "These run on statutory clocks. The earlier they start, the less of your close they take.",
  near: "Starting these now is what keeps them off the critical path.",
  planning:
    "Plenty of runway. These are far cheaper to resolve well before a term sheet exists.",
  none: "No rush. Worth a conversation before you start raising.",
};

// ---------------------------------------------------------------------------
// The variants, in priority order. First match takes the cap-table slot.
// ---------------------------------------------------------------------------

interface VariantContext {
  answers: Answers;
  fired: ReadonlySet<FlagId>;
  urgency: Urgency;
  instruments: readonly string[];
}

interface VariantDefinition {
  variant: PitchVariantId;
  matches(context: VariantContext): boolean;
  build(context: VariantContext): { flagIds: readonly FlagId[]; body: string[]; productLine: string };
}

const CAP_TABLE_VARIANTS: readonly VariantDefinition[] = [
  /**
   * §1's "single best moment in the whole tool": a cap table that is not a
   * system of record, plus two or more instrument types outstanding. The
   * founder cannot state post-conversion founder ownership, and that is the
   * first number a partner asks for. This is the cliffhanger, not an ad.
   */
  {
    variant: "cap-table-conversion",
    matches: ({ fired, instruments }) =>
      fired.has("cap-table-source-of-truth") && instruments.length >= 2,
    build: ({ answers, instruments }) => ({
      flagIds: ["cap-table-source-of-truth", "instrument-stack-unmodelled"],
      body: [
        `You have ${instruments.length} instrument types outstanding — ${listJoin(instruments)} — and ${CAP_TABLE_CLAUSE[answers.q1]}.`,
        "That means you don't currently know what the founders own post-conversion — and it's question one in every diligence call.",
      ],
      productLine: `${CAP_TABLE_PRODUCT} imports your existing sheet and reconciles it against your ROC filings.`,
    }),
  },

  {
    variant: "instruments-unknown",
    matches: ({ fired }) => fired.has("outstanding-instruments-unknown"),
    build: () => ({
      flagIds: ["outstanding-instruments-unknown", "cap-table-source-of-truth"],
      body: [
        "You told us you are not sure what is outstanding besides ordinary equity.",
        "Diligence will build that list for you — from your filings, your registers and your investors' own copies — on its own schedule, in front of the people deciding your round.",
      ],
      productLine: `${CAP_TABLE_PRODUCT} builds the list from your filings first, so the version in the data room is yours.`,
    }),
  },

  {
    variant: "ownership-cleanup",
    matches: ({ fired }) => fired.has("departed-founder-equity"),
    build: () => ({
      flagIds: ["departed-founder-equity"],
      body: [
        "You told us a founder has left and still holds equity.",
        "Before that becomes a negotiation it has to become a number: how much, of what class, vested to when, and what resolving it does to everyone else's position at the price you are discussing.",
      ],
      productLine: `${CAP_TABLE_PRODUCT} models the position and what clearing it does to the rest of the table.`,
    }),
  },

  {
    variant: "roc-reconciliation",
    matches: ({ fired }) =>
      fired.has("cap-table-source-of-truth") &&
      fired.has("roc-filings-not-current"),
    build: ({ answers }) => ({
      flagIds: ["cap-table-source-of-truth", "roc-filings-not-current"],
      body: [
        `${sentenceCase(ROC_CLAUSE[answers.q5] ?? "your ROC filings need attention")}, and ${CAP_TABLE_CLAUSE[answers.q1]}.`,
        "Those two compound. The filings are what an investor reconciles your cap table against, so until both are straight neither one can be verified.",
      ],
      productLine: `${CAP_TABLE_PRODUCT} imports your existing sheet and reconciles it against your ROC filings — which is exactly the comparison being run against you.`,
    }),
  },

  {
    variant: "instrument-stack",
    matches: ({ fired, instruments }) =>
      fired.has("instrument-stack-unmodelled") && instruments.length >= 2,
    build: ({ instruments }) => ({
      flagIds: ["instrument-stack-unmodelled"],
      body: [
        `You have ${instruments.length} instrument types outstanding — ${listJoin(instruments)}.`,
        "Your cap table records who holds what today. Post-conversion ownership is a different question, and it moves with every cap, discount and trigger in that stack.",
      ],
      productLine: `${CAP_TABLE_PRODUCT} models the stack, so "what do the founders own after everything converts" is a number you can read rather than rebuild.`,
    }),
  },

  {
    variant: "cap-table-only",
    matches: ({ fired }) => fired.has("cap-table-source-of-truth"),
    build: ({ answers }) => ({
      flagIds: ["cap-table-source-of-truth"],
      body: [
        `${sentenceCase(CAP_TABLE_CLAUSE[answers.q1])}, which means there are two versions of your ownership: the one you work from, and the one your MCA filings describe.`,
        "An investor reconciles those two before they wire. Whatever gaps exist, they will find them — the only question is whether you found them first.",
      ],
      productLine: `${CAP_TABLE_PRODUCT} imports your existing sheet and reconciles it against your ROC filings.`,
    }),
  },

  {
    variant: "esop-pool",
    matches: ({ fired }) =>
      fired.has("esop-pool-not-approved") || fired.has("esop-pool-over-granted"),
    build: ({ answers, fired }) => ({
      flagIds: fired.has("esop-pool-over-granted")
        ? ["esop-pool-over-granted"]
        : ["esop-pool-not-approved"],
      body: [
        `You told us ${ESOP_CLAUSE[answers.q3] ?? "your ESOP pool needs work"}.`,
        fired.has("esop-pool-over-granted")
          ? "Expanding a pool mid-round needs fresh approvals from the same people negotiating your terms, and where the expansion sits — before or after the money — changes who absorbs it."
          : "Investors usually want the pool approved pre-money, which means it dilutes the people already on the cap table rather than the ones joining it. The size is a number you want to bring to that conversation, not receive in it.",
      ],
      productLine: `${CAP_TABLE_PRODUCT} models the pool against your grant register, so you can see what it costs you before you agree to it.`,
    }),
  },
];

function sentenceCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const ADVISORY_FLAGS: readonly FlagId[] = [
  "foreign-capital-filings-unclear",
  "press-note-3-approval",
  "valuation-report-missing",
];

function buildAdvisoryPitch(context: VariantContext): PitchView | null {
  const { answers, fired, urgency } = context;
  const flagIds = ADVISORY_FLAGS.filter((id) => fired.has(id));
  if (flagIds.length === 0) {
    return null;
  }

  const clauses: string[] = [];
  if (fired.has("foreign-capital-filings-unclear")) {
    clauses.push(FOREIGN_CLAUSE.filings_unsure!);
  }
  if (fired.has("press-note-3-approval")) {
    clauses.push(FOREIGN_CLAUSE.land_border_investor!);
  }
  if (fired.has("valuation-report-missing")) {
    clauses.push(VALUATION_CLAUSE[answers.q7] ?? "your last round's price needs support");
  }

  return {
    variant: "advisory-filings",
    destination: "advisory",
    flagIds,
    body: [
      `${sentenceCase(joinClauses(clauses))}.`,
      clauses.length === 1
        ? "This one sits outside the cap table. It runs on a statutory clock and a defined route, so what to do next depends on dates and documents rather than on a model."
        : "These sit outside the cap table. They run on statutory clocks and defined routes, so what to do next depends on dates and documents rather than on a model.",
    ],
    productLine: `${ADVISORY_PRODUCT} works the filings, the routes and the timelines directly.`,
    ctaLabel: ADVISORY_CTA[urgency],
    urgencyNote: ADVISORY_URGENCY_NOTE[urgency],
    href: OUTBOUND_URLS.advisory,
  };
}

// ---------------------------------------------------------------------------
// Cross-links — shown only when the flag that justifies them fired
// ---------------------------------------------------------------------------

const CROSS_LINKS: readonly {
  id: CrossLinkId;
  name: string;
  href: string;
  triggers: readonly FlagId[];
  reason: (context: VariantContext) => string;
}[] = [
  {
    id: "funding-round-simulator",
    name: "Funding Round Simulator",
    href: OUTBOUND_URLS.fundingRoundSimulator,
    triggers: ["instrument-stack-unmodelled", "outstanding-instruments-unknown"],
    reason: ({ instruments }) =>
      instruments.length >= 2
        ? `You have ${listJoin(instruments)} outstanding. Model what the next round does to everyone's position.`
        : "You have instruments that convert. Model what the next round does to everyone's position.",
  },
  {
    id: "esop-tax-calculator",
    name: "ESOP Tax Calculator",
    href: OUTBOUND_URLS.esopTaxCalculator,
    triggers: ["esop-pool-not-approved", "esop-pool-over-granted"],
    reason: () =>
      "Your ESOP pool came up. Work out what an exercise actually costs the employee before you size it.",
  },
  {
    id: "valuation-calculator",
    name: "Valuation Calculator",
    href: OUTBOUND_URLS.valuationCalculator,
    triggers: ["valuation-report-missing"],
    reason: () =>
      "Your last round's price has no formal report behind it. Sanity-check the basis you would put in writing.",
  },
];

/**
 * The optional capture, and it is optional only in the CLEAN state — that is
 * the one result with nothing to gate, and the only place this copy renders.
 * Every other result is gated (`src/lib/gate.ts`), where "there is no wall"
 * would be a lie. If you ever render this form on a gated page, rewrite it
 * first.
 */
const EMAIL_CAPTURE: EmailCaptureCopy = {
  heading: "Email me this report",
  body: "Optional. Everything above stays on this page whether you do this or not — there is no wall, no account, and no step you have to complete to read your own results.",
  label: "Your email",
  placeholder: "you@company.com",
  submitLabel: "Send it to me",
  reassurance: "One email with this register. Nothing else.",
};

// ---------------------------------------------------------------------------
// Placement
// ---------------------------------------------------------------------------

function stepsFor(flags: readonly Flag[]): number {
  return flags.reduce(
    (total, flag) => total + FLAG_GUIDANCE[flag.id as FlagId].steps.length,
    0,
  );
}

/**
 * Anchors a pitch after the guidance card for the last flag it cites, counting
 * how many free steps the reader has already been given at that point. A pitch
 * that cites no flag in the system column falls to the end of it.
 */
function place(
  pitch: PitchView,
  selfFixSteps: number,
  systemFlags: readonly Flag[],
): PitchPlacement {
  const systemIds = systemFlags.map((flag) => flag.id as FlagId);
  const anchorIndex = systemIds.reduce(
    (last, id, index) => (pitch.flagIds.includes(id) ? index : last),
    systemIds.length - 1,
  );

  return {
    pitch,
    anchor: { afterFlagId: systemIds[anchorIndex] },
    freeStepsBefore:
      selfFixSteps + stepsFor(systemFlags.slice(0, anchorIndex + 1)),
  };
}

export function buildConversion(
  answers: Answers,
  evaluation: EvaluationResult,
): ConversionContent {
  const fired = new Set<FlagId>(
    evaluation.flags.map((flag) => flag.id as FlagId),
  );
  const context: VariantContext = {
    answers,
    fired,
    urgency: evaluation.urgency,
    instruments: selectedInstruments(answers),
  };

  const crossLinks = CROSS_LINKS.filter((link) =>
    link.triggers.some((id) => fired.has(id)),
  ).map((link) => ({
    id: link.id,
    name: link.name,
    reason: link.reason(context),
    href: link.href,
  }));

  // Nothing fired: no remediation to sell, so one soft line and no pressure.
  if (evaluation.flags.length === 0) {
    return {
      placements: [],
      cleanStatePitch: {
        variant: "clean-state",
        destination: "tabulate",
        flagIds: [],
        body: [
          "Nothing on this check needs fixing, so there is nothing here to sell you.",
          "The only work left is keeping it true through the next grant, the next instrument and the next round — which is the part that quietly comes undone between raises.",
        ],
        productLine: `${CAP_TABLE_PRODUCT} is where companies keep this record current, so the answer stays the same whenever it is asked.`,
        ctaLabel: TABULATE_CTA.none,
        urgencyNote: "No issues today. Worth a look before the next round starts.",
        href: OUTBOUND_URLS.tabulate,
      },
      crossLinks,
      emailCapture: EMAIL_CAPTURE,
    };
  }

  const selfFixSteps = stepsFor(evaluation.selfFixable);
  const systemFlags = evaluation.needsSystem;

  const placements: PitchPlacement[] = [];

  if (systemFlags.length > 0) {
    const capTableVariant = CAP_TABLE_VARIANTS.find((candidate) =>
      candidate.matches(context),
    );

    if (capTableVariant) {
      const built = capTableVariant.build(context);
      placements.push(
        place(
          {
            variant: capTableVariant.variant,
            destination: "tabulate",
            // A variant may name a companion flag optimistically; a pitch may
            // only claim to be attached to flags that actually fired.
            flagIds: built.flagIds.filter((id) => fired.has(id)),
            body: built.body,
            productLine: built.productLine,
            ctaLabel: TABULATE_CTA[evaluation.urgency],
            urgencyNote: TABULATE_URGENCY_NOTE[evaluation.urgency],
            href: OUTBOUND_URLS.tabulate,
          },
          selfFixSteps,
          systemFlags,
        ),
      );
    }

    const advisory = buildAdvisoryPitch(context);
    if (advisory) {
      placements.push(place(advisory, selfFixSteps, systemFlags));
    }
  }

  // Urgency modulation: a founder already in diligence gets the pitch hoisted
  // above the system guidance. Only the first pitch is ever hoisted — two
  // stacked at the top would read as the banner §4 forbids — and only when the
  // self-fix column has already cleared the two-free-fixes bar on its own.
  if (
    evaluation.urgency === "live" &&
    placements.length > 0 &&
    selfFixSteps >= MIN_FREE_STEPS_BEFORE_PITCH
  ) {
    placements[0] = {
      ...placements[0],
      anchor: "top",
      freeStepsBefore: selfFixSteps,
    };
  }

  return {
    placements,
    cleanStatePitch: null,
    crossLinks,
    emailCapture: EMAIL_CAPTURE,
  };
}
