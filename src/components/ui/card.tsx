import { cn } from "@/lib/cn";

export type CardElevation = "card" | "surface" | "raised";

const ELEVATION: Record<CardElevation, string> = {
  /** Level 2 — white on cream, warm border. The default raised surface. */
  card: "card-elevated",
  /** Level 1 — warm gray tint, no border. Muted panels inside a card. */
  surface: "bg-surface rounded-[var(--radius)]",
  /** Level 3 — soft shadow. Dropdowns, popovers, tooltips only. */
  raised: "card-raised",
};

type CardProps = React.ComponentPropsWithoutRef<"div"> & {
  elevation?: CardElevation;
  /** Adds the blue border tint + 2px lift on hover. For clickable cards. */
  interactive?: boolean;
};

/**
 * Elevation in this system comes from background stepping (cream → warm gray →
 * white) plus a warm border — not from drop shadows. DESIGN.md §6.
 */
export function Card({
  elevation = "card",
  interactive = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(ELEVATION[elevation], interactive && "card-hover", className)}
      {...props}
    >
      {children}
    </div>
  );
}
