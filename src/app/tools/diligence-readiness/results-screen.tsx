"use client";

import { Fragment, useEffect, useRef, useState } from "react";

import { Badge, Button, Card, SectionLabel } from "@/components/ui";
import { IncentivLogo } from "@/components/ui/incentiv-logo";
import { track } from "@/lib/analytics";
import type { Urgency } from "@/lib/evaluate";
import type { FlagId } from "@/lib/flags";
import { gateConfirmation, readStoredUnlock } from "@/lib/gate";
import type { PitchPlacement } from "@/lib/pitch";
import type { Answers } from "@/lib/questions";
import {
  buildResults,
  headlineText,
  type GuidanceView,
  type ResultFlagView,
  type SplitColumn,
} from "@/lib/results";
import { SUMMARY_COPY } from "@/lib/summary";

import { CrossLinks, EmailCapture, PitchBlock, ReportGate } from "./conversion";
import { ArrowLeftIcon } from "./icons";
import { HeadlineLine } from "./segments";
import {
  BenchmarkBar,
  CloseTimeline,
  ReadinessMap,
  StatTiles,
  TallyStrip,
} from "./summary-visuals";

/**
 * The risk register — tool-spec-v1.md §4.
 *
 * Every string on this screen comes from `buildResults()`; nothing user-visible
 * is written here. That is deliberate: the copy rules (no score, "investors
 * typically flag this" rather than an accusation, every line tracing to an
 * answer the founder gave, and no pitch before two free fixes) are enforced by
 * tests against those pure functions, and they cannot be if the component
 * invents sentences of its own.
 *
 * Sections, in order: the two stat tiles · the summary band · every finding ·
 * the gate · the split with its pitches · cross-links.
 *
 * **The gate splits the page by content type, not by count** (Step 14). Free is
 * the whole DIAGNOSIS — the stat tiles, all three visuals, and every finding
 * with its severity, weeks, owner and "why an investor asks" line. Gated is the
 * REMEDY: the step-by-step guidance, the "needs a system" column with its CTAs,
 * and the cross-links.
 *
 * The old rule kept the first two findings free and gated the rest, which broke
 * at low flag counts: a two-flag result showed both findings in full and then
 * asked for an email to unlock two issues already on the screen. Under this
 * rule there is always something behind the gate, at every count — and a
 * founder is never shown a blur over their own problems.
 *
 * A clean result has no remedy to gate, so it is never gated at all and keeps
 * the optional, wall-free email capture instead.
 */

/** The mono-label role, muted. The blue `.section-label` is reserved for the
 *  heading of a major section; repeated in-card labels use this twin. */
const MICRO_LABEL = "mono-label";

function FlagCard({
  flag,
  prominent,
  index,
}: {
  flag: ResultFlagView;
  prominent: boolean;
  index: number;
}) {
  return (
    <Card
      className="animate-rise-stagger p-6"
      style={{ "--stagger": index } as React.CSSProperties}
    >
      <div className="flag-layout">
        <div className="min-w-0">
          {/* Provenance first: the flag exists because of this answer. */}
          <p className={MICRO_LABEL}>You answered</p>
          <p className="text-body mt-1 text-foreground">
            &ldquo;{flag.answerEcho}&rdquo;
          </p>

          <h3
            className={`${prominent ? "heading-section" : "heading-sub"} mt-4 text-foreground`}
          >
            {flag.title}
          </h3>
          <p className="text-body mt-2 measure-copy text-muted-foreground">
            {flag.whyInvestorAsks}
          </p>
        </div>

        {/* Below 640px the rail is a row under the finding rather than a third
            stacked block — seven flags stacked three-deep each is a very long
            page on a 375px screen. */}
        <div className="flag-details">
          <Badge tone={flag.severity}>{flag.severityLabel}</Badge>

          <div className="mt-4 grid grid-cols-2 items-start gap-6">
            <div className="min-w-0">
              <p
                className={`${prominent ? "number-large" : "number-display"} text-foreground`}
              >
                {flag.delayValue}
              </p>
              <p className="text-body mt-1 text-muted-foreground">
                {flag.delayUnit}
              </p>
            </div>

            <div className="min-w-0">
              <p className={MICRO_LABEL}>Fixed by</p>
              <div className="text-body mt-2 text-foreground">
                {flag.fixedBy === "incentiv" ? (
                  <IncentivLogo />
                ) : (
                  flag.fixedByLabel
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function GuidanceCard({ item, index }: { item: GuidanceView; index: number }) {
  return (
    <Card
      className="animate-rise-stagger p-6"
      style={{ "--stagger": index } as React.CSSProperties}
    >
      <p className={MICRO_LABEL}>{item.flagTitle}</p>
      <h4 className="heading-sub mt-2 text-foreground">{item.actionHeadline}</h4>

      {item.systemReason ? (
        <div className="mt-4 rounded-[var(--radius)] bg-surface p-4">
          <p className={MICRO_LABEL}>Why doing it once does not hold</p>
          <p className="text-body mt-2 text-muted-foreground">
            {item.systemReason}
          </p>
        </div>
      ) : null}

      <ol className="mt-6 grid gap-4">
        {item.steps.map((step, index) => (
          <li key={index} className="flex gap-4">
            <span
              aria-hidden="true"
              className="mono-label mt-1 shrink-0 text-primary-text"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-body measure-copy text-muted-foreground">
              {step}
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
}

/**
 * Renders one side of the split. Pitches are interleaved between the guidance
 * cards at the anchors `buildConversion()` chose — which is what makes them
 * contextual rather than a banner. This component never decides placement.
 */
function SplitBlock({
  column,
  placements = [],
  urgency,
}: {
  column: SplitColumn;
  placements?: readonly PitchPlacement[];
  urgency: Urgency;
}) {
  const hoisted = placements.filter((placement) => placement.anchor === "top");
  const anchored = new Map<FlagId, PitchPlacement[]>();
  for (const placement of placements) {
    if (placement.anchor === "top") continue;
    const existing = anchored.get(placement.anchor.afterFlagId) ?? [];
    existing.push(placement);
    anchored.set(placement.anchor.afterFlagId, existing);
  }

  return (
    <div className="measure-card">
      <h3 className="heading-section text-foreground">
        <HeadlineLine segments={column.heading} />
      </h3>
      <p className="text-body mt-3 measure-copy text-muted-foreground">
        {column.intro}
      </p>

      <div className="mt-6 grid gap-4">
        {hoisted.map((placement) => (
          <PitchBlock
            key={placement.pitch.variant}
            pitch={placement.pitch}
            urgency={urgency}
          />
        ))}

        {column.items.map((item, index) => (
          <Fragment key={item.id}>
            <GuidanceCard item={item} index={index} />
            {(anchored.get(item.id) ?? []).map((placement) => (
              <PitchBlock
                key={placement.pitch.variant}
                pitch={placement.pitch}
                urgency={urgency}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export function ResultsScreen({
  answers,
  onReviewAnswers,
  onRestart,
}: {
  answers: Answers;
  onReviewAnswers: () => void;
  onRestart: () => void;
}) {
  const results = buildResults(answers);
  const isClean = results.state === "clean";
  const { conversion } = results;

  // Read once, on the client, during the first render of this screen. The
  // results screen only ever mounts after eight answers, so it is never part of
  // a server-rendered payload and there is no hydration state to disagree with.
  const [unlocked, setUnlocked] = useState(readStoredUnlock);
  const [confirmedEmail, setConfirmedEmail] = useState<string | null>(null);

  // What is actually behind the blur: one remedy per flag, split across the two
  // columns. Never zero on a flagged result, which is the whole point of the
  // content-type split — see the note at the top of this file.
  const gatedGuidanceCount =
    (results.selfFix?.items.length ?? 0) +
    (results.needsSystem?.items.length ?? 0);
  const locked = !isClean && !unlocked;

  const flagIds = results.flags.map((flag) => flag.id);
  const blockerCount = results.flags.filter(
    (flag) => flag.severity === "blocker",
  ).length;
  const flagKey = flagIds.join(",");
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headlineRef.current?.focus();
  }, []);

  useEffect(() => {
    track({
      name: "results_viewed",
      issueCount: results.issueCount,
      blockerCount,
      flagIds: flagKey === "" ? [] : (flagKey.split(",") as FlagId[]),
      delayWeeksMin: results.totalDelayWeeks.min,
      delayWeeksMax: results.totalDelayWeeks.max,
      urgency: results.urgency,
    });
  }, [
    flagKey,
    blockerCount,
    results.issueCount,
    results.totalDelayWeeks.min,
    results.totalDelayWeeks.max,
    results.urgency,
  ]);

  return (
    <main className="results-page relative flex flex-1 flex-col">
      <div
        aria-hidden="true"
        className="bg-grid bg-grid-fade pointer-events-none absolute inset-x-0 top-0 h-56 opacity-25 md:h-80"
      />

      {/* 1 — The headline, and it is two numbers rather than a sentence.
              Step 14 PART B: a count and a time cost are a KPI row, and setting
              them inside one serif sentence made a paragraph pretending to be a
              stat, with a bad rag over two lines. The sentence survives as the
              heading's accessible name, so nothing is lost to a screen reader. */}
      <section className="section-gap section-gap-lead relative z-10">
        <div className="container-tool">
          <div className="results-grid">
            <div
              className="animate-rise"
              // The register replaces the question screen in place, with no
              // navigation, so the outcome is announced rather than silently
              // swapped in. Focus lands on the headline for the same reason.
              role="status"
              aria-live="polite"
            >
              <SectionLabel>
                {isClean ? "Your result" : "Your risk register"}
              </SectionLabel>
              <h1
                ref={headlineRef}
                tabIndex={-1}
                aria-label={headlineText(results.headline)}
                className="mt-6 outline-none"
              >
                <StatTiles tiles={results.summary.stats} />
              </h1>
              {/* Step 15 — the tally strip. The two tiles above say how much
                  and how long; this says how it is distributed across the nine
                  areas the check covers, which is the shape of the problem
                  rather than its size. Not a score: the three cells partition
                  one stated total, and the caption names it. */}
              <div className="mt-8">
                <TallyStrip tally={results.summary.tally} />
              </div>

              <p className="text-small measure-copy mt-6 text-muted-foreground">
                {results.subline}
              </p>

              <div className="measure-copy mt-6 grid gap-3 border-l-2 border-primary/25 pl-4">
                {results.severityLine ? (
                  <p className="text-body text-foreground">
                    {results.severityLine}
                  </p>
                ) : null}
                {results.soloEmphasis ? (
                  <p className="text-body text-muted-foreground">
                    {results.soloEmphasis}
                  </p>
                ) : null}
                <p className="text-body text-muted-foreground">
                  {results.urgencyLine}
                </p>
              </div>
            </div>

            {/* The readiness map is the summary's spatial artefact, so it uses
                the otherwise empty upper-right column instead of making the
                reader travel through a second section before seeing it. */}
            <aside className="results-aside animate-rise" aria-labelledby="readiness-heading">
              <h2 id="readiness-heading" className="heading-sub text-foreground">
                {SUMMARY_COPY.readinessTitle}
              </h2>
              <div className="mt-4">
                <ReadinessMap readiness={results.summary.readiness} />
              </div>
            </aside>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* 2 — The summary band — Step 14 PART C. Free in every state, including
              the clean one, where a full hexagon and "you have 0" are the
              strongest thing the page can say.

              This is the one place on the page that carries the blue →
              terracotta gradient. It is on the heading rather than on the
              figures above it, which were losing the fight for attention. */}
      <section className="section-gap relative z-10">
        <div className="container-tool">
          <SectionLabel>{SUMMARY_COPY.sectionLabel}</SectionLabel>
          <h2 className="heading-section text-gradient mt-4 text-balance">
            {SUMMARY_COPY.heading}
          </h2>

          <div className="results-grid mt-8">
            <div>
              <h3 className="heading-sub text-foreground">
                {SUMMARY_COPY.timelineTitle}
              </h3>
              <div className="mt-6">
                <CloseTimeline timeline={results.summary.timeline} />
              </div>
            </div>

            <div className="results-aside">
              <h3 className="heading-sub text-foreground">
                {SUMMARY_COPY.benchmarkTitle}
              </h3>
              <div className="mt-6">
                <BenchmarkBar benchmark={results.summary.benchmark} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {isClean && results.clean ? (
        <>
          <hr className="section-divider" />

          <section className="section-gap relative z-10">
            <div className="container-tool">
              <div>
                <SectionLabel>What you told us</SectionLabel>
                <h2 className="heading-section mt-4 text-foreground">
                  Eight answers, nothing that typically stalls a round
                </h2>

                <Card className="measure-card mt-6 p-6">
                  <ul className="grid gap-3">
                    {results.clean.confirmations.map((line) => (
                      <li key={line} className="flex gap-4">
                        <span
                          aria-hidden="true"
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-success"
                        />
                        <span className="text-body measure-copy text-muted-foreground">
                          {line}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <p className="text-body mt-6 measure-copy text-muted-foreground">
                  {results.clean.caveat}
                </p>
              </div>
            </div>
          </section>

          <hr className="section-divider" />

          <section className="section-gap relative z-10">
            <div className="container-tool">
              <div>
                <SectionLabel>Next step</SectionLabel>
                <h2 className="heading-section mt-4 text-foreground">
                  {results.clean.nextStepHeading}
                </h2>

                <ol className="mt-6 grid gap-4">
                  {results.clean.nextSteps.map((step, index) => (
                    <li key={step} className="flex gap-4">
                      <span
                        aria-hidden="true"
                        className="mono-label mt-1 shrink-0 text-primary-text"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-body measure-copy text-muted-foreground">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>

                {conversion.cleanStatePitch ? (
                  <div className="mt-8">
                    <PitchBlock
                      pitch={conversion.cleanStatePitch}
                      urgency={results.urgency}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          <hr className="section-divider" />

          {/* 3 — The findings, ordered by severity, blockers first — and ALL of
                  them, complete, free. This is the diagnosis, and a founder is
                  never asked to pay for a look at their own problems. */}
          <section className="section-gap relative z-10">
            <div className="container-tool">
              <div>
                <SectionLabel>The register</SectionLabel>
                <h2 className="heading-section mt-4 text-foreground">
                  What investors typically flag here
                </h2>

                <div className="mt-6 grid gap-4 sm:mt-8">
                  {results.flags.map((flag, index) => (
                    <FlagCard
                      key={flag.id}
                      flag={flag}
                      index={index}
                      prominent={results.state === "single"}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {confirmedEmail ? (
            <section className="relative z-10 pb-8">
              <div className="container-tool">
                <div
                  role="status"
                  className="measure-card rounded-[var(--radius)] border border-success/40 bg-surface p-6"
                >
                  <p className="text-body text-foreground">
                    {gateConfirmation(confirmedEmail)}
                  </p>
                  {process.env.NODE_ENV !== "production" ? (
                    <p className="text-body mt-2 text-muted-foreground">
                      Development note: no endpoint is wired up yet, so nothing
                      was actually sent. The lead was logged to the console.
                    </p>
                  ) : null}
                </div>
              </div>
            </section>
          ) : null}

          {/* 4 — The gated region, and it holds the REMEDY: both halves of the
                  split with their CTAs, and the cross-links. Never a finding.
                  The content is real and rendered; the blur is a filter over
                  it, never a placeholder. */}
          <div className="gate-region" data-locked={locked}>
            <div
              className="gate-content"
              data-locked={locked}
              aria-hidden={locked || undefined}
              inert={locked || undefined}
            >
              <hr className="section-divider" />

              {/* The split. The hinge of the page, and where the pitch lives. */}
              <section className="section-gap relative z-10">
                <div className="container-tool">
                  <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                    <div className="lg:col-span-2">
                      <SectionLabel>The split</SectionLabel>
                      <h2 className="heading-section mt-4 text-foreground">
                        What you can close yourself, and what needs a system
                      </h2>
                    </div>

                    {results.selfFix ? (
                      <SplitBlock
                        column={results.selfFix}
                        urgency={results.urgency}
                      />
                    ) : null}

                    {results.needsSystem ? (
                      <SplitBlock
                        column={results.needsSystem}
                        placements={conversion.placements}
                        urgency={results.urgency}
                      />
                    ) : null}
                  </div>
                </div>
              </section>

              {conversion.crossLinks.length > 0 ? (
                <>
                  <hr className="section-divider" />
                  <section className="section-gap relative z-10">
                    <div className="container-tool">
                      <div>
                        <CrossLinks links={conversion.crossLinks} />
                      </div>
                    </div>
                  </section>
                </>
              ) : null}
            </div>

            {locked ? (
              <>
                {/* Sibling of the blurred content, not a child — a scrim that
                    was itself blurred would defeat the point. */}
                <div aria-hidden="true" className="gate-scrim" />
                <div aria-hidden="true" className="gate-fade" />
                <div className="gate-card-slot z-20">
                  <div className="container-tool flex justify-center">
                    <ReportGate
                      issueCount={results.issueCount}
                      gatedGuidanceCount={gatedGuidanceCount}
                      urgency={results.urgency}
                      flagIds={results.flags.map((flag) => flag.id)}
                      delayWeeksMin={results.totalDelayWeeks.min}
                      delayWeeksMax={results.totalDelayWeeks.max}
                      onUnlock={(email) => {
                        setUnlocked(true);
                        setConfirmedEmail(email);
                      }}
                    />
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </>
      )}

      <hr className="section-divider" />

      {/* 5 — The way out. In the clean state this is also where the optional,
              ungated email capture lives: there is nothing to gate, so the form
              that promises "no wall" is only ever shown where that is true. */}
      <section className="section-gap section-gap-tail relative z-10">
        <div className="container-tool">
          <div className={isClean ? "grid gap-6" : "results-actions"}>
            {isClean ? (
              <EmailCapture
                copy={conversion.emailCapture}
                issueCount={results.issueCount}
                urgency={results.urgency}
              />
            ) : null}

            <div
              className={`flex flex-wrap items-center gap-4 ${isClean ? "mt-12" : ""}`}
            >
              <Button variant="secondary" onClick={onReviewAnswers}>
                <ArrowLeftIcon />
                Change an answer
              </Button>
              <Button variant="ghost" onClick={onRestart}>
                Start over
              </Button>
            </div>

            <p className="text-small measure-copy text-muted-foreground">
              This check is free, and you can run it again whenever something on
              your cap table changes.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
