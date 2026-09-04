# Diligence Readiness Check — Claude Code Build Prompts
*8 steps. Run one prompt per session/turn. Each step ends by updating LOG.md.*

**Before you start:**
1. Put `DESIGN.md`, `tool-spec-v1.md` and this file in the project root.
2. **Re-export DESIGN.md** — the current copy is UTF-16 and truncated at "## 2. Color Palette & Roles". Save as UTF-8 with all sections.
3. Confirm the cap-table product name: DESIGN.md says **Equity**, the website says **Tabulate**. All CTA copy depends on this.

---

## STEP 1 — Scaffold, LOG.md, CLAUDE.md

```
You are building the "Diligence Readiness Check" — a free, no-signup tool for
incentiv.finance/tools/. Incentiv is India private-markets infrastructure
(cap table/ESOP, fund ops, secondaries, advisory).

Read DESIGN.md and tool-spec-v1.md in the project root before doing anything.
tool-spec-v1.md is the source of truth for product behaviour. DESIGN.md is the
source of truth for visual design.

This step is SETUP ONLY. Do not build any tool features yet.

Do the following:

1. Scaffold a Next.js app (App Router, TypeScript, Tailwind, ESLint, src/ dir,
   @/* import alias) in the current directory. Use current stable versions.
   IF this directory is already an existing Next.js site, do NOT scaffold —
   detect that, tell me, and plan to add a route at /tools/diligence-readiness
   instead.

2. Create LOG.md at the project root with this exact structure:

   # Build Log — Diligence Readiness Check
   Running record for any AI agent or developer picking this project up.
   Read this file FIRST, before any other file.

   ## Project summary
   (one paragraph: what this tool is, who it's for, what it must do)

   ## Stack & key decisions
   (table: decision | choice | why)

   ## File map
   (table: path | purpose)

   ## Step log
   ### Step 1 — Scaffold & logging setup — <ISO date>
   **Done:** ...
   **Files created/changed:** ...
   **Decisions made:** ...
   **Known gaps / TODO:** ...
   **Next step:** ...

   ## Open questions for the human
   (numbered list — anything you had to guess)

3. Create CLAUDE.md at the project root containing: the project one-liner,
   a rule that LOG.md must be read at the start and updated at the end of
   every work session, the non-negotiable product constraints (no backend,
   no auth, no database, no AI calls, no cap-table upload in v1), the design
   constraints from DESIGN.md, and the commands to run dev/build/lint.

4. Create a .gitignore, initialise git, and make one initial commit.

5. Verify: `npm run build` succeeds and `npm run dev` serves a page.

Finally, fill in every section of LOG.md for Step 1 and list anything you had
to guess under "Open questions for the human".
```

---

## STEP 2 — Design system foundation + styleguide page

```
Read LOG.md first, then DESIGN.md.

This step builds the design foundation ONLY. Do not build tool features yet.

Implement Incentiv's design system as reusable tokens and primitives:

1. Fonts via next/font/google:
   - DM Serif Display — display and section headings. ALWAYS italic, tracking -0.03em.
   - Inter — all UI text and body copy. MUST set font-feature-settings:
     "cv02","cv03","cv04","cv11". This is essential to Incentiv's Inter variant.
   - IBM Plex Mono weight 300 — all statistics, week counts, financial figures.

2. CSS variables for both light and dark, wired into Tailwind:
   Light: page #FDFCF9, surface #F5F2ED, card #FFFFFF, border #E5E2DC
   Dark:  page #0A0A0A, card #0D0D0D, surface #1A1A1A
   Brand blue #3482ff (hsl(214 100% 60%)) — the ONLY chromatic colour in UI chrome
   Terracotta #D4715D — used only in the blue→terracotta gradient text treatment,
     reserved for high-impact display headlines
   Semantic green #22C55E for positive values; semantic red for errors
   Border radius: uniformly 4px everywhere. Intentionally flat.

3. Base primitives, styled to the system, no business logic:
   Button (primary / secondary / ghost), Card, Badge (for flag severity),
   ProgressBar, RadioOption, CheckboxOption, SectionLabel.

4. The signature `page-edge-lines` effect: animated blue scan lines along the
   outer container edges. Respect prefers-reduced-motion.

5. Build a /styleguide route rendering every token, font role, and primitive
   in both light and dark mode, so I can visually verify before any features
   are built. This route is temporary and will be deleted before launch —
   note that in LOG.md.

Constraints: warm borders only, never cool gray. Radius stays 4px — do not
round anything more. Serif headings are always italic.

Verify `npm run build` passes, then update LOG.md (append a Step 2 entry, and
update the File map and Stack & key decisions sections).
```

---

## STEP 3 — Content + rules engine (no UI)

```
Read LOG.md first, then tool-spec-v1.md sections 2, 3 and 4.

This step builds the BRAIN of the tool as pure, testable data and logic.
Build NO UI in this step.

1. src/lib/questions.ts — the 8 questions exactly as specified in
   tool-spec-v1.md section 2. Typed. Each question has: id, prompt text,
   optional helper text, input type (single-select or multi-select), and
   options with stable ids. Q2 is multi-select. Q8 is the urgency question.

2. src/lib/flags.ts — the flag rules table from tool-spec-v1.md section 3.
   Each flag: id, trigger condition, short title, the "why an investor asks
   this" explanation (2 sentences max), severity ('blocker'|'delay'|'cleanup'),
   delayWeeksMin, delayWeeksMax, fixedBy ('you'|'ca-cs'|'incentiv'), and which
   CTA it maps to.

   IMPORTANT: mark every delay range with a `// CALIBRATE` comment. These are
   placeholders to be replaced with Incentiv's real advisory data.

3. src/lib/evaluate.ts — a pure function:
   evaluate(answers) => {
     flags: Flag[]                    // sorted: blocker > delay > cleanup
     totalDelayWeeks: {min, max}      // NOT a naive sum — overlapping fixes
                                      // run in parallel; document the model used
     urgency: 'none'|'planning'|'near'|'live'   // derived from Q8
     selfFixable: Flag[]              // fixedBy === 'you' or 'ca-cs'
     needsSystem: Flag[]              // fixedBy === 'incentiv'
   }
   No side effects, no framework imports, no React.

4. Unit tests (vitest) covering: the clean-company path (0–1 flags), the
   worst case (all flags fire), each individual trigger in isolation, the
   multi-select logic on Q2, and delay aggregation.

5. Create src/lib/__fixtures__/scenarios.ts with 6 realistic founder
   personas as answer sets — used for calibration in Step 8.

Design rule to honour: this is a RISK REGISTER, not a score. There is no
0–100 anywhere in the codebase. The headline output is a count of issues and
a delay range in weeks.

Verify all tests pass, then update LOG.md (Step 3 entry + File map).
```

---

## STEP 4 — Question flow UI

```
Read LOG.md first, then tool-spec-v1.md section 2.

Build the question flow using the primitives from Step 2 and the data from
Step 3. Do not build the results screen yet — route to a placeholder.

Requirements:
- One question per screen. Target completion time: 90 seconds.
- Progress indicator showing position (e.g. "3 of 8"), using IBM Plex Mono
  for the numerals.
- Back navigation that preserves answers. Forward is disabled until the
  current question is answered.
- Answer state held in React state via useReducer. NO localStorage, NO backend,
  NO URL persistence in v1.
- Single-select options advance automatically on click after a ~200ms beat.
  Multi-select (Q2) requires an explicit Continue button.
- Fully keyboard navigable: arrow keys move between options, Enter selects,
  Escape goes back. Visible focus states.
- A short intro screen before Q1: the tool name, the one-line promise from
  tool-spec-v1.md, "90 seconds, free, no signup", and a Start button.
- Mobile-first. Must work well on a 375px viewport.

Copy tone: plain, calm, non-alarming. Never accusatory. This is a diagnostic,
not an audit.

Verify the full flow is clickable start to finish and `npm run build` passes,
then update LOG.md.
```

---

## STEP 5 — Results screen

```
Read LOG.md first, then tool-spec-v1.md section 4.

Build the results screen. Do NOT build the Tabulate pitch or CTAs yet —
that is Step 6. Leave a clearly marked placeholder where they go.

Structure, in this order:

1. Headline — the single most important element on the page:
     "4 issues found · estimated 5–9 weeks of delay at close"
   Numerals in IBM Plex Mono. Heading in DM Serif Display italic. Consider
   the blue→terracotta gradient text treatment here — this is a high-impact
   display moment and one of the few places it is warranted.
   Subline: "Based on how diligence typically runs for Indian companies at
   your stage."

2. Flag cards, ordered by severity (blockers first). Each card shows:
   the flag title · the "why an investor asks this" line · a severity badge ·
   the delay range in weeks (Plex Mono) · who fixes it.

3. The split section — the hinge of the entire page:
     "2 of these you can fix yourself this week." + genuinely useful,
     specific, ungated guidance for each self-fixable flag.
     "2 of these need a system." + the Step 6 placeholder.

4. A zero-flag state: congratulatory but not smug, and still offers a next
   step. A one-flag state that doesn't feel anticlimactic.

Rules:
- Never display a 0–100 score anywhere.
- Never write "you are non-compliant". Always "investors typically flag this".
- Every line of output must trace to something the founder actually answered.

Verify against all 6 fixture scenarios from Step 3, then update LOG.md.
```

---

## STEP 6 — The pitch, CTAs and cross-links

```
Read LOG.md first, then tool-spec-v1.md sections 1 and 4.

Build the conversion layer. This is the commercial point of the tool, so the
mechanic matters more than the styling.

1. The contextual pitch block. NOT a banner, NOT a sticky bar. It attaches to
   the specific flags it solves, inside the "needs a system" section.

   The highest-value case is when the founder answered: cap table in a
   spreadsheet/CA/not-sure (Q1) AND two or more instrument types (Q2).
   In that case render the cliffhanger:

     "You have {n} instrument types outstanding and your cap table lives in
      a spreadsheet. That means you don't currently know what the founders
      own post-conversion — and it's question one in every diligence call."
      → [See your real number]

   Write 3 other pitch variants for the other flag clusters (ESOP pool,
   ROC/filings, FEMA/valuation → route those to Advisory, not the cap table
   product). Each must reference the founder's actual answers.

2. Cross-links into Incentiv's existing tools, shown only when the relevant
   flag fired: dilution/instruments → Funding Round Simulator;
   ESOP exercise → ESOP Tax Calculator; valuation → Valuation Calculator.

3. "Email me this report" — optional capture, NO WALL. Results are fully
   visible without it. Form posts nowhere in v1; stub the handler and log
   the intent. Note this clearly in LOG.md as needing a real endpoint.

4. Urgency modulation from Q8: "term sheet in hand" gets the most direct
   CTA copy and moves the pitch higher; "not raising" gets the softest.

5. Analytics events (console.log stubs in v1, with a single swappable
   adapter): tool_started, question_answered, results_viewed,
   pitch_shown (with variant), pitch_clicked, email_submitted,
   crosslink_clicked.

Hard rule: the results page must give away at least two genuinely useful
self-fixable actions before any pitch appears. Give away two, sell the
other two.

Confirm the product name with me before writing final CTA copy — DESIGN.md
says "Equity", the website says "Tabulate". Use a single constant for it.

Update LOG.md.
```

---

## STEP 7 — Polish

```
Read LOG.md first, then DESIGN.md.

No new features. Polish only.

- Responsive pass: 375px, 768px, 1280px. The results page is the hard one.
- Dark mode across every screen, using the DESIGN.md dark tokens.
- Wire up the page-edge scan lines on the tool routes.
- Motion: question transitions and staggered flag-card entry. Everything
  must respect prefers-reduced-motion.
- Accessibility: semantic headings, fieldset/legend on question groups,
  aria-live on the results headline, visible focus rings, colour contrast
  checked in both themes. Severity must never be communicated by colour alone.
- Loading/empty/error states.
- Metadata: title, description, OG image for sharing. This tool is meant to
  be forwarded between founders, so the OG card matters.
- Delete the /styleguide route.

Update LOG.md.
```

---

## STEP 8 — Verification & calibration

```
Read LOG.md first.

Final verification pass. Report findings — do not silently fix things you
think are wrong without telling me.

1. Run all 6 fixture scenarios end to end. Print a table: scenario name,
   flags fired, delay range, pitch variant shown.

2. CALIBRATION CHECK — the most important item here. From tool-spec-v1.md:
   if the median user finishes with fewer than 2 flags, the tool is
   decoration. Most Indian early-stage companies genuinely have 3–5.
   Report the median across the fixtures and tell me plainly whether the
   rules are too soft, too harsh, or about right.

3. Copy audit: confirm no 0–100 score appears anywhere; no accusatory
   language; every results line traces to an actual answer; no line promises
   a specific outcome ("you will get funded", "this guarantees").

4. Confirm the non-negotiables hold: no backend, no auth, no database,
   no AI calls, no upload.

5. Run build, lint and tests. Fix anything failing.

6. Write README.md: what this is, how to run it, how to change the questions,
   how to change the flag rules, and a prominent note that all delay ranges
   are placeholders marked // CALIBRATE and MUST be replaced with Incentiv's
   real advisory data before launch.

7. Final LOG.md update: mark the MVP complete, list every known gap, and
   list every open question for the human in priority order.
```

---

## After the MVP

Not in scope for v1, in rough priority order:
1. Calibrate delay ranges against Incentiv's real book of 200+ companies.
2. Real endpoint for the email-report capture.
3. Stage 2: optional shareholding entry → precise post-conversion read → one-click import into the cap table product.
4. Port into the main site's tools page.
5. Term Sheet Decoder as tool #5.
