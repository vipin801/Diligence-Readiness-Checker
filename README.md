# Diligence Readiness Check

A free diagnostic with a name and work-email gate for Indian startup founders. Eight multiple-choice
questions produce a risk register of the issues investors typically flag, the
estimated delay each issue can add at close, and who is best placed to fix it.

This is deliberately not a score. The primary output is an issue count and a
delay range in weeks.

> **DO NOT LAUNCH WITH THE CURRENT DELAY VALUES.** Every delay range in
> `src/lib/flags.ts` is a placeholder marked `// CALIBRATE`. Replace all of them
> with Incentiv's real advisory data before release; these estimates are the
> credibility of the tool.

## Current status

**Re-verified 2026-09-05: NOT LAUNCH-READY.** The current checkout has the intro,
four paired question screens, risk register, gate, contextual pitches, cross-links,
dark mode and social metadata. **The requested close timeline and radar/readiness
map are absent**, despite the re-verification brief assuming they had been built.
LOG.md's gate step explicitly records those visuals as outstanding.

Anonymous founders see the headline, severity/urgency explanation and up to two
findings, including the triggering answer, rationale, delay and fixer. All
remediation steps, remaining findings, pitches and cross-links are gated. Clean
results are fully free and retain an optional email form. Submitting either form
does not send a report; the gate only unlocks the page locally.

The production-browser pass completed all six fixtures. Build and lint passed;
all 438 tests passed. The median is **3.5 flags**, meeting the 2+ threshold: the
rules are about right by this fixture-count measure, but delay estimates are
still uncalibrated. Existing tests do not establish launch readiness.

Key blockers found or reconfirmed:

- All five flagged fixtures offer **zero concrete remediation steps before the
  gate**; the first two findings diagnose rather than explain what to do.
- Both email forms claim a report is queued without sending anything. Unlocked
  self-fix guidance still says "No email, no call, no gate."
- Copy overstates the answers: multiple instruments do not prove ownership is
  unmodelled; "not sure" does not prove a valuation report is absent. Some pitch
  language is accusatory, and single-result/one-week-fix wording overpromises.
- Gate errors leave focus on Submit without a live announcement. Unlock drops
  focus to the body; the next Tab skips to Review your answers.
- Both charts and their text equivalents are missing. Existing severity badges
  do have a shape and a written label; the headline's severity prose has words only.
- Five outbound URLs remain `#`; analytics remains a console stub and counts
  hidden pitches as shown. Delay calibration and CA/CS/legal review are outstanding.

See **Re-verification — 2026-09-05** in [LOG.md](LOG.md) for the six-scenario table,
free/gated judgments, audit evidence and the prioritized code/human blocker lists.

## Run locally

Requirements: Node.js 24 and npm.

```bash
npm install
npm run dev
```

Open <http://localhost:3000/tools/diligence-readiness>.

Useful commands:

```bash
npm run test   # Vitest suite
npm run lint   # ESLint
npm run build  # Production build and TypeScript verification
npm start      # Serve a completed production build
```

## How it is structured

- `src/lib/questions.ts` — the eight typed questions, input modes, and stable
  option ids.
- `src/lib/flags.ts` — declarative trigger rules, severity, delay placeholders,
  owner, and CTA mapping.
- `src/lib/evaluate.ts` — pure evaluation, severity ordering, urgency, and
  parallel-delay aggregation.
- `src/lib/results.ts` — framework-free results copy and view data.
- `src/lib/guidance.ts` — free remediation steps for each flag.
- `src/lib/gate.ts` — work-email validation, gate copy and local unlock flag.
- `src/lib/leads.ts` — swappable lead adapter; console-only, sends nothing today.
- `src/lib/pitch.ts` — pitch selection, placement, urgency variants, and
  cross-links.
- `src/lib/__fixtures__/scenarios.ts` — six calibration personas.
- `src/app/tools/diligence-readiness/` — the reducer-driven UI and results
  rendering.

The product has no application backend, authentication, database, AI call, upload
path or chart library. Next.js prerenders the routes; the configuration does not
yet select static export. Answers live in React state and disappear on reload.
Browser persistence stores the theme plus `incentiv-report-unlocked = "1"`.
The gate name/email are not persisted, but its console adapter logs them.
The report is in the DOM behind CSS blur and `inert`/`aria-hidden`; this is a
presentation gate, not access control. Production-browser observation found no
outbound data request or write request during either form submission.

## Re-verification evidence

Environment: production build at `http://localhost:3100/tools/diligence-readiness`,
Playwright 1.62.1 / headless Chromium. Browser plugin not available; the bundled
Playwright runtime was used without changing project dependencies.

All four question screens and the locked results/gate were captured in both
themes at 375, 768 and 1024px: **36 screenshots**, plus four mobile screenshots
covering validation errors and a single finding. Questions stack below 1024;
desktop columns align at 1024. No horizontal overflow or gate clipping was found.
Charts could not be captured because they do not exist.

Local evidence directory (outside the repository):
`C:/Users/Vipin/.codex/qa/diligence-reverification-2026-09-05/`.
`browser-results.json` contains actual free text, flags, focus walks, events and
layout measurements; `supplement.json` covers severity shapes, mobile errors and
unlock persistence. `data.cjs`, `browser.cjs` and `supplement.cjs` preserve the replay
scripts. Screenshots use `{theme}-{width}-questions-{1..4}.png`,
`{theme}-{width}-results.png` and `{theme}-{width}-gate.png`; the six
`contact-{theme}-{width}.jpg` files group the main evidence for review.

Limitations: Chromium only; no NVDA/VoiceOver listening test, Safari/Firefox,
mobile software keyboard, real email delivery, or legal validation. Results
headline focus and `aria-live="polite"` were verified in the DOM. Missing charts
and the recorded focus/copy/product issues prevent an overall QA pass.

## Change the questions

Edit `QUESTIONS` in `src/lib/questions.ts`.

Keep question and option ids stable once analytics or shared links depend on
them. The `Answers` type is derived from the question data, so TypeScript will
surface every downstream place that needs updating. If an option changes the
meaning of a trigger, update `src/lib/flags.ts` and the relevant fixtures and
tests in the same change.

Q2 is the only multi-select question. Its `Nothing` and `Not sure` choices are
exclusive in the UI. Q8 controls urgency but does not change which flags fire.

## Change the flag rules

Edit `FLAG_RULES` in `src/lib/flags.ts`. Each rule contains:

- a stable id and declarative trigger;
- a short title and investor rationale;
- `blocker`, `delay`, or `cleanup` severity;
- minimum and maximum delay weeks;
- primary fixer and CTA destination.

Preserve a `// CALIBRATE` comment immediately above every delay range until the
entire table has been replaced with approved Incentiv data. Press Note 3 uses
`null` bounds to represent timing controlled by the approval process.

Delay aggregation assumes fixes start together. The overall range is the
slowest active fix (`max(min)` through `max(max)`), not a sum. Changing that
model is a product decision and requires updating `src/lib/evaluate.ts`, its
tests, the fixture calibration report, and `LOG.md`.

When adding or renaming a flag, also update:

- `src/lib/guidance.ts` for its free remediation steps;
- `src/lib/pitch.ts` if it changes pitch or cross-link routing;
- `src/lib/results.test.ts`, `src/lib/pitch.test.ts`, and
  `src/lib/evaluate.test.ts`;
- `src/lib/__fixtures__/scenarios.ts` if calibration coverage changes.

## Pre-launch checklist

1. Resolve report delivery versus the no-backend constraint; make both forms and
   all confirmation copy truthful. Do not launch a promise to send an unsent report.
2. Decide the minimum ungated value and expose actionable guidance accordingly.
3. Implement/recover the missing timeline and radar with labels, shapes and text equivalents.
4. Correct unsupported, accusatory and outcome-promising copy; obtain CA/CS review.
5. Fix gate error/unlock focus and add browser regressions for the new surfaces.
6. Replace every delay placeholder using approved data and confirm the parallel model.
7. Supply and wire all five outbound URLs and the chosen analytics provider;
   exclude hidden pitches from impression counts.
8. Confirm hosting, `NEXT_PUBLIC_SITE_URL`, name, assets and design exceptions;
   apply the approved configuration and reconcile the source documents.
9. Re-run the fixture, free/gated, accessibility, responsive, build, lint and test
   checks after those changes. See LOG.md for ownership and priority details.
