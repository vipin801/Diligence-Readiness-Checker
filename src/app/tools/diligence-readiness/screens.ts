import {
  CHECK_GROUP_LABEL,
  CHECK_GROUP_ORDER,
  areasInGroup,
  type CheckArea,
  type CheckGroupId,
} from "@/lib/brand";
import { QUESTIONS, type QuestionDefinition, type QuestionId } from "@/lib/questions";

/**
 * How the eight questions are GROUPED on screen — and nothing else.
 *
 * This is a presentation concern, deliberately kept out of `questions.ts`.
 * There are still eight independent questions, `evaluate()` still takes all
 * eight answers, and every flag rule is unchanged. All this file decides is
 * which questions appear together and what the group is called.
 *
 * **Step 15 regrouped four pairs into three steps**, so the flow matches the
 * three check groups the rail lists — cap table, equity plan, compliance — and
 * a founder can see the whole shape of the check before answering anything.
 * The group ids and labels are `brand.ts`'s, not this file's: the rail's
 * accordion and the step tabs have to name the same three things, and the only
 * way to guarantee that is for both to read one list.
 *
 * Q8 ("when are you raising?") sits in the third group and fires no flag. It is
 * urgency, not compliance, which is why that group's label carries "& timing".
 */
export interface QuestionScreen {
  /** Stable key — re-keys the entry animation and identifies the screen. */
  id: CheckGroupId;
  /** The mono tab label and the rail's group heading. */
  label: string;
  /** The tab's sans sub-label. "3 questions". */
  countLabel: string;
  questions: readonly QuestionDefinition[];
  /** What this group actually checks, for the rail's accordion. */
  areas: readonly CheckArea[];
}

const SCREEN_PLAN = [
  {
    id: "cap-table",
    questions: ["q1", "q2", "q7"],
  },
  {
    id: "equity-plan",
    questions: ["q3", "q4"],
  },
  {
    id: "compliance",
    questions: ["q5", "q6", "q8"],
  },
] as const satisfies readonly {
  id: CheckGroupId;
  questions: readonly QuestionId[];
}[];

/** The tab's sub-label. Takes a plain `number` so it stays correct if a group
 *  is ever reduced to one question — `SCREEN_PLAN` is `as const`, and comparing
 *  its literal lengths against 1 is a type error rather than a runtime branch. */
function countLabelFor(count: number): string {
  return count === 1 ? "1 question" : `${count} questions`;
}

function definitionOf(id: QuestionId): QuestionDefinition {
  const question = QUESTIONS.find((candidate) => candidate.id === id);
  if (!question) {
    throw new Error(`Screen plan references unknown question "${id}".`);
  }
  return question;
}

export const QUESTION_SCREENS: readonly QuestionScreen[] = SCREEN_PLAN.map(
  (screen) => ({
    id: screen.id,
    label: CHECK_GROUP_LABEL[screen.id],
    countLabel: countLabelFor(screen.questions.length),
    questions: screen.questions.map(definitionOf),
    areas: areasInGroup(screen.id),
  }),
);

/**
 * The grouping is the one place the screen layer can silently disagree with the
 * data layer: drop a question here and the flow would never ask it, then fail
 * the completeness gate on the way to the results. Checked at module load, so a
 * mismatch fails the build rather than a founder's session.
 */
const PLANNED_IDS = QUESTION_SCREENS.flatMap((screen) =>
  screen.questions.map((question) => question.id),
);

if (
  PLANNED_IDS.length !== QUESTIONS.length ||
  new Set(PLANNED_IDS).size !== QUESTIONS.length
) {
  throw new Error(
    `Screen plan covers ${PLANNED_IDS.length} of ${QUESTIONS.length} questions; every question must appear exactly once.`,
  );
}

/**
 * The steps and the rail's groups are the same three things. If they ever stop
 * being the same three things, the tabs and the accordion would disagree about
 * which step a group jumps to — so this fails at module load too.
 */
const PLANNED_GROUPS = QUESTION_SCREENS.map((screen) => screen.id);

if (
  PLANNED_GROUPS.length !== CHECK_GROUP_ORDER.length ||
  PLANNED_GROUPS.some((id, index) => id !== CHECK_GROUP_ORDER[index])
) {
  throw new Error(
    "Screen plan and CHECK_GROUP_ORDER must list the same groups in the same order.",
  );
}

/**
 * 1-based position in `QUESTIONS`, not on the screen. The `question_answered`
 * analytics event has always carried the question's own number, and the
 * completion funnel is read off it — regrouping the screens must not move it.
 */
export function questionNumber(id: QuestionId): number {
  return QUESTIONS.findIndex((question) => question.id === id) + 1;
}

/** Which step a question is asked on. Used to send Continue back to the first
 *  step that still has a gap in it. */
export function screenIndexOf(id: QuestionId): number {
  return QUESTION_SCREENS.findIndex((screen) =>
    screen.questions.some((question) => question.id === id),
  );
}
