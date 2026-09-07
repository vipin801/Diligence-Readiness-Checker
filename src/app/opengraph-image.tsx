import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { SITE_NAME, TOOL_NAME, TOOL_STAT_LINE } from "@/lib/brand";

/**
 * The social card.
 *
 * This tool is meant to be forwarded — a founder sends it to another founder,
 * an operator drops it in a WhatsApp group, an investor pastes it into a reply.
 * The unfurled card is therefore the first and often the only impression, so it
 * carries the promise rather than a logo, and it is built out of the same three
 * typefaces and the same warm cream ground as the tool itself: DM Serif Display
 * italic for the line that does the work, Inter for the label, IBM Plex Mono for
 * the numbers, and the blue edge rules that DESIGN.md calls the site's
 * infrastructural signature.
 *
 * Generated once at build time. Sits at the app root so every route inherits it.
 */

/**
 * This used to end "ninety seconds, free, no signup", which the results gate
 * made false: the diagnosis is free and always will be, but the fixes are sent
 * by email and that needs an address. The card now promises exactly what the
 * intro's mono line promises, and nothing more.
 */
export const alt =
  "Diligence Readiness Check by Incentiv — see what investors will flag in your data room. Eight questions, ninety seconds, free, with the full report by email.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori reads TTF/OTF/WOFF — not WOFF2 — so these are vendored separately from
// the self-hosted WOFF2 faces next/font ships to the browser. Latin subsets:
// ~97KB in total, read at build time and never served to a visitor.
const fontDir = join(process.cwd(), "src", "assets", "fonts");
const [interRegular, interBold, dmSerifItalic, plexMonoLight] = await Promise.all([
  readFile(join(fontDir, "inter-latin-400-normal.woff")),
  readFile(join(fontDir, "inter-latin-700-normal.woff")),
  readFile(join(fontDir, "dm-serif-display-latin-400-italic.woff")),
  readFile(join(fontDir, "ibm-plex-mono-latin-300-normal.woff")),
]);

const CREAM = "#FDFCF9";
const INK = "#1A1A1A";
const MUTED = "#666666";
const BORDER = "#E5E2DC";
/** The AA-legible twin of #3482ff, matching --primary-text in globals.css. */
const BLUE = "#005DD6";
const BRAND_BLUE = "#3482FF";
const TERRACOTTA = "#D4715D";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: CREAM,
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* The page-edge lines, held still. */}
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 0,
            bottom: 0,
            width: 1,
            background: `linear-gradient(to bottom, ${BORDER} 0%, ${BRAND_BLUE} 45%, ${BORDER} 100%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 40,
            top: 0,
            bottom: 0,
            width: 1,
            background: `linear-gradient(to bottom, ${BORDER} 0%, ${BRAND_BLUE} 55%, ${BORDER} 100%)`,
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Inter",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: BLUE,
            }}
          >
            {SITE_NAME} · {TOOL_NAME}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 30,
              fontFamily: "DM Serif Display",
              fontStyle: "italic",
              fontSize: 76,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: INK,
            }}
          >
            <div style={{ display: "flex" }}>Find what investors will flag</div>
            {/* One line, one span: satori shrinks flex children before it wraps
                them, and a background-clip:text span that gets shrunk is a
                headline with its last word sliced off. */}
            <div style={{ display: "flex" }}>
              <span
                style={{
                  flexShrink: 0,
                  backgroundImage: `linear-gradient(135deg, ${BRAND_BLUE} 0%, ${TERRACOTTA} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                in your data room.
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 30,
              fontFamily: "Inter",
              fontSize: 27,
              lineHeight: 1.5,
              color: MUTED,
              maxWidth: 860,
            }}
          >
            A risk register, not a score — every issue investors typically flag,
            the delay it adds at close, and who fixes it.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", height: 1, backgroundColor: BORDER }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 26,
            }}
          >
            <div
              style={{
                display: "flex",
                fontFamily: "IBM Plex Mono",
                fontWeight: 300,
                fontSize: 26,
                letterSpacing: "-0.02em",
                color: INK,
              }}
            >
              {TOOL_STAT_LINE}
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: "Inter",
                fontSize: 22,
                color: MUTED,
              }}
            >
              incentiv.finance
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: interRegular, weight: 400, style: "normal" },
        { name: "Inter", data: interBold, weight: 700, style: "normal" },
        {
          name: "DM Serif Display",
          data: dmSerifItalic,
          weight: 400,
          style: "italic",
        },
        {
          name: "IBM Plex Mono",
          data: plexMonoLight,
          weight: 300,
          style: "normal",
        },
      ],
    },
  );
}
