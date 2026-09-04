import type { Metadata } from "next";
import { DM_Serif_Display, IBM_Plex_Mono, Inter } from "next/font/google";
import { PageEdgeLines } from "@/components/layout/page-edge-lines";
import "./globals.css";

/**
 * Three typefaces, three domains (DESIGN.md §3):
 *   DM Serif Display — display + section headings. Loaded italic-only, because
 *                      the brand never uses it upright.
 *   Inter            — all UI text. The cv02/cv03/cv04/cv11 OpenType features
 *                      are applied globally in globals.css.
 *   IBM Plex Mono    — every number, week count, and financial figure.
 */
const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Diligence Readiness Check — Incentiv",
  description:
    "Find out what investors will flag in your data room — in 90 seconds. Free, no signup.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${dmSerifDisplay.variable} ${ibmPlexMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <PageEdgeLines />
        {children}
      </body>
    </html>
  );
}
