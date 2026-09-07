import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { FOUNDER_SCENARIOS } from "@/lib/__fixtures__/scenarios";
import { GATE_COPY } from "@/lib/gate";
import { buildResults, headlineText } from "@/lib/results";
import type { Answers } from "@/lib/questions";

import { ResultsScreen } from "./results-screen";

/**
 * Renders the real component for every Step 3 fixture. `buildResults` is tested
 * on its own in `src/lib/results.test.ts`; this file checks the other half —
 * that the screen actually puts that content on the page, in the order
 * tool-spec-v1.md §4 specifies, with the type roles DESIGN.md requires.
 */
function render(answers: Answers): string {
  return renderToStaticMarkup(
    <ResultsScreen answers={answers} onReviewAnswers={() => {}} onRestart={() => {}} />,
  );
}

const cleanAnswers: Answers = {
  q1: "platform",
  q2: ["nothing"],
  q3: "approved_under_half",
  q4: "documented",
  q5: "current",
  q6: "none",
  q7: "rule_11ua_report",
  q8: "not_raising",
};

const CASES = [
  ...FOUNDER_SCENARIOS.map((scenario) => ({
    id: scenario.id,
    answers: scenario.answers as Answers,
  })),
  { id: "clean", answers: cleanAnswers },
  {
    id: "single-blocker",
    answers: { ...cleanAnswers, q4: "departed_founder" } as Answers,
  },
];

/** Strips tags so copy can be asserted without markup getting in the way. */
function textOf(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&ldquo;|&rdquo;|“|”/g, '"')
    .replace(/&#x27;|&#39;|’/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** Every free step on the page, in the order the split renders them. */
function allFreeSteps(results: ReturnType<typeof buildResults>): string[] {
  return [
    ...(results.selfFix?.items ?? []),
    ...(results.needsSystem?.items ?? []),
  ].flatMap((item) => [...item.steps]);
}

describe.each(CASES)("results screen — $id", ({ answers }) => {
  const html = render(answers);
  const text = textOf(html);
  const results = buildResults(answers);

  it("headlines the page with the two stat tiles, before any other heading", () => {
    const tilesAt = html.indexOf('class="stat-row"');
    expect(tilesAt).toBeGreaterThan(-1);
    expect(tilesAt).toBeLessThan(html.indexOf("heading-section"));

    // The tiles ARE the h1 — the sentence they replaced survives as the
    // heading's accessible name, so nothing was lost to a screen reader.
    expect(html).toContain(`aria-label="${headlineText(results.headline)}"`);
  });

  it("sets both headline numerals in IBM Plex Mono, and shows no third one", () => {
    const values = html.match(/<span class="stat-value">([^<]*)<\/span>/g) ?? [];
    expect(values).toHaveLength(2);
    for (const tile of results.summary.stats) {
      expect(html).toContain(`<span class="stat-value">${tile.value}</span>`);
      expect(html).toContain(tile.label);
    }
  });

  it("keeps the gradient off the figures and on the one section heading", () => {
    // Step 14 PART B: the gradient was fighting the numbers for attention.
    const gradients = html.match(/text-gradient/g) ?? [];
    expect(gradients).toHaveLength(1);
    expect(html).not.toMatch(/class="[^"]*stat-value[^"]*text-gradient/);
    expect(html).toContain("heading-section text-gradient");
  });

  /**
   * Step 15. Three cells, and the reason they are safe to show on a tool that
   * refuses to score anything is that they always add to one stated total: the
   * caption names the denominator, so no cell can be read as a mark out of it.
   */
  it("partitions the nine check areas across the tally strip", () => {
    const cells = results.summary.tally.cells;
    expect(cells.map((cell) => cell.value).reduce((a, b) => a + b, 0)).toBe(9);

    for (const cell of cells) {
      expect(html).toContain(
        `<dd class="tally-value">${cell.value}</dd>`,
      );
      expect(text).toContain(cell.label);
    }
    expect(text).toContain(results.summary.tally.caption);
  });

  it("never sets a tally figure in anything but Plex Mono, and never as a fraction", () => {
    const values = html.match(/<dd class="tally-value">([^<]*)<\/dd>/g) ?? [];
    expect(values).toHaveLength(3);

    // A score is the one output this tool does not produce. "6/9", "6 of 9"
    // and "67%" are the three shapes it would arrive in.
    expect(text).not.toMatch(/\d+\s*\/\s*9/);
    expect(text).not.toMatch(/\d+ out of \d+/);
    expect(text).not.toMatch(/\d+%/);
  });

  it("carries the spec's subline and the Q8 timing line", () => {
    expect(text).toContain(
      "Based on how diligence typically runs for Indian companies at your stage.",
    );
    expect(text).toContain(results.urgencyLine);
  });

  it("puts every flag on the page with its severity, weeks, owner and source answer", () => {
    for (const flag of results.flags) {
      expect(text).toContain(flag.title);
      expect(text).toContain(flag.whyInvestorAsks);
      expect(text).toContain(flag.severityLabel);
      expect(text).toContain(flag.delayUnit);
      expect(text).toContain(flag.fixedByLabel);
      expect(text).toContain(`"${flag.answerEcho}"`);
    }
  });

  it("renders the flags in the order the register gives them", () => {
    const positions = results.flags.map((flag) => text.indexOf(flag.title));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  it("gives every self-fix and system step away on the page", () => {
    for (const column of [results.selfFix, results.needsSystem]) {
      if (!column) continue;
      expect(text).toContain(column.intro);
      for (const item of column.items) {
        expect(text).toContain(item.actionHeadline);
        for (const step of item.steps) {
          expect(text).toContain(step);
        }
      }
    }
  });

  it("ships no build placeholders", () => {
    expect(text).not.toContain("Step 6");
    expect(text).not.toContain("placeholder");
  });

  it("renders each pitch inside the flow, never as a banner or an overlay", () => {
    for (const placement of results.conversion.placements) {
      expect(text).toContain(placement.pitch.productLine);
      expect(text).toContain(placement.pitch.ctaLabel);
      expect(html).toContain(`data-pitch-variant="${placement.pitch.variant}"`);
    }

    // §4: "Never a banner ad." Nothing on this page is pinned to the viewport.
    expect(html).not.toMatch(/class="[^"]*(fixed|sticky)/);
    expect(html).not.toMatch(/position:\s*(fixed|sticky)/);
  });

  it("gives away two free actions before the first pitch appears", () => {
    for (const placement of results.conversion.placements) {
      expect(placement.freeStepsBefore).toBeGreaterThanOrEqual(2);

      const pitchAt = text.indexOf(placement.pitch.productLine);
      expect(pitchAt).toBeGreaterThan(-1);

      const stepsAbove = allFreeSteps(results).filter((step) => {
        const at = text.indexOf(step);
        return at > -1 && at < pitchAt;
      });
      expect(stepsAbove.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("calls the cap-table product Tabulate, never Equity", () => {
    expect(text).not.toMatch(/Equity/);
  });

  it("keeps the WHOLE diagnosis out of the gate — every finding, at any count", () => {
    const gateAt = html.indexOf('class="gate-region"');

    if (results.state === "clean") {
      // Nothing to gate: the clean state keeps the optional capture, whose copy
      // promises no wall — true exactly here and nowhere else.
      expect(gateAt).toBe(-1);
      expect(text).toContain("Email me this report");
      expect(text).toContain("there is no wall");
      return;
    }

    expect(gateAt).toBeGreaterThan(-1);
    expect(html).toContain(GATE_COPY.heading);
    expect(html).toContain(GATE_COPY.submitLabel);
    // The old ungated form asked for the same thing twice. It is gone from
    // every gated result.
    expect(text).not.toContain("there is no wall");

    // Everything above the gate: the stat tiles, all three visuals, and every
    // finding in full. This is the Step 14 split, and it is what makes the gate
    // correct at two flags as well as at seven.
    const free = textOf(html.slice(0, gateAt));
    expect(free).toContain(results.summary.benchmark.caption);
    expect(free).toContain(results.summary.timeline.caption);
    for (const flag of results.flags) {
      expect(free).toContain(flag.title);
      expect(free).toContain(flag.whyInvestorAsks);
      expect(free).toContain(flag.severityLabel);
      expect(free).toContain(flag.fixedByLabel);
    }
  });

  it("never puts up a gate with nothing behind it", () => {
    const gateAt = html.indexOf('class="gate-region"');
    if (results.state === "clean") {
      expect(gateAt).toBe(-1);
      return;
    }

    // The remedy, and there is always at least one of them: every flag lands
    // in one of the two split columns.
    const gated = textOf(html.slice(gateAt));
    const remedies = [
      ...(results.selfFix?.items ?? []),
      ...(results.needsSystem?.items ?? []),
    ];

    expect(remedies.length).toBeGreaterThanOrEqual(1);
    expect(remedies.length).toBe(results.flags.length);
    for (const item of remedies) {
      expect(gated).toContain(item.actionHeadline);
    }
  });

  it("blurs real content — never a placeholder — and takes it out of reach", () => {
    if (results.state === "clean") return;

    expect(html).toContain('class="gate-content" data-locked="true"');
    expect(html).toMatch(/<div class="gate-content"[^>]*inert=""/);
    expect(html).toMatch(/<div class="gate-content"[^>]*aria-hidden="true"/);

    // Whatever sits behind the blur is the real report: every guidance step is
    // in the markup, blurred, not swapped for lorem ipsum.
    for (const step of allFreeSteps(results)) {
      expect(text).toContain(step);
    }
  });

  it("keeps the gate inline — not a modal, not a takeover", () => {
    if (results.state === "clean") return;

    // Absolutely positioned inside the blurred region, so the blur stays
    // visible beside and below it. Nothing here is pinned to the viewport, and
    // nothing covers the page.
    expect(html).toContain("gate-card-slot");
    expect(html).not.toMatch(/class="[^"]*inset-0/);
    expect(html).not.toContain("role=\"dialog\"");
  });

  it("draws all three summary visuals, above the register", () => {
    const registerAt = html.indexOf("What investors typically flag here");

    // The rail carries lanes — and an axis to measure them against — only when
    // something fired. A clean result gets the sentence instead: a week axis
    // with nothing on it would be a measurement of nothing.
    const markers = ["readiness-svg", "benchmark-svg"];
    if (results.summary.timeline.lanes.length > 0) markers.push("timeline-axis");

    for (const marker of markers) {
      const at = html.indexOf(marker);
      expect(at, marker).toBeGreaterThan(-1);
      if (registerAt > -1) expect(at, marker).toBeLessThan(registerAt);
    }

    expect(html.match(/class="timeline-lane"/g) ?? []).toHaveLength(
      results.summary.timeline.lanes.length,
    );
  });

  it("says every number the visuals draw, as text as well", () => {
    for (const lane of results.summary.timeline.lanes) {
      expect(text).toContain(lane.weeksLabel);
      expect(text).toContain(lane.fixedByLabel);
    }
    for (const axis of results.summary.readiness.axes) {
      expect(text).toContain(axis.label);
      expect(text).toContain(axis.statusWord);
    }
    expect(text).toContain(results.summary.readiness.caption);
    expect(text).toContain(results.summary.benchmark.bandLabel);
  });

  it("never lets a severity travel as colour alone", () => {
    // Every glyph on the page is marked with the severity it belongs to, and
    // the word for that severity is on the page too. Neither the SVG fills nor
    // the glyphs are ever the only channel.
    const marked = html.match(/severity-glyph" data-severity="(\w+)"/g) ?? [];
    for (const match of marked) {
      const severity = /data-severity="(\w+)"/.exec(match)?.[1];
      expect(severity).toBeDefined();
      expect(text).toMatch(
        new RegExp(severity === "clear" ? "Clear" : `${severity}`, "i"),
      );
    }
    // The glyphs are decoration; nothing on the page depends on them rendering.
    expect(html).toMatch(/aria-hidden="true" class="severity-glyph"/);
  });

  it("shows no score anywhere", () => {
    expect(text.toLowerCase()).not.toMatch(/score|out of 100|\/100|rating/);
  });

  it("keeps a section label and a divider on every major section", () => {
    const labels = html.match(/class="section-label/g) ?? [];
    const dividers = html.match(/class="section-divider"/g) ?? [];
    expect(labels.length).toBeGreaterThanOrEqual(3);
    expect(dividers.length).toBeGreaterThanOrEqual(2);
  });
});

describe("results screen — state-specific treatments", () => {
  it("gives a lone flag the display type instead of the card type", () => {
    const html = render({ ...cleanAnswers, q4: "departed_founder" });

    expect(html).toContain("number-large");
    expect(html).not.toContain("number-display");
  });

  it("keeps multi-flag cards on the compact type scale", () => {
    const html = render({ ...cleanAnswers, q1: "sheets", q5: "behind" });

    expect(html).toContain("number-display");
    expect(html).not.toContain("number-large");
  });

  it("replaces the register with the clean state, and still offers a next step", () => {
    const html = render(cleanAnswers);
    const text = textOf(html);

    // The clean headline is the h1's accessible name now, not display type.
    expect(html).toContain(
      `aria-label="${headlineText(buildResults(cleanAnswers).headline)}"`,
    );
    expect(html).toContain("Nothing here that typically delays a close.");
    expect(text).toContain("What keeps it that way");
    expect(text).toContain("It is not a diligence review");
    expect(text).not.toContain("What investors typically flag here");
    expect(text).not.toContain("of these need a system");
  });

  it("offers a way back and a way to start again", () => {
    const text = textOf(render(cleanAnswers));

    expect(text).toContain("Change an answer");
    expect(text).toContain("Start over");
  });
});
