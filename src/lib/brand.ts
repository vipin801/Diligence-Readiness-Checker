import type { FlagId } from "./flags";

/**
 * Product names, site chrome and outbound destinations, in one place.
 *
 * The cap-table product is **Tabulate** — confirmed by the human on 2026-09-04
 * and again on the Step 6 build. `DESIGN.md` §1 still calls it "Equity"; that
 * file is wrong on this point and right about everything visual. Nothing else in
 * the codebase may hard-code either name: import `CAP_TABLE_PRODUCT`.
 */
export const CAP_TABLE_PRODUCT = "Tabulate";
export const ADVISORY_PRODUCT = "Incentiv Advisory";
export const ADVISORY_SHORT = "Advisory";

/* --- Identity, for metadata and the social card ---------------------------- */

export const SITE_NAME = "Incentiv";

/**
 * Absolute origin, needed so the generated OG image resolves to a full URL for
 * scrapers. The deployment shape is still open (LOG.md open question 14), so it
 * is overridable without a code change.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://incentiv.finance";

/** The tool's own path, used for the canonical URL. */
export const TOOL_PATH = "/tools/diligence-readiness";

export const TOOL_NAME = "Diligence Readiness Check";
export const TOOL_TITLE = `${TOOL_NAME} — ${SITE_NAME}`;

/**
 * One sentence, and it is the sentence that arrives in someone else's inbox
 * when a founder forwards this. It leads with the output, not the quiz.
 */
export const TOOL_DESCRIPTION =
  "See what investors will flag in your data room before they do. Eight questions, ninety seconds, a plain risk register with the delay each issue adds at close. Free — the full report comes by email.";

/**
 * The on-page subheading — deliberately shorter than `TOOL_DESCRIPTION`, which
 * is the metadata and social-card sentence.
 *
 * This one has a layout contract: it must fit on ONE line at >=1024px and wrap
 * to no more than two at 375px. If it ever stops fitting, shorten the copy —
 * never shrink the type.
 */
export const TOOL_SUBHEAD =
  "See what investors will flag in your data room — before they do.";

/**
 * The mono line under the subheading. It holds numerals, so it is Plex Mono.
 *
 * It used to end "nothing leaves your browser", which stopped being true when
 * the results gate went in: the full report is delivered by email, so a name
 * and a work address do leave. The line now says what the visitor actually
 * gets. A promise broken at the gate costs more than the gate earns.
 */
export const TOOL_STAT_LINE =
  "8 questions · 90 seconds · free · full report by email";

/**
 * Every outbound link the results screen can render.
 *
 * All five are `#` placeholders — see LOG.md open question 11. They are deliberately
 * collected here rather than inlined so that supplying the real URLs is a
 * single-file edit, and so a pre-launch check can grep for a remaining "#".
 */
export const OUTBOUND_URLS = {
  /** The cap-table product. CTA: "See your real number". */
  tabulate: "#",
  /** Advisory, for the FEMA / Press Note 3 / Rule 11UA flags. */
  advisory: "#",
  fundingRoundSimulator: "#",
  esopTaxCalculator: "#",
  valuationCalculator: "#",
} as const;

export type OutboundUrlId = keyof typeof OUTBOUND_URLS;

/** True while the outbound URLs are still placeholders. Used by tests. */
export function hasPlaceholderUrls(): boolean {
  return Object.values(OUTBOUND_URLS).some((url) => url === "#");
}

/* --- What the check actually looks at -------------------------------------

   The rail's accordion. Nine areas, and between them they account for every
   rule in `flags.ts` — `src/lib/brand.test.ts` asserts exactly that, so a rule
   added to the table without a home here fails the build rather than quietly
   widening what the tool claims to check.

   It sets what the check covers before the first question: a founder who can
   see the scope up front knows what an empty register does and does not mean.
   Step 15 moved it out of the intro screen and into the left rail, where it is
   also the navigation — each group jumps the tool to its step. */

/**
 * The three steps, and the only place their identity is written down.
 * `screens.ts` maps the eight questions onto these and throws at module load if
 * the two ever disagree.
 */
export type CheckGroupId = "cap-table" | "equity-plan" | "compliance";

export const CHECK_GROUP_ORDER: readonly CheckGroupId[] = [
  "cap-table",
  "equity-plan",
  "compliance",
];

/**
 * The third group is "Compliance & timing", not the bare "Compliance" the
 * grouping otherwise suggests: Q8 asks when the round is closing, which is not
 * a check and fires no flag. It sits there because urgency is the last thing
 * worth asking and the first thing the register reads back.
 */
export const CHECK_GROUP_LABEL: Record<CheckGroupId, string> = {
  "cap-table": "Cap table",
  "equity-plan": "Equity plan",
  compliance: "Compliance & timing",
};

export interface CheckArea {
  /** Reads as a data-room heading, not as a question. */
  label: string;
  group: CheckGroupId;
  flagIds: readonly FlagId[];
}

export const CHECK_AREAS: readonly CheckArea[] = [
  {
    label: "Cap table source of truth",
    group: "cap-table",
    flagIds: ["cap-table-source-of-truth"],
  },
  {
    label: "Convertible instruments",
    group: "cap-table",
    flagIds: ["instrument-stack-unmodelled", "outstanding-instruments-unknown"],
  },
  {
    label: "Valuation basis",
    group: "cap-table",
    flagIds: ["valuation-report-missing"],
  },
  {
    label: "ESOP pool approval",
    group: "equity-plan",
    flagIds: ["esop-pool-not-approved"],
  },
  {
    label: "Pool headroom",
    group: "equity-plan",
    flagIds: ["esop-pool-over-granted"],
  },
  {
    label: "Founder vesting",
    group: "equity-plan",
    flagIds: ["founder-vesting-missing"],
  },
  {
    label: "Departed founders",
    group: "equity-plan",
    flagIds: ["departed-founder-equity"],
  },
  {
    label: "ROC and MCA filings",
    group: "compliance",
    flagIds: ["roc-filings-not-current"],
  },
  {
    label: "Foreign capital and FEMA",
    group: "compliance",
    flagIds: ["foreign-capital-filings-unclear", "press-note-3-approval"],
  },
];

export const CHECK_AREAS_LABEL = "What we check";

/**
 * The count, spelled out, for the two sentences that name it — the rail's lede
 * and the tally strip's caption. `CLAUDE.md` spells counts out in prose and
 * reserves numerals for display headings, so the word is what those two need.
 * `brand.test.ts` holds it to `CHECK_AREAS.length`, so a rule added to the
 * table cannot leave the sentences claiming the old number.
 */
export const CHECK_AREA_COUNT_WORD = "nine";

export function areasInGroup(group: CheckGroupId): readonly CheckArea[] {
  return CHECK_AREAS.filter((area) => area.group === group);
}

/* --- Site chrome — Step 15 -------------------------------------------------

   The tool stops being a standalone microsite here: it carries the marketing
   site's nav and footer so it reads as a page OF incentiv.finance rather than a
   page beside it.

   Every href below is a `#` placeholder for the same reason `OUTBOUND_URLS`
   are — the real site's URL structure has not been supplied. See LOG.md open
   question 12. Only `/` and `TOOL_PATH` are real, because they exist here. */

export interface NavLink {
  label: string;
  href: string;
}

export const SITE_NAV: readonly NavLink[] = [
  { label: "Products", href: "#" },
  { label: "Solutions", href: "#" },
  { label: "Resources", href: "#" },
  { label: "Company", href: "#" },
];

/** The nav's one CTA. Points at Advisory, which is where a demo is booked. */
export const NAV_CTA: NavLink = {
  label: "Book a demo",
  href: OUTBOUND_URLS.advisory,
};

/**
 * The breadcrumb above the rail heading. The last segment is the page you are
 * on, so it is rendered as text rather than as a link.
 */
export const TOOL_BREADCRUMB: readonly NavLink[] = [
  { label: "Resources", href: "#" },
  { label: "Tools", href: "/" },
  { label: "Diligence readiness", href: TOOL_PATH },
];

/**
 * The rail's heading, split so the middle phrase can carry the pale blue
 * highlight without a component slicing a string it does not own.
 */
export const RAIL_HEADING = {
  before: "What will ",
  highlight: "investors flag",
  after: " in your data room?",
} as const;

export const RAIL_LEDE = `${
  CHECK_AREA_COUNT_WORD.charAt(0).toUpperCase() + CHECK_AREA_COUNT_WORD.slice(1)
} checks against the things that actually stall a term sheet in India.`;

/**
 * The rail's cross-sell.
 *
 * It is the one piece of selling on the page not attached to a flag, which
 * `CLAUDE.md`'s tone constraint would normally rule out — so it is deliberately
 * the quietest block in the rail: no card, no fill, a hairline above it and body
 * type throughout. It also says something true about this tool's own limit
 * rather than making a claim about the founder. See LOG.md open question 13.
 */
export const RAIL_CROSS_SELL = {
  kicker: CAP_TABLE_PRODUCT,
  heading: `This check reads your answers. ${CAP_TABLE_PRODUCT} reads your cap table.`,
  body: `Eight questions can only find what you already suspect. ${CAP_TABLE_PRODUCT} holds the instruments, the grants and the filings in one record, so the next data room is a link rather than a project.`,
  primary: NAV_CTA,
  secondary: {
    label: `Explore ${CAP_TABLE_PRODUCT}`,
    href: OUTBOUND_URLS.tabulate,
  },
} as const;

/**
 * The mono line on the right of the progress meta row. It says what the visitor
 * gets, not "no signup" — the results carry an email gate, and the 2026-09-05
 * copy audit withdrew every claim that implied otherwise.
 */
export const TOOL_META_PROMISE = "Free · full report by email";

/** The two bordered cards under the split. */
export const TOOL_LINK_CARDS: readonly {
  title: string;
  body: string;
  href: string;
}[] = [
  {
    title: "How this check works",
    body: "The rules behind each finding, where the week estimates come from, and what this tool deliberately does not look at.",
    href: "#",
  },
  {
    title: "More tools",
    body: "Option tax, round modelling and the rest of the Incentiv toolkit.",
    href: "/",
  },
];

export interface FooterColumn {
  heading: string;
  links: readonly NavLink[];
}

export const SITE_FOOTER_BLURB = `${SITE_NAME} is private-markets infrastructure for India — cap table and ESOP administration, fund operations, secondaries and advisory.`;

export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    heading: "Products",
    links: [
      { label: CAP_TABLE_PRODUCT, href: OUTBOUND_URLS.tabulate },
      { label: ADVISORY_PRODUCT, href: OUTBOUND_URLS.advisory },
    ],
  },
  {
    heading: "Solutions",
    links: [
      { label: "Cap table and ESOP", href: "#" },
      { label: "Fund operations", href: "#" },
      { label: "Secondaries", href: "#" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: TOOL_NAME, href: TOOL_PATH },
      { label: "ESOP Tax Calculator", href: OUTBOUND_URLS.esopTaxCalculator },
      {
        label: "Funding Round Simulator",
        href: OUTBOUND_URLS.fundingRoundSimulator,
      },
      { label: "Valuation Calculator", href: OUTBOUND_URLS.valuationCalculator },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];
