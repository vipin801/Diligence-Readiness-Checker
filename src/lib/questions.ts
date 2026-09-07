export type QuestionInputType = "single-select" | "multi-select";

export interface QuestionOption<Id extends string = string> {
  id: Id;
  label: string;
}

export interface Question<
  Id extends string = string,
  InputType extends QuestionInputType = QuestionInputType,
  OptionId extends string = string,
> {
  id: Id;
  prompt: string;
  helperText?: string;
  inputType: InputType;
  options: readonly QuestionOption<OptionId>[];
}

export const QUESTIONS = [
  {
    id: "q1",
    prompt: "Where does your cap table live today?",
    inputType: "single-select",
    options: [
      {
        id: "platform",
        label: "On a platform (Tabulate / Qapita / Carta / other)",
      },
      { id: "sheets", label: "In Excel or Google Sheets" },
      { id: "ca_cs", label: "My CA or CS maintains it" },
      { id: "not_sure", label: "Honestly, not sure" },
    ],
  },
  {
    id: "q2",
    prompt: "What's outstanding besides ordinary equity?",
    inputType: "multi-select",
    options: [
      { id: "nothing", label: "Nothing — plain equity only" },
      { id: "safes", label: "SAFEs" },
      { id: "convertibles", label: "Convertible notes / CCDs" },
      { id: "ccps", label: "CCPS (preference shares)" },
      { id: "esop_grants", label: "ESOP grants" },
      { id: "not_sure", label: "Not sure" },
    ],
  },
  {
    id: "q3",
    prompt: "Your ESOP pool:",
    inputType: "single-select",
    options: [
      { id: "no_pool", label: "No pool yet" },
      { id: "approved_under_half", label: "Pool approved, less than half granted" },
      { id: "approved_mostly_granted", label: "Pool approved, mostly granted" },
      { id: "over_granted", label: "Over-granted / need to expand" },
      { id: "not_sure", label: "Not sure" },
    ],
  },
  {
    id: "q4",
    prompt: "Founder vesting:",
    inputType: "single-select",
    options: [
      { id: "documented", label: "All founders on vesting, documented" },
      {
        id: "partial_or_informal",
        label: "Some founders, or informal/undocumented",
      },
      { id: "none", label: "No vesting agreements" },
      {
        id: "departed_founder",
        label: "A founder has left and still holds equity",
      },
    ],
  },
  {
    id: "q5",
    prompt: "ROC / MCA filings:",
    inputType: "single-select",
    options: [
      { id: "current", label: "All current" },
      { id: "behind", label: "Behind on some" },
      { id: "not_sure", label: "Not sure" },
    ],
  },
  {
    id: "q6",
    prompt: "Foreign shareholders or foreign capital?",
    inputType: "single-select",
    options: [
      { id: "none", label: "None" },
      { id: "fc_gpr_on_time", label: "Yes — FC-GPR filed on time" },
      { id: "filings_unsure", label: "Yes — not sure about the filings" },
      {
        id: "land_border_investor",
        label: "Investor from a country sharing a land border with India",
      },
    ],
  },
  {
    id: "q7",
    prompt: "Your last round's valuation:",
    inputType: "single-select",
    options: [
      {
        id: "rule_11ua_report",
        label: "Merchant banker / Rule 11UA report on file",
      },
      { id: "negotiated_no_report", label: "Negotiated, no formal report" },
      { id: "no_priced_round", label: "No priced round yet" },
      { id: "not_sure", label: "Not sure" },
    ],
  },
  {
    id: "q8",
    prompt: "When are you raising?",
    inputType: "single-select",
    options: [
      { id: "not_raising", label: "Not currently raising" },
      { id: "six_plus_months", label: "In 6+ months" },
      { id: "one_to_three_months", label: "In the next 1–3 months" },
      {
        id: "term_sheet_or_diligence",
        label: "Term sheet in hand / diligence has started",
      },
    ],
  },
] as const satisfies readonly Question[];

export type QuestionDefinition = (typeof QUESTIONS)[number];
export type QuestionId = QuestionDefinition["id"];
export type SingleSelectQuestionId = Extract<
  QuestionDefinition,
  { inputType: "single-select" }
>["id"];
export type MultiSelectQuestionId = Extract<
  QuestionDefinition,
  { inputType: "multi-select" }
>["id"];

export type OptionId<QId extends QuestionId> = Extract<
  QuestionDefinition,
  { id: QId }
>["options"][number]["id"];

export type Answers = {
  [Q in QuestionDefinition as Q["id"]]: Q["inputType"] extends "multi-select"
    ? Array<Q["options"][number]["id"]>
    : Q["options"][number]["id"];
};

/**
 * Narrows a partially-filled answer set to a complete one. The question flow
 * builds answers incrementally, and `evaluate()` / `buildResults()` require all
 * eight — so this is the single gate between the two.
 */
export function isCompleteAnswers(draft: Partial<Answers>): draft is Answers {
  return QUESTIONS.every((question) => {
    const value = (draft as Record<string, unknown>)[question.id];
    return Array.isArray(value) ? value.length > 0 : typeof value === "string";
  });
}
