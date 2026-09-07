import { cn } from "@/lib/cn";

/**
 * The category signal that sits above every major section heading.
 * 10px / Inter 700 / uppercase / 0.15em tracking / brand blue.
 * DESIGN.md §9 calls this mandatory — do not ship a section without one.
 */
export function SectionLabel({
  as: Tag = "p",
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"p"> & { as?: "p" | "span" | "div" | "h1" | "h2" }) {
  return (
    <Tag className={cn("section-label", className)} {...props}>
      {children}
    </Tag>
  );
}
