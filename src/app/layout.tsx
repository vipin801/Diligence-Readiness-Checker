import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, IBM_Plex_Mono, Inter } from "next/font/google";
import { PageEdgeLines } from "@/components/layout/page-edge-lines";
import { SITE_NAME, SITE_URL, TOOL_DESCRIPTION, TOOL_TITLE } from "@/lib/brand";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
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

/**
 * This tool is built to be forwarded between founders — WhatsApp, a partner's
 * email, a Slack channel — so the card that unfurls carries the promise, not
 * the brand. `metadataBase` makes the generated OG image URL absolute, which
 * every scraper requires.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TOOL_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: TOOL_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  keywords: [
    "cap table",
    "due diligence",
    "startup fundraising India",
    "ESOP pool",
    "ROC filings",
    "FEMA FC-GPR",
    "founder vesting",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_IN",
    title: TOOL_TITLE,
    description: TOOL_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TOOL_TITLE,
    description: TOOL_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  // Both themes are declared so the browser chrome (address bar, scrollbars)
  // matches whichever one the visitor is actually looking at.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDFCF9" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // The inline script below sets the theme class before React hydrates.
      suppressHydrationWarning
      className={`${inter.variable} ${dmSerifDisplay.variable} ${ibmPlexMono.variable} h-full`}
    >
      <head>
        {/* Blocking on purpose: it must run before first paint, or a visitor
            who chose dark sees a cream flash on every navigation. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">
        <PageEdgeLines />
        {children}
      </body>
    </html>
  );
}
