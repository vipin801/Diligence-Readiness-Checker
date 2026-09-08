"use client";

import {
  useEffect,
  useReducer,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import { Button, Card, SectionLabel } from "@/components/ui";
import { track } from "@/lib/analytics";
import { CheckboxOption } from "@/components/ui/checkbox-option";
import { RadioOption } from "@/components/ui/radio-option";
import { TOOL_META_PROMISE } from "@/lib/brand";
import {
  QUESTIONS,
  isCompleteAnswers,
  type Answers,
  type OptionId,
  type QuestionId,
} from "@/lib/questions";

import { ArrowLeftIcon } from "./icons";
import { ResultsScreen } from "./results-screen";
import { StepTabs, type StepState } from "./step-tabs";
import { ToolRail } from "./tool-rail";
import {
  QUESTION_SCREENS,
  questionNumber,
  type QuestionScreen,
} from "./screens";

type FlowScreen = "questions" | "complete";
type DraftAnswers = Partial<Answers>;

interface FlowState {
  screen: FlowScreen;
  /** Index into `QUESTION_SCREENS` — one of the three steps. */
  currentScreenIndex: number;
  answers: DraftAnswers;
  /**
   * Whether the amber "still to answer" note is showing. Set by Continue, never
   * by an unanswered question on its own: nagging a founder about a question
   * they have not reached yet is the behaviour a disabled button had, and it is
   * the reason the button is no longer disabled.
   */
  showValidation: boolean;
}

type FlowAction =
  | {
      type: "select-single";
      questionId: Exclude<QuestionId, "q2">;
      optionId: string;
    }
  | { type: "toggle-multi"; optionId: OptionId<"q2"> }
  | { type: "next" }
  | { type: "back" }
  | { type: "jump"; index: number }
  | { type: "restart" };

/**
 * Step 15 removed the intro splash: the build prompt asks for question one on
 * screen at load, and everything the splash carried — the heading, the lede,
 * the scope of the check — is in the left rail, visible the whole way through.
 */
const INITIAL_STATE: FlowState = {
  screen: "questions",
  currentScreenIndex: 0,
  answers: {},
  showValidation: false,
};

const EXCLUSIVE_MULTI_OPTIONS = new Set<OptionId<"q2">>([
  "nothing",
  "not_sure",
]);

/**
 * The beat between the last answer on a step landing and the step moving on.
 * Long enough that the answer is seen to register before the screen changes.
 */
const AUTO_ADVANCE_MS = 300;

function isAnswered(value: unknown): boolean {
  return Array.isArray(value) ? value.length > 0 : value !== undefined;
}

/** The questions on this step that are still open, in screen order. */
function unansweredOn(
  screen: QuestionScreen,
  answers: DraftAnswers,
): readonly QuestionId[] {
  return screen.questions
    .filter((question) => !isAnswered(answers[question.id]))
    .map((question) => question.id);
}

/** The first step that still has a gap in it, or -1 when there is none. */
function firstIncompleteScreen(answers: DraftAnswers): number {
  return QUESTION_SCREENS.findIndex(
    (screen) => unansweredOn(screen, answers).length > 0,
  );
}

/**
 * A step advances on its own only when every question on it is a single select
 * — Q2 is a multi-select and there is no way to tell "still choosing" from
 * "done choosing" — and never on the last step, where the next thing is the
 * register itself and a founder should be the one to ask for it.
 */
function autoAdvances(screen: QuestionScreen, index: number): boolean {
  if (index === QUESTION_SCREENS.length - 1) {
    return false;
  }
  return screen.questions.every(
    (question) => question.inputType === "single-select",
  );
}

function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case "select-single":
      return {
        ...state,
        showValidation: false,
        answers: {
          ...state.answers,
          [action.questionId]: action.optionId,
        } as DraftAnswers,
      };
    case "toggle-multi": {
      const selected = state.answers.q2 ?? [];
      const isSelected = selected.includes(action.optionId);
      let nextSelection: Answers["q2"];

      if (isSelected) {
        nextSelection = selected.filter((id) => id !== action.optionId);
      } else if (EXCLUSIVE_MULTI_OPTIONS.has(action.optionId)) {
        nextSelection = [action.optionId];
      } else {
        nextSelection = [
          ...selected.filter((id) => !EXCLUSIVE_MULTI_OPTIONS.has(id)),
          action.optionId,
        ];
      }

      return {
        ...state,
        showValidation: false,
        answers: { ...state.answers, q2: nextSelection },
      };
    }
    case "next": {
      const screen = QUESTION_SCREENS[state.currentScreenIndex];

      // Continue validates rather than sitting disabled: a disabled control
      // cannot say why it is disabled, and a founder who has missed one of
      // three questions deserves a sentence, not a dead button.
      if (unansweredOn(screen, state.answers).length > 0) {
        return { ...state, showValidation: true };
      }

      if (state.currentScreenIndex < QUESTION_SCREENS.length - 1) {
        return {
          ...state,
          currentScreenIndex: state.currentScreenIndex + 1,
          showValidation: false,
        };
      }

      // Last step, and the steps can be jumped between — so a gap left behind
      // on an earlier step surfaces here rather than at the results boundary.
      const gap = firstIncompleteScreen(state.answers);
      if (gap !== -1) {
        return { ...state, currentScreenIndex: gap, showValidation: true };
      }

      return { ...state, screen: "complete", showValidation: false };
    }
    case "jump":
      return {
        ...state,
        screen: "questions",
        currentScreenIndex: action.index,
        showValidation: false,
      };
    case "restart":
      return INITIAL_STATE;
    case "back":
      if (state.screen === "complete") {
        return {
          ...state,
          screen: "questions",
          currentScreenIndex: QUESTION_SCREENS.length - 1,
          showValidation: false,
        };
      }
      if (state.currentScreenIndex === 0) {
        return state;
      }
      return {
        ...state,
        currentScreenIndex: state.currentScreenIndex - 1,
        showValidation: false,
      };
  }
}

/**
 * One question inside the step card. Three of these stack in the widest step,
 * separated by a hairline, each with its options in a 2x2 grid.
 */
function QuestionBlock({
  question,
  answers,
  onSelectSingle,
  onToggleMulti,
}: {
  question: QuestionScreen["questions"][number];
  answers: DraftAnswers;
  onSelectSingle: (
    questionId: Exclude<QuestionId, "q2">,
    optionId: string,
  ) => void;
  onToggleMulti: (optionId: OptionId<"q2">) => void;
}) {
  const helperId = `${question.id}-helper`;
  const isMultiSelect = question.inputType === "multi-select";
  const multiSelection = answers.q2 ?? [];
  const currentAnswer = answers[question.id];

  // Read as plain strings: this sits before the multi-select narrowing, so an
  // option id here is any of the eight questions' ids, not only Q2's.
  const multiSelected = new Set<string>(multiSelection);

  // Roving tab stop, so six checkboxes are ONE tab stop and Tab moves between
  // questions rather than through the options of one — which is what a radio
  // group does natively. Arrows move inside the group.
  const rovingIndex = Math.max(
    question.options.findIndex((option) => multiSelected.has(option.id)),
    0,
  );

  return (
    <fieldset
      className="question-block border-0 p-0"
      aria-describedby={isMultiSelect ? helperId : undefined}
    >
      <legend className="w-full p-0">
        <h3 className="heading-sub text-balance text-foreground">
          {question.prompt}
        </h3>
      </legend>

      {isMultiSelect ? (
        <p id={helperId} className="text-small mt-2 text-muted-foreground">
          Select all that apply.
        </p>
      ) : null}

      {/* `data-question-group` scopes arrow-key movement, so arrows never jump
          out of the question the focus is inside. */}
      <div
        data-question-group
        data-choice-kind={isMultiSelect ? "multiple" : "single"}
        className="option-grid mt-5"
      >
        {isMultiSelect
          ? question.options.map((option, index) => (
              <CheckboxOption
                key={option.id}
                name={question.id}
                label={option.label}
                value={option.id}
                checked={multiSelected.has(option.id)}
                tabIndex={index === rovingIndex ? 0 : -1}
                onChange={() => onToggleMulti(option.id)}
              />
            ))
          : question.options.map((option) => (
              <RadioOption
                key={option.id}
                name={question.id}
                label={option.label}
                value={option.id}
                checked={currentAnswer === option.id}
                onChange={() => onSelectSingle(question.id, option.id)}
              />
            ))}
      </div>

      {isMultiSelect ? (
        <p className="text-small mt-3 text-muted-foreground" aria-live="polite">
          {multiSelection.length > 0
            ? `${multiSelection.length} selected`
            : "Pick one or more — or “Nothing”"}
        </p>
      ) : null}
    </fieldset>
  );
}

export function QuestionFlow() {
  const [state, dispatch] = useReducer(flowReducer, INITIAL_STATE);
  const pendingAdvance = useRef<number | null>(null);
  const questionRegion = useRef<HTMLDivElement>(null);
  const hasMounted = useRef(false);

  const screen = QUESTION_SCREENS[state.currentScreenIndex];

  const clearPendingAdvance = () => {
    if (pendingAdvance.current !== null) {
      window.clearTimeout(pendingAdvance.current);
      pendingAdvance.current = null;
    }
  };

  useEffect(() => {
    return clearPendingAdvance;
  }, []);

  // There is no Start button any more, so the check begins when the page does.
  useEffect(() => {
    track({ name: "tool_started" });
  }, []);

  useEffect(() => {
    if (state.screen !== "questions") {
      return;
    }

    // Never on the first render: the founder arrived at a page, and pulling
    // focus into a radio group on load would move the viewport and talk over
    // the rail before they have read a word of it.
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    // The first answered option on the step if there is one — so coming Back
    // lands on what was chosen — otherwise the step's first option.
    const selectedInput =
      questionRegion.current?.querySelector<HTMLInputElement>("input:checked");
    const firstInput =
      questionRegion.current?.querySelector<HTMLInputElement>("input");
    (selectedInput ?? firstInput)?.focus();
  }, [state.currentScreenIndex, state.screen]);

  const handleBack = () => {
    clearPendingAdvance();
    dispatch({ type: "back" });
  };

  const handleJump = (index: number) => {
    clearPendingAdvance();
    dispatch({ type: "jump", index });
  };

  /**
   * Leaves the current step. A single select reports itself the moment it is
   * picked; a multi-select cannot, so its answer is reported here, on the way
   * out, with the selection the founder settled on.
   */
  const advance = (answers: DraftAnswers) => {
    clearPendingAdvance();

    for (const question of screen.questions) {
      if (question.inputType !== "multi-select") {
        continue;
      }
      const selection = answers[question.id] ?? [];
      if (selection.length === 0) {
        continue;
      }
      track({
        name: "question_answered",
        questionId: question.id,
        questionNumber: questionNumber(question.id),
        optionIds: selection,
      });
    }

    dispatch({ type: "next" });
  };

  const handleQuestionKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      handleBack();
      return;
    }

    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      event.target.click();
      return;
    }

    const direction =
      event.key === "ArrowDown" || event.key === "ArrowRight"
        ? 1
        : event.key === "ArrowUp" || event.key === "ArrowLeft"
          ? -1
          : 0;

    if (direction === 0) {
      return;
    }

    // Scoped to the question the focus is inside. Arrows move within a group;
    // Tab is what moves between groups.
    const group = event.target.closest<HTMLElement>("[data-question-group]");
    const inputs = Array.from(
      group?.querySelectorAll<HTMLInputElement>("input:not(:disabled)") ?? [],
    );

    if (inputs.length === 0) {
      return;
    }

    event.preventDefault();
    const currentIndex = inputs.indexOf(event.target);
    const nextIndex = (currentIndex + direction + inputs.length) % inputs.length;
    inputs[nextIndex]?.focus();
  };

  const handleSingleSelect = (
    questionId: Exclude<QuestionId, "q2">,
    optionId: string,
  ) => {
    clearPendingAdvance();
    track({
      name: "question_answered",
      questionId,
      questionNumber: questionNumber(questionId),
      optionIds: [optionId],
    });
    dispatch({ type: "select-single", questionId, optionId });

    // The reducer has not run yet, so the step's completeness is read off the
    // answers this click is about to produce.
    const nextAnswers = {
      ...state.answers,
      [questionId]: optionId,
    } as DraftAnswers;

    if (!autoAdvances(screen, state.currentScreenIndex)) {
      return;
    }
    if (unansweredOn(screen, nextAnswers).length > 0) {
      return;
    }

    pendingAdvance.current = window.setTimeout(() => {
      pendingAdvance.current = null;
      advance(nextAnswers);
    }, AUTO_ADVANCE_MS);
  };

  const handleToggleMulti = (optionId: OptionId<"q2">) => {
    clearPendingAdvance();
    dispatch({ type: "toggle-multi", optionId });
  };

  if (state.screen === "complete") {
    // The results screen needs all eight answers. The reducer holds a partial
    // answer set, so this is the single place that narrowing happens. Continue
    // will not leave the last step with a gap anywhere, so the false branch is
    // a guard rather than a state the flow can reach.
    if (isCompleteAnswers(state.answers)) {
      return (
        <ResultsScreen
          answers={state.answers}
          onReviewAnswers={handleBack}
          onRestart={() => {
            clearPendingAdvance();
            dispatch({ type: "restart" });
          }}
        />
      );
    }

    return (
      <main className="relative flex flex-1 flex-col">
        <IncompleteAnswersScreen
          answered={Object.keys(state.answers).length}
          onResume={handleBack}
          onRestart={() => {
            clearPendingAdvance();
            dispatch({ type: "restart" });
          }}
        />
      </main>
    );
  }

  const stepNumber = state.currentScreenIndex + 1;
  const isLastScreen = stepNumber === QUESTION_SCREENS.length;
  const stillOpen = unansweredOn(screen, state.answers);
  const answeredCount = QUESTIONS.filter((question) =>
    isAnswered(state.answers[question.id]),
  ).length;

  const stepStates: StepState[] = QUESTION_SCREENS.map((candidate, index) => {
    if (index === state.currentScreenIndex) return "current";
    return unansweredOn(candidate, state.answers).length === 0 ? "done" : "todo";
  });

  return (
    <main className="relative flex flex-1 flex-col">
      <div
        aria-hidden="true"
        className="bg-grid bg-grid-fade pointer-events-none absolute inset-x-0 top-0 h-48 opacity-25 md:h-64"
      />

      <div className="relative z-10 flex flex-1 flex-col pb-12 pt-10 md:pb-16 md:pt-16">
        <div className="container-tool">
          <div className="tool-split">
            <ToolRail
              screens={QUESTION_SCREENS}
              currentIndex={state.currentScreenIndex}
              onJump={handleJump}
            />

            <div className="tool-column">
              <StepTabs
                screens={QUESTION_SCREENS}
                states={stepStates}
                onJump={handleJump}
              />

              {/* Progress as a sentence rather than a bar: the build prompt
                  rules out a percentage, and "4 of 8 answered" is the number a
                  founder actually wants. It is the live region for the flow, so
                  a jump between steps is announced with its new position. */}
              <div className="tool-meta" role="status" aria-live="polite">
                <p className="mono-label">
                  Step {stepNumber} of {QUESTION_SCREENS.length} ·{" "}
                  {answeredCount} of {QUESTIONS.length} answered
                </p>
                <p className="mono-label tool-meta__promise">
                  {TOOL_META_PROMISE}
                </p>
              </div>

              <Card className="tool-card">
                <div
                  ref={questionRegion}
                  onKeyDown={handleQuestionKeyDown}
                  // Re-keyed per step so the entry animation replays and the
                  // browser rebuilds the groups rather than mutating them.
                  key={screen.id}
                  className="animate-question"
                >
                  {screen.questions.map((question) => (
                    <QuestionBlock
                      key={question.id}
                      question={question}
                      answers={state.answers}
                      onSelectSingle={handleSingleSelect}
                      onToggleMulti={handleToggleMulti}
                    />
                  ))}
                </div>

                <div className="tool-card__footer">
                  {state.currentScreenIndex > 0 ? (
                    <Button variant="ghost" onClick={handleBack}>
                      <ArrowLeftIcon />
                      Back
                    </Button>
                  ) : (
                    <span aria-hidden="true" />
                  )}

                  <div className="tool-card__actions">
                    {state.showValidation && stillOpen.length > 0 ? (
                      <p role="alert" className="text-small validation-note">
                        {stillOpen.length}{" "}
                        {stillOpen.length === 1 ? "question" : "questions"} still
                        to answer.
                      </p>
                    ) : null}
                    <Button
                      fullWidth
                      className="sm:w-auto"
                      onClick={() => advance(state.answers)}
                    >
                      {isLastScreen ? "See my flags →" : "Continue →"}
                    </Button>
                  </div>
                </div>
              </Card>

              <p className="text-small mt-4 hidden text-muted-foreground lg:block">
                Arrow keys within a question · Tab between them · Enter to select
                · Esc to go back
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/**
 * The flow cannot reach "complete" without all eight answers, so this should be
 * unreachable — but the reducer holds a partial set, and a page that silently
 * dropped someone back into question one would be worse than one that says what
 * happened and offers a way out.
 */
function IncompleteAnswersScreen({
  answered,
  onResume,
  onRestart,
}: {
  answered: number;
  onResume: () => void;
  onRestart: () => void;
}) {
  return (
    <section className="section-padding relative z-10 flex flex-1 items-center">
      <div className="container-tool">
        <div className="animate-rise" role="alert">
          <SectionLabel className="mb-4">Something went wrong</SectionLabel>
          <h1 className="heading-h1 measure-copy text-foreground">
            We could not read all eight answers back
          </h1>
          <p className="text-body measure-copy mt-6 text-muted-foreground">
            <span className="font-mono font-light tabular-nums">{answered}</span>{" "}
            of <span className="font-mono font-light tabular-nums">8</span> came
            through. Nothing was sent anywhere and nothing was saved — the check
            runs entirely in this browser tab, so the fastest fix is to pick up
            where you left off.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button onClick={onResume}>Go back to the last step</Button>
            <Button variant="secondary" onClick={onRestart}>
              Start over
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
