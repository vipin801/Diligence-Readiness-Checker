import { cn } from "@/lib/cn";

type ProgressBarProps = Omit<React.ComponentPropsWithoutRef<"div">, "role"> & {
  /** Current position, clamped to 0…max. */
  value: number;
  max?: number;
  /**
   * Counter shown above the track, e.g. "3 of 8". Rendered in IBM Plex Mono
   * because it is a number.
   */
  label?: string;
  /**
   * Announce movement to assistive technology. The question flow advances on a
   * timer after a single-select answer, so without this a screen-reader user
   * gets a new question with no indication that the position changed.
   */
  announce?: boolean;
  /** What to announce. Defaults to `label`. */
  announcement?: string;
};

/**
 * The 8-question progress track. Fill is brand blue; track is the warm gray
 * surface. Radius stays 4px — this is not a pill.
 */
export function ProgressBar({
  value,
  max = 100,
  label,
  announce = false,
  announcement,
  className,
  ...props
}: ProgressBarProps) {
  const safeMax = max > 0 ? max : 1;
  const clamped = Math.min(Math.max(value, 0), safeMax);
  const pct = (clamped / safeMax) * 100;
  const text = announcement ?? label;

  return (
    <div className={cn("w-full", className)} {...props}>
      {label && (
        <p className="mono-label mb-2 tabular-nums">
          {label}
        </p>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuetext={text}
        aria-label={label ?? "Progress"}
        className="h-1.5 w-full overflow-hidden rounded-[var(--radius)] bg-surface"
      >
        <div
          className="h-full rounded-[var(--radius)] bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      {announce && text ? (
        <span role="status" aria-live="polite" className="sr-only">
          {text}
        </span>
      ) : null}
    </div>
  );
}
