"use client";

import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "arrow";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "btn btn-primary",
  secondary: "btn btn-secondary",
  ghost: "btn btn-ghost",
  // Inline directional link — "See your real number →". Not a .btn: it has no
  // padding box of its own, so it must not inherit the 44px target sizing.
  arrow: "cta-arrow",
};

type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  /** Stretch to the width of the parent — used for stacked mobile CTAs. */
  fullWidth?: boolean;
};

/**
 * The system's button. Styling lives in globals.css under the same
 * `.btn-primary` / `.btn-secondary` / `.btn-ghost` / `.cta-arrow` names that
 * DESIGN.md §4 uses, so the spec and the code stay greppable against each other.
 */
export function Button({
  variant = "primary",
  fullWidth = false,
  className,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(VARIANTS[variant], fullWidth && "w-full", className)}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Anchor twin of <Button>, for CTAs that navigate rather than act.
 * Same visual contract; correct semantics for links.
 */
export function ButtonLink({
  variant = "primary",
  fullWidth = false,
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"a"> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}) {
  return (
    <a
      className={cn(
        VARIANTS[variant],
        fullWidth && "w-full",
        "no-underline",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
