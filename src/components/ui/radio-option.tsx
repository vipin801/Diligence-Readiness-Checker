"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

type RadioOptionProps = Omit<
  React.ComponentPropsWithoutRef<"input">,
  "type" | "className"
> & {
  /** The answer text. */
  label: React.ReactNode;
  /** Optional clarifier under the label. */
  description?: React.ReactNode;
  className?: string;
};

/**
 * A single-answer choice. Presentational only — the caller owns `checked` and
 * `onChange`; this primitive holds no state and knows nothing about questions.
 *
 * Wraps a real <input type="radio">, so arrow-key navigation, form semantics
 * and screen-reader grouping come for free. Give every option in a question the
 * same `name`, and wrap the set in a <fieldset> whose <legend> is the question.
 */
export function RadioOption({
  label,
  description,
  className,
  ...props
}: RadioOptionProps) {
  const id = useId();

  return (
    <div className={cn("option option--radio", className)}>
      <input id={id} type="radio" className="option__input sr-only" {...props} />
      <label htmlFor={id} className="option__body">
        <span className="option__indicator" aria-hidden="true">
          <span className="option__mark" />
        </span>
        <span className="option__text">
          <span className="option__label">{label}</span>
          {description && (
            <span className="option__description">{description}</span>
          )}
        </span>
      </label>
    </div>
  );
}
