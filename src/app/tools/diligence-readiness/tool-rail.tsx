"use client";

import {
  RAIL_CROSS_SELL,
  RAIL_HEADING,
  RAIL_LEDE,
  TOOL_BREADCRUMB,
} from "@/lib/brand";

import type { QuestionScreen } from "./screens";

/**
 * The left rail — Step 15.
 *
 * It carries everything the old intro splash carried, which is why the splash
 * could go: the breadcrumb that says where you are, the question the tool
 * answers, the lede, the scope of the check, and the one cross-sell. A founder
 * now lands on question one with all of that already on screen, rather than on
 * a title card they have to dismiss first.
 *
 * The accordion is navigation, not decoration: the group matching the current
 * step is the only one expanded, and clicking any group moves the tool to it.
 * Answers persist across the jump, so it is safe to move backwards or forwards.
 *
 * Below 1024px the rail stacks above the tool column and the accordion is
 * dropped entirely — the step tabs already carry the same three groups there,
 * and two navigations for three steps on a 375px screen is one too many.
 */
export function ToolRail({
  screens,
  currentIndex,
  onJump,
}: {
  screens: readonly QuestionScreen[];
  currentIndex: number;
  onJump: (index: number) => void;
}) {
  return (
    <div className="tool-rail">
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <ol className="breadcrumb__list">
          {TOOL_BREADCRUMB.map((crumb, index) => {
            const isCurrent = index === TOOL_BREADCRUMB.length - 1;
            return (
              <li key={crumb.label} className="breadcrumb__item">
                {index > 0 ? (
                  <span aria-hidden="true" className="breadcrumb__sep">
                    /
                  </span>
                ) : null}
                {isCurrent ? (
                  <span
                    aria-current="page"
                    className="breadcrumb__current section-label"
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <a href={crumb.href} className="breadcrumb__link">
                    {crumb.label}
                  </a>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <h1 className="heading-h1 rail-heading text-foreground">
        {RAIL_HEADING.before}
        <span className="rail-highlight">{RAIL_HEADING.highlight}</span>
        {RAIL_HEADING.after}
      </h1>

      <p className="text-body-lg mt-6 text-muted-foreground">{RAIL_LEDE}</p>

      <hr className="rail-rule" />

      {/* The scope of the check AND the way between steps. Hidden below 1024px,
          where the step tabs are the navigation. */}
      <nav aria-label="Check groups" className="rail-groups">
        {screens.map((screen, index) => {
          const isCurrent = index === currentIndex;
          return (
            <div
              key={screen.id}
              className="rail-group"
              data-current={isCurrent || undefined}
            >
              <button
                type="button"
                className="rail-group__button"
                aria-expanded={isCurrent}
                aria-current={isCurrent ? "step" : undefined}
                onClick={() => onJump(index)}
              >
                <span aria-hidden="true" className="rail-group__dot" />
                <span className="mono-label rail-group__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="rail-group__label">{screen.label}</span>
              </button>

              {isCurrent ? (
                <ul className="rail-group__list">
                  {screen.areas.map((area) => (
                    <li key={area.label} className="rail-group__item">
                      {area.label}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          );
        })}
      </nav>

      <hr className="rail-rule" />

      {/* Quiet on purpose. See the note on RAIL_CROSS_SELL in brand.ts, and
          LOG.md open question 13. */}
      <div className="rail-cross-sell">
        <p className="mono-label">{RAIL_CROSS_SELL.kicker}</p>
        <h2 className="heading-sub mt-3 text-foreground">
          {RAIL_CROSS_SELL.heading}
        </h2>
        <p className="text-small mt-3 text-muted-foreground">
          {RAIL_CROSS_SELL.body}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={RAIL_CROSS_SELL.primary.href}
            className="btn btn-primary no-underline"
          >
            {RAIL_CROSS_SELL.primary.label}
          </a>
          <a
            href={RAIL_CROSS_SELL.secondary.href}
            className="btn btn-secondary no-underline"
          >
            {RAIL_CROSS_SELL.secondary.label}
          </a>
        </div>
      </div>
    </div>
  );
}
