import type { Metadata } from "next";
import { StyleguideClient } from "./styleguide-client";

/**
 * TEMPORARY ROUTE — delete before launch.
 *
 * This exists so the Incentiv design system can be verified visually before any
 * tool features are built. It ships no product behaviour. Removing it means
 * deleting `src/app/styleguide/` entirely; nothing else imports from it.
 */
export const metadata: Metadata = {
  title: "Styleguide — Incentiv Design System",
  robots: { index: false, follow: false },
};

export default function StyleguidePage() {
  return <StyleguideClient />;
}
