import type { FlagId } from "./flags";

/**
 * What the founder can actually do about each flag — free, today, without us.
 *
 * tool-spec-v1.md §4 splits the register into "you can fix this yourself" and
 * "this needs a system". That split is about *who closes the flag*, not about
 * who gets help: every flag here carries concrete, ungated steps, because
 * CLAUDE.md's rule is that the tool must give real fixes away or it is a funnel
 * with a quiz on the front.
 *
 *   - Flags owned by `you` / `ca-cs`: `steps` is the whole fix.
 *   - Flags owned by `incentiv`:      `steps` is the first move the founder can
 *     make unaided, and `systemReason` says plainly why doing it once is not the
 *     same as it staying done. The pitch itself is Step 6, not this file.
 *
 * Tone rule (CLAUDE.md): "investors typically flag this", never "you are
 * non-compliant". Every sentence here describes what diligence looks for or what
 * a document says — never what the founder failed to do.
 */
export interface FlagGuidance {
  /** Imperative, specific, and about the action rather than the diagnosis. */
  actionHeadline: string;
  /** Ordered, concrete steps. Two to five; each one has to be doable unaided. */
  steps: readonly string[];
  /** Only on flags a system owns: why a one-off fix does not hold. */
  systemReason?: string;
}

export const FLAG_GUIDANCE: Record<FlagId, FlagGuidance> = {
  "cap-table-source-of-truth": {
    actionHeadline: "Reconcile your sheet against the MCA record yourself",
    systemReason:
      "A reconciliation is accurate on the day you do it. The next grant, transfer or round pulls it apart again, and the version investors see is whichever one you happened to send.",
    steps: [
      "Pull your own filing history from the MCA portal's View Public Documents service — every PAS-3 return of allotment, and the shareholding list attached to your last annual return.",
      "Put the MCA figures in one column and your spreadsheet in the next. This is the same comparison an investor's counsel runs; it is much cheaper to find the gap before they do.",
      "Against every line, write the date and the document it comes from. A share count nobody can source is the line that stalls a data room.",
    ],
  },

  "instrument-stack-unmodelled": {
    actionHeadline: "Model one conversion scenario by hand",
    systemReason:
      "Post-conversion ownership is a calculation, not a document. It moves every time a cap, a discount or a new instrument enters — so it has to be re-derived, not filed.",
    steps: [
      "List every outstanding instrument with its four commercial terms: amount, discount, valuation cap, and what triggers conversion.",
      "Check each term against the executed copy rather than the term sheet. Terms drift between the two more often than founders expect.",
      "Work one scenario end to end: at your target pre-money, what do the founders hold once everything converts? That is question one in the meeting, and you want to answer it from memory.",
    ],
  },

  "outstanding-instruments-unknown": {
    actionHeadline: "Rebuild the list of what is outstanding",
    systemReason:
      "The list is only useful if it stays complete. Side letters and new grants arrive between rounds, and a register rebuilt once a year is a register that is wrong for eleven months.",
    steps: [
      "Ask your CS for the register of members and, if any convertibles were issued, the register of debenture holders. Both are statutory records your company already maintains.",
      "Pull every PAS-3 and MGT-14 filed since incorporation from the MCA portal. Each one names an instrument that somebody approved.",
      "Search your email for signed side letters. Anti-dilution, pro-rata and MFN promises never appear in a register, and they are the ones diligence tends to surface.",
    ],
  },

  "esop-pool-not-approved": {
    actionHeadline: "Decide the pool size before an investor sets it for you",
    systemReason:
      "The pool is not one decision. It is a plan, a grant register, vesting schedules and a running count of what is left — and that count is what the next round negotiates against.",
    steps: [
      "Size the pool yourself, against your hiring plan for the next 18 months. Investors usually want it approved pre-money, which means it dilutes the existing holders rather than the incoming ones.",
      "Count the grants you have already promised in offer letters. Those promises are real to the employee whether or not an approved pool sits behind them.",
      "Ask your CS for the approval path and the calendar. Adopting the plan and approving the pool needs shareholder and board approval, and the paperwork takes longer than the decision does.",
    ],
  },

  "esop-pool-over-granted": {
    actionHeadline: "Reconcile grants issued against the pool approved",
    systemReason:
      "Granted, vested and exercised are three different numbers that dilute differently, and they move every month. A tracker maintained by hand is the thing that produced the gap.",
    steps: [
      "Rebuild the grant list from signed grant letters rather than from the tracker. The tracker is what you are checking.",
      "Split the total into granted, vested and exercised. Investors model all three, and only one of them is on your cap table today.",
      "Fold the expansion into the round's own approvals rather than running it separately. A mid-round top-up needs fresh consent from the same people who are negotiating the round.",
    ],
  },

  "founder-vesting-missing": {
    actionHeadline: "Put founder vesting on paper this week",
    steps: [
      "Agree the shape between the founders before any lawyer is involved: a total period (four years is the common ask), a cliff (usually one year), and what happens on a departure — good leaver and bad leaver.",
      "Because your shares are already issued, Indian founder vesting is written as a restriction on shares you already hold, not as a fresh grant: the founders' agreement gives the company or the continuing founders a right to buy back unvested shares at the price originally paid.",
      "Mirror that transfer restriction in the Articles of Association. In a private company the articles are what make a share-transfer restriction hold; an agreement on its own is easier to argue with.",
      "Credit time already served. Vesting is normally backdated to the date each founder actually started, which makes this far less painful between cofounders than it sounds.",
      "Sign the founders' agreement now and start the AoA amendment in parallel — the amendment needs a shareholders' resolution and an MGT-14 filing, and that is the part with a calendar attached.",
    ],
  },

  "departed-founder-equity": {
    actionHeadline:
      "Get the position and the paper straight before the conversation",
    systemReason:
      "This is a negotiation with a person, not a filing. What makes it tractable is walking in with the exact numbers, the documents and a modelled outcome — none of which a template produces.",
    steps: [
      "Write down the exact position: share count, percentage, class, the date they stopped working, and what they paid for the shares.",
      "Find whatever was signed — founders' agreement, separation letter, board minutes, an email that reads like an agreement. If nothing was signed, that is itself the finding, and it is much better known now than in week three of diligence.",
      "Open the conversation yourself rather than letting diligence open it. A departed founder who first hears about this from an investor's lawyer is a harder conversation than one you start.",
    ],
  },

  "roc-filings-not-current": {
    actionHeadline:
      "Get a dated list of what is outstanding, then clear the oldest first",
    steps: [
      "Take the list from the source rather than from memory. Your company's filing history is public on the MCA portal and will show exactly which years are missing.",
      "The recurring ones are AOC-4 for the financial statements and MGT-7 (or MGT-7A) for the annual return, plus DIR-3 KYC for every director each year and ADT-1 when the auditor is appointed.",
      "The event filings are the ones that get missed: PAS-3 within 30 days of an allotment, MGT-14 for the resolutions that require it, and SH-7 if you increased authorised capital.",
      "Additional fee accrues per day per form until each one is filed, so the cost of this only moves in one direction. Ask your CA or CS for the dated list this week and work backwards from the oldest.",
    ],
  },

  "foreign-capital-filings-unclear": {
    actionHeadline: "Build the evidence folder for every non-resident allotment",
    systemReason:
      "The exposure is per allotment and per transfer, and the windows are short. Working out where you stand — and what the route is where a filing is late — is advisory work, not a form.",
    steps: [
      "For every allotment to a non-resident, put four things in one folder: the date the funds were received, the FIRC and KYC from your AD bank, the allotment date, and the FIRMS acknowledgement if you have one.",
      "Line those dates up against the windows. FC-GPR is due within 30 days of allotment; FC-TRS within 60 days of a transfer between a resident and a non-resident. That comparison is the entire diagnosis.",
      "Where a filing is late, there is a defined late-submission route rather than an open-ended problem. Knowing which filings are late, and by how long, is what decides which route applies.",
    ],
  },

  "press-note-3-approval": {
    actionHeadline: "Map the investor's ownership chain before the terms harden",
    systemReason:
      "The question is about beneficial ownership through a chain of entities, and the answer decides which approval route the round takes. It is worth getting right once, in writing.",
    steps: [
      "Map the investing entity's full ownership chain, not just its country of incorporation. The rule looks through to the beneficial owner, so a fund domiciled elsewhere can still fall within it.",
      "Investment from these countries is permitted — it goes through the government approval route rather than the automatic one. The variable is timing, not permission.",
      "Applications are made through the government's foreign investment facilitation portal. Having the ownership chain documented before you file is what keeps a file moving rather than bouncing.",
      "Tell your lead investor early. A round priced on an automatic-route timeline that then moves to the approval route is where the friction actually shows up.",
    ],
  },

  "valuation-report-missing": {
    actionHeadline: "Write down the basis for the price you agreed",
    systemReason:
      "The report has to match the instrument, the class and the date of the allotment it supports, and where non-resident money is involved it also has to satisfy FEMA pricing. That is a specialist sign-off, not a document you draft.",
    steps: [
      "Collect what you already have: the board resolution approving the issue price, the PAS-3 for that allotment, and any valuation memo or model from the round.",
      "Write the basis down in a paragraph — how the price was arrived at, and what the company looked like at the time. Investors accept a negotiated price; what they ask for is what supported it.",
      "If any of that money came from a non-resident, pricing also has to be supported under FEMA, so a single properly scoped report does double duty. Check the dates line up with the allotment before you commission anything.",
    ],
  },
};
