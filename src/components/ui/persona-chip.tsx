import { cn } from "@/lib/cn";

export function PersonaChip({
  active = false,
  className,
  children,
  type = "button",
  ...props
}: React.ComponentPropsWithoutRef<"button"> & { active?: boolean }) {
  return (
    <button
      type={type}
      className={cn("persona-chip", className)}
      data-active={active}
      aria-pressed={active}
      {...props}
    >
      {children}
    </button>
  );
}

