import { cn } from "@/lib/cn";

type ProgressBarProps = Omit<React.ComponentPropsWithoutRef<"div">, "role"> & {
  /** Current position, clamped to 0…max. */
  value: number;
  max?: number;
  /**
   * Counter shown above the track, e.g. "Question 3 of 8". Rendered in
   * IBM Plex Mono because it is a number.
   */
  label?: string;
};

/**
 * The 8-question progress track. Fill is brand blue; track is the warm gray
 * surface. Radius stays 4px — this is not a pill.
 */
export function ProgressBar({
  value,
  max = 100,
  label,
  className,
  ...props
}: ProgressBarProps) {
  const safeMax = max > 0 ? max : 1;
  const clamped = Math.min(Math.max(value, 0), safeMax);
  const pct = (clamped / safeMax) * 100;

  return (
    <div className={cn("w-full", className)} {...props}>
      {label && (
        <p className="mb-2 font-mono text-xs font-light tracking-tight text-muted-foreground tabular-nums">
          {label}
        </p>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-label={label ?? "Progress"}
        className="h-1.5 w-full overflow-hidden rounded-[var(--radius)] bg-surface"
      >
        <div
          className="h-full rounded-[var(--radius)] bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
