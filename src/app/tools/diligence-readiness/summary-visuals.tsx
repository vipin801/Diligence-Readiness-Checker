import type {
  BenchmarkView,
  ReadinessView,
  StatTile,
  TallyView,
  TimelineView,
} from "@/lib/summary";

/**
 * The summary band — Step 14 PART B and PART C.
 *
 * Inline SVG only. No chart library: a rail, a hexagon and a scale are a few
 * hundred lines of geometry, and Recharts or Chart.js would add a large
 * dependency that ignores the DM Serif / Plex Mono type system and themes
 * badly. `BUILD-PROMPTS-PHASE2.md` says so explicitly.
 *
 * Three rules run through everything below:
 *
 *   1. **The SVG is decoration over text.** Every shape here is
 *      `aria-hidden`, and every number it draws is also rendered as real
 *      markup beside it. Nothing is only a picture.
 *   2. **Severity is glyph + word + colour, in that order.** The palette is
 *      the validated one; amber and green cannot be separated reliably, so the
 *      colour is always the third channel and never the only one.
 *   3. **No copy is written here.** Every string comes from `summary.ts`,
 *      which is where the honesty rules are tested.
 */

/* --- Stat tiles — PART B --------------------------------------------------- */

/**
 * Two headline numbers is a KPI row, not a sentence. Plex Mono 300 at display
 * size, Inter small underneath, and deliberately no gradient: the blue →
 * terracotta gradient goes on the section heading below, where it is not
 * competing with the figures for the eye.
 */
export function StatTiles({ tiles }: { tiles: readonly StatTile[] }) {
  return (
    // Spans throughout, because this row is the content of the page's <h1>:
    // a heading's content model is phrasing content, and a <div> inside it is
    // invalid markup that browsers then repair in their own ways.
    <span className="stat-row">
      {tiles.map((tile) => (
        <span key={tile.id} className="stat-tile">
          <span className="stat-value">{tile.value}</span>
          <span className="stat-label mt-2">{tile.label}</span>
          {tile.note ? (
            <span className="stat-note mt-1 opacity-80">{tile.note}</span>
          ) : null}
        </span>
      ))}
    </span>
  );
}

/* --- The tally strip — Step 15 --------------------------------------------- */

/**
 * Three cells under the stat tiles: blocking, to tidy, clear.
 *
 * The numerals are Plex Mono like every other number in the tool — the build
 * prompt asked for a display serif here, and DESIGN.md §3 does not allow a
 * number in DM Serif anywhere. The caption is not optional decoration: it names
 * the nine areas the three cells partition, which is what stops the strip
 * reading as a mark out of nine.
 */
export function TallyStrip({ tally }: { tally: TallyView }) {
  return (
    <div className="tally">
      <dl className="tally-strip">
        {tally.cells.map((cell) => (
          // `dt` before `dd` is the only valid order inside a `dl`, so the
          // cell is column-reverse and the numeral still sits above its label.
          // A screen reader hears "Blocking, 2", which is the right way round.
          <div key={cell.id} className="tally-cell">
            <dt className="mono-label tally-label">{cell.label}</dt>
            <dd className="tally-value">{cell.value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-small tally-caption">{tally.caption}</p>
    </div>
  );
}

/* --- The close timeline — PART C.1 ----------------------------------------- */

/** One lane's bar. `preserveAspectRatio="none"` so every lane in the band
 *  stretches over the same 0–100 week axis whatever the column width is. */
function LaneBar({
  head,
  tail,
  openEnded,
  severity,
}: {
  head: number;
  tail: number;
  openEnded: boolean;
  severity: string;
}) {
  const headWidth = Math.max(head * 100, 1.5);
  // The 2px surface gap between the solid head and the lighter min–max tail,
  // expressed in the 0–100 axis space at the lane's drawn width.
  const gap = 0.6;
  const tailStart = headWidth + gap;
  const tailWidth = Math.max(tail * 100 - gap, 0);

  return (
    <svg
      aria-hidden="true"
      className="timeline-lane"
      viewBox="0 0 100 10"
      preserveAspectRatio="none"
      role="presentation"
    >
      <rect x="0" y="0" width="100" height="10" className="timeline-track" />
      <rect
        x="0"
        y="0"
        width={headWidth}
        height="10"
        data-severity={severity}
        className="timeline-head"
      />
      {tailWidth > 0 ? (
        <rect
          x={tailStart}
          y="0"
          width={openEnded ? 100 - tailStart : tailWidth}
          height="10"
          data-severity={severity}
          data-open={openEnded || undefined}
          className="timeline-tail"
        />
      ) : null}
    </svg>
  );
}

export function CloseTimeline({ timeline }: { timeline: TimelineView }) {
  if (timeline.lanes.length === 0) {
    return (
      <div className="rounded-[var(--radius)] border border-border bg-surface/50 p-6">
        <p className="text-body text-foreground">
          <span aria-hidden="true" className="severity-glyph" data-severity="clear">
            ✓
          </span>
          Nothing on this rail. No finding on the list adds weeks to a close.
        </p>
      </div>
    );
  }

  return (
    <div>
      <ul className="grid gap-2">
        {timeline.lanes.map((lane) => (
          <li
            key={lane.flagId}
            className="grid gap-2 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)_auto] md:items-center md:gap-6"
            title={lane.tooltip}
          >
            <p className="text-small min-w-0 text-foreground">
              <span
                aria-hidden="true"
                className="severity-glyph"
                data-severity={lane.severity}
              >
                {lane.severityGlyph}
              </span>
              <span className="sr-only">{lane.severityWord}: </span>
              {lane.title}
            </p>

            <LaneBar
              head={lane.headFraction}
              tail={lane.tailFraction}
              openEnded={lane.openEnded}
              severity={lane.severity}
            />

            <p className="text-small flex items-baseline gap-2 md:justify-end">
              <span className="mono-figure text-foreground">
                {lane.weeksLabel}
              </span>
              <span className="text-muted-foreground">
                {lane.openEnded ? "open-ended" : "wks"} · {lane.fixedByLabel}
              </span>
            </p>
          </li>
        ))}
      </ul>

      {/* The axis. Relative, always: the tool never asks for a close date, so
          there is no calendar anywhere on this rail. */}
      <div className="mt-3 md:grid md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)_auto] md:gap-6">
        <p className="mono-label hidden md:block">{timeline.startLabel}</p>
        <div className="md:col-start-2">
          <svg
            aria-hidden="true"
            className="timeline-axis"
            viewBox="0 0 100 6"
            preserveAspectRatio="none"
            role="presentation"
          >
            <line x1="0" y1="0.5" x2="100" y2="0.5" className="timeline-rule" />
            {timeline.ticks.map((week) => (
              <line
                key={week}
                x1={(week / timeline.axisMaxWeeks) * 100}
                y1="0"
                x2={(week / timeline.axisMaxWeeks) * 100}
                y2="4"
                className="timeline-tick"
              />
            ))}
          </svg>
          <div className="mt-1 flex justify-between">
            {timeline.ticks.map((week) => (
              <span key={week} className="mono-label">
                {week}
              </span>
            ))}
          </div>
          <p className="mono-label mt-1 md:hidden">{timeline.startLabel}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <p className="text-small text-foreground">
          {timeline.criticalPathLabel}
        </p>
        <p className="text-small measure-copy text-muted-foreground">
          {timeline.caption}
        </p>
      </div>
    </div>
  );
}

/* --- The readiness map — PART C.2 ------------------------------------------ */

const RADAR_SIZE = 240;
const RADAR_CENTRE = RADAR_SIZE / 2;
const RADAR_RADIUS = 92;
/** A blocker still has to be a visible vertex rather than a point at the
 *  centre, so level 0 keeps a floor. The rings sit on the same mapping. */
const RADAR_FLOOR = 0.16;

function radiusFor(level: number): number {
  return RADAR_RADIUS * (RADAR_FLOOR + (1 - RADAR_FLOOR) * (level / 3));
}

function pointAt(index: number, radius: number, count: number) {
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
  return {
    x: RADAR_CENTRE + radius * Math.cos(angle),
    y: RADAR_CENTRE + radius * Math.sin(angle),
  };
}

export function ReadinessMap({ readiness }: { readiness: ReadinessView }) {
  const { axes } = readiness;
  const count = axes.length;

  const polygon = axes
    .map((axis, index) => {
      const { x, y } = pointAt(index, radiusFor(axis.level), count);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <div>
      <svg
        aria-hidden="true"
        role="presentation"
        viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`}
        className="readiness-svg"
      >
        {/* Grid — warm border colour, 1px, recessive. */}
        {[1, 2, 3].map((level) => (
          <polygon
            key={level}
            className="readiness-grid"
            points={axes
              .map((_, index) => {
                const { x, y } = pointAt(index, radiusFor(level), count);
                return `${x.toFixed(2)},${y.toFixed(2)}`;
              })
              .join(" ")}
          />
        ))}
        {axes.map((axis, index) => {
          const { x, y } = pointAt(index, RADAR_RADIUS, count);
          return (
            <line
              key={axis.id}
              className="readiness-grid"
              x1={RADAR_CENTRE}
              y1={RADAR_CENTRE}
              x2={x}
              y2={y}
            />
          );
        })}

        <polygon className="readiness-shape" points={polygon} />

        {axes.map((axis, index) => {
          const { x, y } = pointAt(index, radiusFor(axis.level), count);
          return (
            <g key={axis.id} data-severity={axis.severity}>
              <circle className="readiness-vertex" cx={x} cy={y} r="4.5" />
              {axis.severity === "blocker" ? (
                // The ▲ glyph, drawn rather than typeset, so it survives a
                // missing font. A blocker vertex is never a bare dot.
                <path
                  className="readiness-vertex-glyph"
                  d={`M ${x} ${y - 9.5} L ${x + 8} ${y + 4.5} L ${x - 8} ${y + 4.5} Z`}
                />
              ) : null}
            </g>
          );
        })}
      </svg>

      {/* The text equivalent, and the reason the shape is allowed to exist:
          every axis carries its status word whether or not the polygon reads. */}
      <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
        {axes.map((axis) => (
          <li
            key={axis.id}
            className="text-small flex items-baseline justify-between gap-4 border-b border-border/60 pb-2"
          >
            <span className="text-foreground">{axis.label}</span>
            <span className="text-muted-foreground">
              <span
                aria-hidden="true"
                className="severity-glyph"
                data-severity={axis.severity}
              >
                {axis.glyph}
              </span>
              {axis.statusWord}
            </span>
          </li>
        ))}
      </ul>

      <p className="text-small mt-4 measure-copy text-muted-foreground">
        {readiness.caption}
      </p>
    </div>
  );
}

/* --- The benchmark bar — PART C.3 ------------------------------------------ */

export function BenchmarkBar({ benchmark }: { benchmark: BenchmarkView }) {
  const { scaleMax, bandMin, bandMax, count } = benchmark;
  const pct = (value: number) => (value / scaleMax) * 100;

  return (
    <div>
      <svg
        aria-hidden="true"
        role="presentation"
        viewBox="0 0 100 18"
        preserveAspectRatio="none"
        className="benchmark-svg"
      >
        <rect x="0" y="7" width="100" height="4" className="benchmark-track" />
        <rect
          x={pct(bandMin)}
          y="5"
          width={pct(bandMax) - pct(bandMin)}
          height="8"
          className="benchmark-band"
        />
        <line
          x1={pct(count)}
          y1="1"
          x2={pct(count)}
          y2="17"
          className="benchmark-marker"
        />
      </svg>

      {/* The scale, in Plex Mono, and the band named in words — the shaded
          region on its own says nothing. */}
      <div className="mt-2 flex items-baseline justify-between">
        <span className="mono-label">0</span>
        <span className="mono-label">{scaleMax}</span>
      </div>

      <p className="text-small mt-4 text-foreground">
        <span className="mono-figure">
          {bandMin}–{bandMax}
        </span>{" "}
        <span className="text-muted-foreground">{benchmark.bandLabel}</span>
      </p>
      <p className="text-body mt-2 measure-copy text-foreground">
        {benchmark.caption}
      </p>
    </div>
  );
}
