import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names, with later Tailwind utilities winning over earlier ones.
 * Lets every primitive accept a `className` override without specificity fights.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
