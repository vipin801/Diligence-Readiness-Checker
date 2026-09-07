import type { Answers } from "../questions";

export interface FounderScenario {
  id: string;
  name: string;
  persona: string;
  answers: Answers;
}

export const FOUNDER_SCENARIOS = [
  {
    id: "diligence-ready-series-a",
    name: "Diligence-ready Series A",
    persona: "A finance-led company that has kept its records and approvals current.",
    answers: {
      q1: "platform",
      q2: ["nothing"],
      q3: "approved_under_half",
      q4: "documented",
      q5: "current",
      q6: "none",
      q7: "rule_11ua_report",
      q8: "one_to_three_months",
    },
  },
  {
    id: "bootstrapped-first-raise",
    name: "Bootstrapped first raise",
    persona: "Two founders preparing institutional records for the first time.",
    answers: {
      q1: "sheets",
      q2: ["nothing"],
      q3: "no_pool",
      q4: "none",
      q5: "not_sure",
      q6: "none",
      q7: "no_priced_round",
      q8: "six_plus_months",
    },
  },
  {
    id: "instrument-heavy-seed",
    name: "Instrument-heavy seed",
    persona: "A fast-moving seed company with SAFEs, CCPS, and employee grants.",
    answers: {
      q1: "sheets",
      q2: ["safes", "ccps", "esop_grants"],
      q3: "approved_mostly_granted",
      q4: "partial_or_informal",
      q5: "current",
      q6: "none",
      q7: "rule_11ua_report",
      q8: "one_to_three_months",
    },
  },
  {
    id: "foreign-angel-live-round",
    name: "Foreign angel, live round",
    persona: "A company in diligence with earlier foreign money and uneven filings.",
    answers: {
      q1: "ca_cs",
      q2: ["convertibles"],
      q3: "approved_under_half",
      q4: "documented",
      q5: "behind",
      q6: "filings_unsure",
      q7: "negotiated_no_report",
      q8: "term_sheet_or_diligence",
    },
  },
  {
    id: "departed-cofounder",
    name: "Departed cofounder",
    persona: "A well-run company carrying one material legacy ownership issue.",
    answers: {
      q1: "platform",
      q2: ["nothing"],
      q3: "approved_mostly_granted",
      q4: "departed_founder",
      q5: "current",
      q6: "none",
      q7: "no_priced_round",
      q8: "six_plus_months",
    },
  },
  {
    id: "cross-border-complexity",
    name: "Cross-border complexity",
    persona: "A term-sheet-stage company with uncertain records and a land-border investor.",
    answers: {
      q1: "not_sure",
      q2: ["not_sure"],
      q3: "over_granted",
      q4: "none",
      q5: "not_sure",
      q6: "land_border_investor",
      q7: "not_sure",
      q8: "term_sheet_or_diligence",
    },
  },
] as const satisfies readonly FounderScenario[];
