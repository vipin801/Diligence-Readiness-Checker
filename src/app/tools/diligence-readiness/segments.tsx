import type { HeadlineSegment } from "@/lib/results";

/**
 * Renders a line that mixes words and numerals.
 *
 * Numerals are always IBM Plex Mono 300 (DESIGN.md §3) and always upright — the
 * headline around them is DM Serif Display italic, and Plex Mono is loaded
 * without an italic face, so `not-italic` avoids a synthesised oblique.
 *
 * Shared by the register headline, the split headings and the gate body, so
 * there is exactly one place that decides how a number is set.
 */
export function HeadlineLine({
  segments,
}: {
  segments: readonly HeadlineSegment[];
}) {
  return (
    <>
      {segments.map((segment, index) =>
        segment.kind === "number" ? (
          <span
            key={index}
            className="font-mono font-light not-italic tabular-nums"
          >
            {segment.value}
          </span>
        ) : (
          <span key={index}>{segment.value}</span>
        ),
      )}
    </>
  );
}
