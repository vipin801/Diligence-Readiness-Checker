"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

type CheckboxOptionProps = Omit<
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
 * A multi-select choice — the shape Q2 ("What's outstanding besides ordinary
 * equity?") needs. Presentational only; the caller owns `checked` and
 * `onChange`.
 *
 * Visually identical to RadioOption apart from the square indicator and the
 * check glyph, so a mixed questionnaire reads as one system.
 */
export function CheckboxOption({
  label,
  description,
  className,
  ...props
}: CheckboxOptionProps) {
  const id = useId();

  return (
    <div className={cn("option option--checkbox", className)}>
      <input
        id={id}
        type="checkbox"
        className="option__input sr-only"
        {...props}
      />
      <label htmlFor={id} className="option__body">
        <span className="option__indicator" aria-hidden="true">
          <svg
            className="option__mark"
            width="11"
            height="11"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1.5 6.25 4.5 9.25 10.5 2.75" />
          </svg>
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
