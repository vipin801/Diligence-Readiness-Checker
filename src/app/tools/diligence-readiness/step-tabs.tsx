"use client";

import type { QuestionScreen } from "./screens";

export type StepState = "current" | "done" | "todo";

/**
 * The three step tabs across the top of the tool column — Step 15.
 *
 * A 2px top border carries the state, and it is never the only thing that does:
 * the current tab is also `aria-current="step"` and its label is ink rather
 * than muted, and a completed tab says so in its sub-label. DESIGN.md's rule
 * that a state is never colour alone applies to navigation as much as to a
 * severity badge.
 *
 * "Done" is read off the answers, not off the index — a founder who jumps to
 * step three and back should see step one still marked complete, and a founder
 * who skipped a question should not.
 */
export function StepTabs({
  screens,
  states,
  onJump,
}: {
  screens: readonly QuestionScreen[];
  states: readonly StepState[];
  onJump: (index: number) => void;
}) {
  return (
    <nav aria-label="Check steps" className="step-tabs">
      {screens.map((screen, index) => {
        const state = states[index];
        return (
          <button
            key={screen.id}
            type="button"
            className="step-tab"
            data-state={state}
            aria-current={state === "current" ? "step" : undefined}
            onClick={() => onJump(index)}
          >
            <span className="mono-label step-tab__label">{screen.label}</span>
            <span className="text-small step-tab__sub">
              {state === "done" ? "Answered" : screen.countLabel}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
