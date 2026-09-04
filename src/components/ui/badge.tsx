import { cn } from "@/lib/cn";

/**
 * `blocker` / `delay` / `cleanup` are the three severities in tool-spec-v1.md §3.
 * `neutral` is DESIGN.md's base badge (trust indicators, category tags) and
 * `success` marks an all-clear.
 */
export type BadgeTone = "neutral" | "blocker" | "delay" | "cleanup" | "success";

/**
 * Severity is carried by the 6px dot, not by a coloured pill.
 *
 * DESIGN.md is strict that brand blue is the only chromatic colour in UI chrome
 * and that warm orange/yellow are forbidden, which rules out the usual
 * red/amber/green severity ramp. Red is sanctioned for "errors, warnings", so
 * Blocker takes destructive red and additionally tints its border — it is the
 * one severity that should stop a reader. Delay takes brand blue, Cleanup takes
 * muted gray, and both keep the warm border.
 */
const TONES: Record<BadgeTone, { container: string; dot: string }> = {
  neutral: { container: "", dot: "bg-primary" },
  blocker: {
    container: "border-destructive/30 bg-destructive/5",
    dot: "bg-destructive",
  },
  delay: { container: "", dot: "bg-primary" },
  cleanup: { container: "", dot: "bg-muted-foreground" },
  success: { container: "", dot: "bg-success" },
};

type BadgeProps = React.ComponentPropsWithoutRef<"span"> & {
  tone?: BadgeTone;
  /** Hide the leading dot — for plain inline tags. */
  hideDot?: boolean;
};

export function Badge({
  tone = "neutral",
  hideDot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  const { container, dot } = TONES[tone];
  return (
    <span className={cn("badge", container, className)} {...props}>
      {!hideDot && <span className={cn("badge-dot", dot)} aria-hidden="true" />}
      {children}
    </span>
  );
}
