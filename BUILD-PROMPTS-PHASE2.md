# Phase 2 — Layout, Visuals & Gated Report
*Steps 9–12. Same protocol: read LOG.md first, update it last.*

## Design decisions made before these prompts

**Severity palette — validated, not guessed.** Run through a contrast + colour-vision
separation check. Dark-mode steps are *selected*, not a flip of light mode.

| Severity | Light | Dark | Glyph |
|---|---|---|---|
| Blocker | `#DC2626` | `#DC2626` | ▲ |
| Delay | `#CA8A04` | `#B8860B` | ● |
| Cleanup | warm gray (no chroma — this IS the low-salience state) | same | ○ |
| Clear | `#16A34A` | `#15803D` | ✓ |

Amber↔green fails colour-vision separation at the strict threshold, which is
unavoidable for a red/amber/green convention. **The mitigation is mandatory:
severity is NEVER communicated by colour alone — every severity always carries
its glyph AND its word.** Amber in light mode is also below 3:1 on white, so its
label must always be visible text, never a bare colour swatch.

**Charts: inline SVG only. Do not install a chart library.** A radar and a timeline
are ~150 lines of SVG. Recharts/Chart.js would add a large dependency, ignore the
DM Serif / Plex Mono type system, and theme badly. Not worth it.

**Honest note on the radar.** Radar area scales with the *square* of the value, so
it exaggerates differences, and the axis order changes the perceived shape. It is a
**signature graphic**, not a measurement instrument — it must never be the only
place a value appears. The flag list stays the source of truth.

---

## STEP 9 — Layout & alignment system

```
Read LOG.md first, then DESIGN.md.

You are acting as the UI designer on this. No new features in this step —
this is a layout and alignment pass. The current build is left-heavy,
inconsistently inset, and the header does not align with the content below it.

1. ONE CONTAINER, ONE LEFT RAIL.
   Define a single layout container used by the header, every screen body, and
   the footer: max-width 1120px, centred, horizontal padding 24px mobile /
   40px desktop. Every element on every screen shares the same left and right
   edge. The header wordmark must sit exactly on the content's left rail —
   right now it does not, and on the question screen it is clipped at the
   viewport edge. Find and fix the cause (likely a container wider than the
   viewport).

2. MEASURE CAPS. Nothing should stretch the full container just because it can.
   - Body and subheading copy: max-width 64ch
   - Answer option rows: max-width 560px
   Full-bleed 1000px+ rows holding three words of text look broken.

3. SPACING SCALE. 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96. Every margin and
   padding in the app snaps to it. No arbitrary values.

4. TYPE SCALE, applied consistently:
   display 56/60 · h1 40/44 · h2 28/34 · h3 20/28 · body 16/26 ·
   small 14/22 · mono-label 12/16 tracking 0.08em uppercase
   DM Serif Display italic for display/h1/h2. Inter for h3 and below.
   IBM Plex Mono 300 for all numerals, week counts and eyebrow labels.

5. HEADER AND SUBHEADING EACH ON ONE LINE.
   The intro subheading currently wraps to three lines. Rewrite it to fit a
   single line at >=1024px, wrapping to a maximum of two on mobile:

     H1:  Diligence Readiness Check
     Sub: See what investors will flag in your data room — before they do.
     Mono: 8 questions · 90 seconds · nothing leaves your browser

   Apply the same rule everywhere: no heading or subheading may exceed one
   line on desktop. If copy does not fit, shorten the copy — do not shrink
   the type.

6. VERTICAL RHYTHM. Give the intro screen a real optical centre. Right now
   content floats in the upper-left with a large dead zone to the right.
   Either centre the column, or commit to a two-column layout with something
   deliberate on the right. Pick one and apply it consistently.

Verify at 375px, 768px, 1280px and 1600px. Screenshot each and check the left
rail is identical on every screen. Then update LOG.md.
```

---

## STEP 10 — Two questions per screen

```
Read LOG.md first.

Change the flow from 8 screens to 4 screens of 2 questions each. Pair them
thematically and give each screen a section label:

  Screen 1 — "Ownership record"     : Q1 cap table location + Q2 instruments
  Screen 2 — "Equity structure"     : Q3 ESOP pool + Q4 founder vesting
  Screen 3 — "Compliance"           : Q5 ROC filings + Q6 foreign shareholders
  Screen 4 — "Valuation & timing"   : Q7 valuation report + Q8 when raising

Layout:
- >=1024px: two equal columns, one question per column, aligned tops, a hairline
  warm-border divider between them.
- <1024px: stacked, 48px gap.
- Section label in mono uppercase above the pair. Progress becomes "1 of 4".
- The question text drops from the current display size to h2 — two of them on
  one screen at display size will overwhelm the page.

Behaviour changes:
- Auto-advance now fires only when BOTH questions on the screen are answered,
  after a ~300ms beat. Keep a visible Continue button as the fallback and the
  only path when Q2's multi-select is involved.
- Continue stays disabled until both are answered, with a quiet inline hint
  naming which one is still open.
- Keyboard: Tab moves between the two question groups, arrows move within a
  group, Enter selects, Esc goes back a screen.

DO NOT change the data layer. questions.ts, flags.ts and evaluate.ts stay
exactly as they are — there are still 8 questions and the engine still takes
all 8 answers. This step only changes how they are GROUPED on screen. The
Step 3 unit tests and the 6 fixture scenarios must still pass untouched. If
you find yourself editing evaluate.ts, stop and tell me why.

Update LOG.md.
```

---

## STEP 11 — Results redesign + the visuals

```
Read LOG.md first.

Acting as UI designer. The current results page is far too long and reads as an
undifferentiated stack of fat cards in small type. Restructure it around a
visual summary, then compress everything below.

PART A — THE SUMMARY BLOCK (new, above the fold, the thing people screenshot)

A three-part band, sharing the container rail:

1. Hero figure — the issue count and delay range. Numerals in Plex Mono at
   display size. This already exists; make it the visual anchor, not a
   paragraph of serif text.

2. THE CLOSE TIMELINE (build this first — it is the honest, on-thesis visual).
   A horizontal rail:
   - Left anchor "Today", a labelled marker for "Your target close", then a
     band extending right representing the delay.
   - Each contributing flag is a segment of the band, width proportional to its
     weeks, ordered blocker → delay → cleanup, coloured by the severity palette
     above, with a 2px surface-coloured gap between segments.
   - The min–max range shown as a lighter tail on the band's right end.
   - Segments >=48px wide get a direct label inside; narrower ones label on hover.
   - All week numbers in Plex Mono.
   - Hover tooltip per segment: flag title, weeks, who fixes it.

3. THE READINESS MAP (the radar shape).
   Six axes: Cap table · Instruments · ESOP · Vesting · Filings · Valuation.
   - Coarse 0–3 scale per axis derived from the flags that fired in that area.
     Do NOT invent a continuous score.
   - Polygon stroke 2px in brand blue #3482ff, fill same blue at 10% opacity.
   - Grid rings and spokes in the warm border colour, 1px, recessive.
   - Vertex dots >=8px. A vertex at blocker level also carries the ▲ glyph.
   - Every axis label always visible, in Inter small, with its status word
     beneath in mono — the shape alone never carries the meaning.
   - Inline SVG. Do NOT install a chart library.

   Read the "honest note on the radar" in BUILD-PROMPTS-PHASE2.md before
   building this.

PART B — COMPRESS EVERYTHING BELOW

- Flags become dense rows, not fat cards: severity glyph + title + weeks
  (Plex Mono) + who fixes it, on one line. Click to expand the "why an
  investor asks this" detail. Default all collapsed except the top two.
- The self-fix guidance is currently five bullet paragraphs per item. Cut each
  to a single actionable line, expandable for the detail. It is a results page,
  not a document.
- Real section breaks: full-width hairline rules, mono section labels, 64–96px
  between blocks.
- Target: the ungated portion fits roughly two screens, not eight.

Every number that appears in a visual must also appear as text somewhere.
Verify against all 6 fixture scenarios, including the zero-flag state, and
screenshot the results page in both themes before you finish. Update LOG.md.
```

---

## STEP 12 — The blur gate

```
Read LOG.md first.

Add a partial gate to the results page: part of the report is visible, the rest
is blurred behind a name + work-email capture.

WHAT STAYS FREE (never blurred — this is the proof the tool works):
- The hero figure, the close timeline, the readiness map
- The first TWO flag rows, complete, including their detail
- Everything above must be screenshot-worthy on its own

WHAT IS BLURRED:
- The remaining flag rows
- All self-fix guidance
- The entire "needs a system" section and its CTAs
- The cross-links to other Incentiv tools

BLUR TREATMENT — the content behind must be REAL content, blurred. Do not
substitute placeholder text; people can tell, and it destroys trust.
- filter: blur(6px), opacity .55, user-select: none, pointer-events: none,
  aria-hidden="true", and remove it from the tab order
- A gradient scrim fading from transparent into the surface colour at the top
  of the blurred region, so the blur begins softly rather than at a hard edge
- prefers-reduced-motion: no animated reveal, just a state change

THE GATE CARD:
- Sits INLINE, overlapping the top of the blurred region — not a modal, not a
  full-screen takeover. The blur must be visible behind and below it.
- Exactly two fields: Name, Work email. Nothing else. Every extra field costs
  conversion and you do not need company or phone.
- Heading: "Unlock the full register"
- Body, with the real count interpolated: "All {n} issues, the fixes you can
  make yourself this week, and what each one costs you at close."
- Trust line under the button: "One email with your report. Nothing else."
- Button: "Send me the full report"

WORK EMAIL VALIDATION:
Reject free providers inline, friendly not scolding: gmail, googlemail, yahoo,
ymail, outlook, hotmail, live, msn, icloud, me.com, aol, proton, protonmail,
zoho, rediffmail, yandex, mail.com. Include rediffmail — this is India.
Message: "Please use your work email — that's where the report goes."

AFTER SUBMIT:
- Un-blur with a 400ms ease, respecting prefers-reduced-motion
- Persist unlocked state in localStorage so a refresh does not re-gate. Wrap
  every localStorage access in try/catch and render correctly when it throws
- The submit handler posts nowhere in v1 — stub it behind a single swappable
  adapter and log clearly in LOG.md that it needs a real endpoint
- Fire analytics: gate_shown, gate_submitted, gate_invalid_email

TWO THINGS TO FIX WHILE YOU ARE HERE:
1. The intro screen currently promises "Free, no signup" and the mono line says
   "nothing leaves your browser". Both are now false. Change to:
   "Free · full report by email" and drop the browser claim. A broken promise
   at the gate costs more than the gate earns.
2. Note in LOG.md that a client-side blur is inspectable in devtools. That is
   an acceptable trade for a lead magnet at v1 — but record it as a known
   limitation, with the fix being to serve the gated content from an endpoint
   after submit.

Update LOG.md.
```

---

## STEP 13 — Pre-launch pass

```
Read LOG.md first.

Steps 9–12 rewrote the layout, the question flow, the results page, and added
a gate. The Step 8 verification ran BEFORE all of that, so it is stale.
This is the re-verification pass. Report findings — do not silently "fix"
things you think are wrong without telling me.

1. FIXTURES. Run all 6 scenarios end to end. Print a table: scenario, flags
   fired, delay range, radar shape summary, which flags land free vs gated,
   pitch variant shown.

2. THE FREE/GATED SPLIT — the new calibration question, and the important one.
   For each scenario, report what a founder sees BEFORE submitting the gate.
   Judge it against two failure modes and tell me which way each scenario errs:
     - Gives away too much → nothing left worth an email
     - Gives away too little → reads as bait, no reason to trust the ask
   Flag any scenario where the free portion contains zero actionable content.

3. Re-run the Step 8 calibration check: median flags across the fixtures.
   Still must be 2+. Say plainly whether the rules are too soft or about right.

4. COPY AUDIT. Confirm: no 0–100 score anywhere; no accusatory language;
   every results line traces to an actual answer; no promise of an outcome;
   and the intro no longer claims "free, no signup" or "nothing leaves your
   browser" now that the gate exists.

5. ACCESSIBILITY on the new surfaces specifically: severity never conveyed by
   colour alone (glyph AND word present everywhere, including inside both
   charts); blurred region is aria-hidden and out of the tab order; focus moves
   sensibly to the gate; the results headline announces via aria-live; both
   charts have a text equivalent.

6. RESPONSIVE on the new surfaces: the 2-up question screens at 375/768/1024,
   the timeline and radar at small widths, and the gate card overlapping the
   blur on mobile. Screenshot each in both themes.

7. Confirm the non-negotiables still hold: no backend, no auth, no database,
   no AI calls, no upload, no chart library.

8. Run build, lint and tests. Fix what fails.

9. Update README.md and LOG.md. In LOG.md, list every remaining blocker to
   launch in priority order, separating "code can fix" from "needs a human
   decision".
```

---

## After Step 13 — not code any more

1. **Calibrate the delay ranges** with the advisory team. Every one is still a
   `// CALIBRATE` placeholder. This is the credibility of the entire tool and
   the only part of it nobody can copy.
2. **Real endpoint for the gate**, and decide where leads land.
3. **Settle Equity vs Tabulate** in the CTA copy.
4. **Port into the tools page.**
5. **Then measure:** completion rate, median flags, gate submit rate, and what
   share arrive with "term sheet in hand".

---

## STEP 14 — Visual summary + gate logic fix

**Defects observed in the shipped build (Sept 5):**
1. Step 11's visuals were never built — no timeline, no readiness map, no summary band.
2. **The gate is broken for low-flag results.** A 2-flag result shows both flags in
   full, then asks for an email to "unlock all 2 issues" — which are already on
   screen. The free/gated split cannot be a fixed flag count.
3. Hero headline wraps badly: one long sentence mixing serif italic, gradient and
   mono numerals across two lines with a poor rag.
4. Large dead vertical space on both screens — empty, not spacious.
5. Intro footer links "More tools from Incentiv" to this same tool.

**The structural fix for #2 — free is the DIAGNOSIS, gated is the REMEDY.**
Not "first two flags free." Every founder sees every issue they have and what
it costs. The email buys the *how to fix it*. This always has something to gate
regardless of flag count, and it is a stronger offer than hiding someone's own
problems from them.

```
Read LOG.md first, then DESIGN.md and BUILD-PROMPTS-PHASE2.md.

Acting as UI designer. Two jobs: build the summary visuals that Step 11
specified but were not delivered, and fix the gate logic, which is currently
broken.

First, tell me what of Step 11 actually exists before you change anything.

PART A — FIX THE GATE LOGIC (do this first, it is a correctness bug)

Right now a 2-flag result shows both flags in full and then asks for an email
to "unlock all 2 issues". There is nothing behind the gate. Replace the
count-based split with a content-type split:

  ALWAYS FREE (the diagnosis):
    - Summary visuals (below)
    - EVERY flag: title, severity, weeks, who fixes it, and the "why an
      investor asks this" line
  ALWAYS GATED (the remedy):
    - All self-fix guidance — the step-by-step "how"
    - The "needs a system" section and its CTAs
    - Cross-links to other Incentiv tools

Update the gate copy to match what is actually behind it:
  Heading: "Get the fixes"
  Body: "Step-by-step for the {n} issues above — what to do yourself this
         week, and what needs help."
  Button: "Send me the fixes"

Assert in a test that the gated region is never empty for any fixture,
including the 1-flag and 0-flag cases. For 0 flags, do not show a gate at all.

PART B — THE HERO, AS STAT TILES NOT A SENTENCE

The current headline is one long sentence mixing serif italic, gradient text
and mono numerals, wrapping across two lines with a bad rag. Two headline
numbers is a KPI row, not a sentence. Replace with two stat tiles side by side:

  [ 2 ]  issues found          [ 2–4 ]  weeks of delay at close

  - Numerals: IBM Plex Mono 300 at display size (56–72px)
  - Labels beneath: Inter small, muted ink
  - No gradient here. Reserve the blue→terracotta gradient for the section
    heading only — it is fighting the numbers for attention.
  - Stacks vertically below 768px

PART C — THE SUMMARY VISUALS (build all three; inline SVG, no chart library)

1. CLOSE TIMELINE — horizontal rail. Left marker "Diligence starts". A band
   extends right; each flag is a segment, width proportional to its weeks,
   ordered blocker → delay → cleanup, 2px surface gap between segments,
   lighter tail for the min–max range. The rail is RELATIVE — we never asked
   for a close date, so no calendar dates anywhere. Week numbers in Plex Mono.
   Hover tooltip: flag title, weeks, who fixes it.

2. READINESS MAP — 6 axes: Cap table · Instruments · ESOP · Vesting · Filings
   · Valuation. Coarse 0–3 per axis from the flags that fired there. Polygon
   stroke 2px #3482ff, fill 10%. Grid in warm border colour, 1px, recessive.
   Vertex dots >=8px; blocker vertices also carry the ▲ glyph. Every axis
   labelled with its status word — the shape never carries meaning alone.
   Note: radar area scales with the SQUARE of the value, so it exaggerates.
   It is a signature graphic, not a measurement. The flag list stays the
   source of truth.

3. BENCHMARK BAR — new, and it solves the "2 issues feels like nothing"
   problem. A single horizontal scale 0–9 with a shaded band at 3–5 labelled
   "typical at your stage" and a marker at the founder's count.
   Copy: "Companies at your stage typically carry 3–5. You have 2."
   Mark this as needing calibration alongside the delay ranges — the 3–5 band
   is currently an estimate, not measured.

Severity palette (validated — use exactly, and severity ALWAYS carries its
glyph AND its word, never colour alone):
  Blocker #DC2626 ▲ · Delay light #CA8A04 / dark #B8860B ● ·
  Cleanup warm gray ○ · Clear light #16A34A / dark #15803D ✓

Layout: the three visuals form one band directly under the stat tiles, sharing
the container rail. Timeline full width; map and benchmark side by side beneath
it, stacking under 768px.

PART D — KILL THE DEAD SPACE

Both screens have large empty vertical regions that read as broken rather than
spacious. Audit every vertical gap against the Step 9 spacing scale. Section
gaps are 64px, not 200px. On the intro screen, close the gap between the rule
and the mono line, and add a "what we check" strip: the 9 check areas as a
quiet mono grid, which sets scope and fills the space honestly.

PART E — FIX THE FOOTER BUG

The intro footer's "More tools from Incentiv" links to this same tool. Point it
at the ESOP Tax Calculator and the Funding Round Simulator instead.

Verify against all 6 fixtures plus the 1-flag and 0-flag edge cases. Screenshot
the results page in both themes at 1280px and 375px before you finish.
Update LOG.md.
```
