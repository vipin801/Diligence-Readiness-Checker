import { cn } from "@/lib/cn";

/** Text input styled with the warm card surface, 4px radius, and blue focus ring. */
export function Input({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"input">) {
  return <input className={cn("input-field", className)} {...props} />;
}

