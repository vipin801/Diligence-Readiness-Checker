import type {
  MultiSelectQuestionId,
  OptionId,
  SingleSelectQuestionId,
} from "./questions";

export type FlagSeverity = "blocker" | "delay" | "cleanup";
export type FixedBy = "you" | "ca-cs" | "incentiv";
export type CtaId = "self-fix-guide" | "tabulate" | "advisory";
export type DelayWeeks = number | null;

type OneOfTrigger = {
  [QId in SingleSelectQuestionId]: {
    kind: "one-of";
    questionId: QId;
    optionIds: readonly OptionId<QId>[];
  };
}[SingleSelectQuestionId];

type IncludesTrigger = {
  [QId in MultiSelectQuestionId]: {
    kind: "includes";
    questionId: QId;
    optionId: OptionId<QId>;
  };
}[MultiSelectQuestionId];

export type TriggerCondition =
  | OneOfTrigger
  | IncludesTrigger
  | {
      kind: "instrument-count-at-least";
      questionId: "q2";
      count: number;
    };

export interface Flag {
  id: string;
  trigger: TriggerCondition;
  title: string;
  whyInvestorAsks: string;
  severity: FlagSeverity;
  delayWeeksMin: DelayWeeks;
  delayWeeksMax: DelayWeeks;
  fixedBy: FixedBy;
  cta: CtaId;
}

export const INSTRUMENT_OPTION_IDS = [
  "safes",
  "convertibles",
  "ccps",
  "esop_grants",
] as const satisfies readonly OptionId<"q2">[];

export const FLAG_RULES = [
  {
    id: "cap-table-source-of-truth",
    trigger: {
      kind: "one-of",
      questionId: "q1",
      optionIds: ["sheets", "ca_cs", "not_sure"],
    },
    title: "Cap table may not reconcile with MCA",
    whyInvestorAsks:
      "Investors reconcile the cap table against MCA records before close. Multiple or unclear records make ownership harder to verify.",
    severity: "delay",
    // CALIBRATE: placeholder range from tool-spec-v1.md; replace with Incentiv advisory data.
    delayWeeksMin: 2,
    delayWeeksMax: 3,
    fixedBy: "incentiv",
    cta: "tabulate",
  },
  {
    id: "instrument-stack-unmodelled",
    trigger: {
      kind: "instrument-count-at-least",
      questionId: "q2",
      count: 2,
    },
    title: "Post-conversion ownership is not modelled",
    whyInvestorAsks:
      "Investors ask what every holder owns after all instruments convert. An unmodelled instrument stack makes that answer uncertain.",
    severity: "delay",
    // CALIBRATE: placeholder range from tool-spec-v1.md; replace with Incentiv advisory data.
    delayWeeksMin: 1,
    delayWeeksMax: 2,
    fixedBy: "incentiv",
    cta: "tabulate",
  },
  {
    id: "outstanding-instruments-unknown",
    trigger: { kind: "includes", questionId: "q2", optionId: "not_sure" },
    title: "Outstanding instruments are unknown",
    whyInvestorAsks:
      "Investors need a complete list of rights that can change ownership. Diligence will pause while that list is reconstructed.",
    severity: "blocker",
    // CALIBRATE: placeholder range from tool-spec-v1.md; replace with Incentiv advisory data.
    delayWeeksMin: 3,
    delayWeeksMax: 4,
    fixedBy: "incentiv",
    cta: "tabulate",
  },
  {
    id: "esop-pool-not-approved",
    trigger: {
      kind: "one-of",
      questionId: "q3",
      optionIds: ["no_pool", "not_sure"],
    },
    title: "No approved ESOP pool is confirmed",
    whyInvestorAsks:
      "Investors typically require an approved hiring pool before close. Its size also affects the founders' dilution.",
    severity: "delay",
    // CALIBRATE: placeholder range from tool-spec-v1.md; replace with Incentiv advisory data.
    delayWeeksMin: 3,
    delayWeeksMax: 4,
    fixedBy: "incentiv",
    cta: "tabulate",
  },
  {
    id: "esop-pool-over-granted",
    trigger: { kind: "one-of", questionId: "q3", optionIds: ["over_granted"] },
    title: "ESOP pool needs expansion",
    whyInvestorAsks:
      "Investors check that every grant fits within an approved pool. Expanding it during a round requires fresh approvals and changes dilution.",
    severity: "delay",
    // CALIBRATE: placeholder range from tool-spec-v1.md; replace with Incentiv advisory data.
    delayWeeksMin: 2,
    delayWeeksMax: 3,
    fixedBy: "incentiv",
    cta: "tabulate",
  },
  {
    id: "founder-vesting-missing",
    trigger: {
      kind: "one-of",
      questionId: "q4",
      optionIds: ["partial_or_informal", "none"],
    },
    title: "Founder vesting is missing or informal",
    whyInvestorAsks:
      "Founder vesting protects the company if someone leaves early. Investors commonly make documented vesting a condition to close.",
    severity: "delay",
    // CALIBRATE: placeholder range from tool-spec-v1.md; replace with Incentiv advisory data.
    delayWeeksMin: 2,
    delayWeeksMax: 4,
    fixedBy: "you",
    cta: "self-fix-guide",
  },
  {
    id: "departed-founder-equity",
    trigger: {
      kind: "one-of",
      questionId: "q4",
      optionIds: ["departed_founder"],
    },
    title: "A departed founder still holds equity",
    whyInvestorAsks:
      "Investors look for equity held by people no longer building the company. Resolving that position can become a condition to the deal.",
    severity: "blocker",
    // CALIBRATE: placeholder range from tool-spec-v1.md; replace with Incentiv advisory data.
    delayWeeksMin: 4,
    delayWeeksMax: 8,
    fixedBy: "incentiv",
    cta: "tabulate",
  },
  {
    id: "roc-filings-not-current",
    trigger: {
      kind: "one-of",
      questionId: "q5",
      optionIds: ["behind", "not_sure"],
    },
    title: "ROC filings may not be current",
    whyInvestorAsks:
      "Investors compare statutory filings with the data room to confirm the corporate record. Gaps usually have to be closed before completion.",
    severity: "delay",
    // CALIBRATE: placeholder range from tool-spec-v1.md; replace with Incentiv advisory data.
    delayWeeksMin: 2,
    delayWeeksMax: 6,
    fixedBy: "ca-cs",
    cta: "self-fix-guide",
  },
  {
    id: "foreign-capital-filings-unclear",
    trigger: {
      kind: "one-of",
      questionId: "q6",
      optionIds: ["filings_unsure"],
    },
    title: "Foreign-capital filings are unclear",
    whyInvestorAsks:
      "Investors verify that foreign-capital filings support the ownership record. Any FC-GPR or FEMA issue can require a slower RBI compounding process.",
    severity: "blocker",
    // CALIBRATE: placeholder range from tool-spec-v1.md; replace with Incentiv advisory data.
    delayWeeksMin: 4,
    delayWeeksMax: 8,
    fixedBy: "incentiv",
    cta: "advisory",
  },
  {
    id: "press-note-3-approval",
    trigger: {
      kind: "one-of",
      questionId: "q6",
      optionIds: ["land_border_investor"],
    },
    title: "Press Note 3 approval may apply",
    whyInvestorAsks:
      "Investors check whether the proposed ownership falls within India's government-approval route. Where Press Note 3 applies, timing depends on that process.",
    severity: "blocker",
    // CALIBRATE: the spec says "Indefinite"; null preserves that state until advisory data replaces it.
    delayWeeksMin: null,
    delayWeeksMax: null,
    fixedBy: "incentiv",
    cta: "advisory",
  },
  {
    id: "valuation-report-missing",
    trigger: {
      kind: "one-of",
      questionId: "q7",
      optionIds: ["negotiated_no_report", "not_sure"],
    },
    title: "Valuation lacks a Rule 11UA report",
    whyInvestorAsks:
      "Investors ask for support for the last round's valuation and tax treatment. A missing report leaves that basis open during diligence.",
    severity: "cleanup",
    // CALIBRATE: placeholder range from tool-spec-v1.md; replace with Incentiv advisory data.
    delayWeeksMin: 1,
    delayWeeksMax: 2,
    fixedBy: "incentiv",
    cta: "advisory",
  },
] as const satisfies readonly Flag[];

/** The 11 stable flag ids, derived from the rules table so the two cannot drift. */
export type FlagId = (typeof FLAG_RULES)[number]["id"];
