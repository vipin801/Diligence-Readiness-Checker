import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNav } from "@/components/layout/site-nav";
import { ToolLinkCards } from "@/components/layout/tool-link-cards";
import {
  TOOL_DESCRIPTION,
  TOOL_NAME,
  TOOL_PATH,
  TOOL_TITLE,
} from "@/lib/brand";

import { QuestionFlow } from "./question-flow";

export const metadata: Metadata = {
  // The root layout's title template appends "— Incentiv".
  title: TOOL_NAME,
  description: TOOL_DESCRIPTION,
  alternates: { canonical: TOOL_PATH },
  openGraph: {
    type: "website",
    url: TOOL_PATH,
    title: TOOL_TITLE,
    description: TOOL_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TOOL_TITLE,
    description: TOOL_DESCRIPTION,
  },
};

export default function DiligenceReadinessPage() {
  return (
    <>
      <SiteNav />
      <QuestionFlow />
      <ToolLinkCards />
      <SiteFooter />
    </>
  );
}
