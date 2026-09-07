import { cn } from "@/lib/cn";

/** The design system's fixed 48px brand-blue icon container. */
export function IconBox({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span className={cn("icon-box", className)} {...props}>
      {children}
    </span>
  );
}

