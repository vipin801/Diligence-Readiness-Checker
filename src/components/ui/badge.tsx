import { cn } from "@/lib/cn";

/**
 * `blocker` / `delay` / `cleanup` are the three severities in tool-spec-v1.md §3.
 * `neutral` is DESIGN.md's base badge (trust indicators, category tags) and
 * `success` marks an all-clear.
 */
export type BadgeTone = "neutral" | "blocker" | "delay" | "cleanup" | "success";

/**
 * Severity is carried by the marker's SHAPE first and its colour second.
 *
 * DESIGN.md is strict that brand blue is the only chromatic colour in UI chrome
 * and that warm orange/yellow are forbidden, which rules out the usual
 * red/amber/green severity ramp. Red is sanctioned for "errors, warnings", so
 * Blocker takes destructive red and additionally tints its border — it is the
 * one severity that should stop a reader.
 *
 * On top of that each severity gets a different mark: a filled disc for
 * Blocker, an open ring for Delay, a short bar for Cleanup. With the written
 * label beside it, severity survives greyscale, colour-blindness and forced
 * colours — it is never carried by hue alone (WCAG 1.4.1).
 */
const TONES: Record<BadgeTone, { container: string; dot: string }> = {
  neutral: { container: "", dot: "bg-primary" },
  blocker: {
    container:
      "border-destructive/40 bg-destructive/5 dark:border-destructive/50 dark:bg-destructive/12",
    dot: "badge-dot--blocker bg-destructive",
  },
  delay: { container: "", dot: "badge-dot--delay" },
  cleanup: { container: "", dot: "badge-dot--cleanup bg-muted-foreground" },
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
