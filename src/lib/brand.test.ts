import { describe, expect, it } from "vitest";

import {
  CHECK_AREAS,
  CHECK_AREA_COUNT_WORD,
  CHECK_GROUP_LABEL,
  CHECK_GROUP_ORDER,
  FOOTER_COLUMNS,
  RAIL_LEDE,
  SITE_NAV,
  TOOL_LINK_CARDS,
  TOOL_META_PROMISE,
  TOOL_PATH,
  areasInGroup,
} from "./brand";
import { FLAG_RULES, type FlagId } from "./flags";

/**
 * The rail's accordion is a promise about what the check covers, made before a
 * founder has answered anything. These assertions are what keep it true as the
 * rules table changes.
 */
describe("the check areas", () => {
  it("accounts for every rule in the table, exactly once", () => {
    const claimed = CHECK_AREAS.flatMap((area) => [...area.flagIds]);
    const declared = FLAG_RULES.map((rule) => rule.id as FlagId);

    expect(new Set(claimed).size).toBe(claimed.length);
    expect([...claimed].sort()).toEqual([...declared].sort());
  });

  it("names an area of the data room, never a question or a verdict", () => {
    for (const area of CHECK_AREAS) {
      expect(area.label).not.toContain("?");
      expect(area.label.toLowerCase()).not.toMatch(/score|rating|risk of|fail/);
      expect(area.flagIds.length).toBeGreaterThan(0);
    }
  });

  it("files every area under one of the three steps, and leaves none empty", () => {
    for (const area of CHECK_AREAS) {
      expect(CHECK_GROUP_ORDER).toContain(area.group);
    }
    for (const group of CHECK_GROUP_ORDER) {
      expect(areasInGroup(group).length).toBeGreaterThan(0);
      expect(CHECK_GROUP_LABEL[group]).not.toBe("");
    }
    // Every area is claimed by exactly one group, so the three accordion
    // sections between them still cover the whole check.
    const grouped = CHECK_GROUP_ORDER.flatMap((group) => areasInGroup(group));
    expect(grouped).toHaveLength(CHECK_AREAS.length);
  });

  /**
   * Two sentences say the count out loud — the rail's lede and the tally
   * strip's caption — and both read it from `CHECK_AREA_COUNT_WORD`. This is
   * what stops a tenth rule leaving them both claiming nine.
   */
  it("keeps the spelled-out count in step with the table", () => {
    const WORDS = [
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "eleven",
      "twelve",
    ];
    expect(CHECK_AREA_COUNT_WORD).toBe(WORDS[CHECK_AREAS.length]);
    expect(RAIL_LEDE.toLowerCase()).toContain(CHECK_AREA_COUNT_WORD);
  });
});

describe("the site chrome", () => {
  it("gives the nav four links and the footer a column for each", () => {
    expect(SITE_NAV).toHaveLength(4);
    const columns = FOOTER_COLUMNS.map((column) => column.heading);
    for (const link of SITE_NAV) {
      expect(columns).toContain(link.label);
    }
  });

  it("never leaves a link without a label or an href", () => {
    const every = [
      ...SITE_NAV,
      ...FOOTER_COLUMNS.flatMap((column) => [...column.links]),
    ];
    for (const link of every) {
      expect(link.label).not.toBe("");
      expect(link.href).not.toBe("");
    }
  });

  it("sends 'More tools' somewhere other than this tool", () => {
    const moreTools = TOOL_LINK_CARDS.find((card) => card.title === "More tools");
    expect(moreTools).toBeDefined();
    expect(moreTools?.href).not.toBe(TOOL_PATH);
  });

  /**
   * The 2026-09-05 copy audit withdrew every "no signup" claim: the results
   * carry an email gate, so a promise of no login on the way in is false by the
   * time the founder gets there.
   */
  it("does not promise there is no signup", () => {
    expect(TOOL_META_PROMISE.toLowerCase()).not.toMatch(
      /no login|no signup|no sign-up|no email|no gate/,
    );
    expect(TOOL_META_PROMISE.toLowerCase()).toContain("free");
  });
});
