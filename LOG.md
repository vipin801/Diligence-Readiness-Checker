# Build Log — Diligence Readiness Check
Running record for any AI agent or developer picking this project up.
Read this file FIRST, before any other file.

> **Current status, after Step 17 on 2026-09-08: STILL NOT LAUNCH-READY, but now
> pushed.** The repository has a remote —
> `https://github.com/vipin801/Diligence-Readiness-Checker`, branch `main`, **public**
> (see open question 31) — and `origin/main` carries everything through Step 17.
> Step 17 committed a layout pass that was sitting undocumented in the working tree:
> a two-column home hero, the readiness map moved up beside the register headline,
> restructured flag cards and timeline, a reworked gate crop, and an Incentiv logo in
> the "Fixed by" slot. **That pass has not been seen in a browser**, so Step 15's
> screenshot evidence is now out of date for the home page, the register head, the
> flag cards and the timeline. Build, lint and **536 tests** pass. Read **Step 17**,
> then **Step 15**, then **Step 14**, then **Re-verification — 2026-09-05** before
> relying on any earlier "complete" or "copy audit passed" claim. **Every P0 in the
> re-verification entry is still open** — delivery is still a stub, the delay ranges
> are still estimates, the copy corrections are unmade, and roughly fourteen `#`
> placeholders from Step 15 are still dead.

## Project summary

The Diligence Readiness Check is a free diagnostic with a name/work-email gate,
intended for `incentiv.finance/tools/`.
It asks an Indian startup founder **8 multiple-choice questions** (cap table location,
outstanding instruments, ESOP pool, founder vesting, ROC/MCA filings, foreign capital,
last-round valuation basis, and raise timing) in roughly 90 seconds, then returns a
**risk register** rather than a score: each triggered flag carries a severity
(`Blocker` / `Delay` / `Cleanup`), an estimated delay range in weeks, a plain-English
"why an investor asks" line, and who fixes it (`You` / `Your CA/CS` / `Incentiv`). The
headline is a **time cost, not a number** — e.g. *"4 issues found · 5–9 weeks of delay at
close"* — because founders mid-raise care about the closing date. The audience is
seed-to-Series-A Indian founders, especially the high-intent segment that answers
*"term sheet in hand"* on Q8. The tool must give away at least two fixes the founder can
do themselves for free (that is what makes it a tool and not a funnel) and attach the
Incentiv pitch contextually to the specific flags it solves, never as a banner ad. v1 is
deliberately tiny: 8 questions, a deterministic rules table, one results page, no backend
and no account.

## Stack & key decisions

| Decision | Choice | Why |
|---|---|---|
| Framework | Next.js **16.3.4**, App Router | Current stable; deploys as a static, client-only page. |
| Runtime / UI | React **19.2.8** | Ships with Next 16. |
| Language | TypeScript 5, `strict: true` | Evaluation is a rules table — typed questions, answers, triggers and flags catch mismatches at build time. |
| Styling | Tailwind CSS **v4** (`@tailwindcss/postcss`) | Scaffold default; CSS-first `@theme` config suits DESIGN.md's token system. |
| Bundler | Turbopack (Next 16 default) | Default in Next 16; no reason to opt out. |
| Linting | ESLint 9 + `eslint-config-next` | Scaffold default. |
| Source layout | `src/` directory, `@/*` → `./src/*` | Per brief. |
| Package manager | npm | Lockfile committed (`package-lock.json`). |
| Package name | `diligence-readiness-check` | Folder name `Funding readiness score` is an invalid npm name (spaces + capitals). |
| Scaffold method | Generated into a temp subfolder, then moved to root | `create-next-app` refuses a non-empty directory and rejects the folder name; the spec `.md` files were already here. |
| Rendering model | Client-side state only, no server state | Hard constraint: no backend, no DB, no auth, no AI. Answers never leave the browser. |
| Output model | Risk register, no 0–100 score | `tool-spec-v1.md` §3 — the single highest-leverage design decision in the tool. |
| `DESIGN.md` encoding | Re-saved UTF-8 (was UTF-16LE) | It was unreadable to standard tooling. Original kept as `DESIGN.utf16.bak.md` (gitignored). Content verified complete — all 9 sections. |
| `AGENTS.md` | Kept, referenced from `CLAUDE.md` via `@AGENTS.md` | Auto-generated Next.js 16 framework rules; a useful guardrail. |
| Spec docs in repo | Committed | They are the source of truth; a fresh clone must be self-sufficient. |
| Cap-table product name | **Tabulate** | Confirmed by the human 2026-09-04, resolving the Tabulate-vs-Equity conflict. DESIGN.md §1 is wrong on this; the spec is right. |
| Token format | Bare HSL triplets (`214 100% 60%`) in `:root`/`.dark`, mapped through `@theme inline` | Lets every token take an alpha channel — `hsl(var(--primary) / 0.3)` — and re-resolve on theme change, which a hex cannot do. |
| Dark mode strategy | Class-based (`.dark`), light by default; `.light` re-asserts the light palette | DESIGN.md is light-first, so the tool must not flip with the OS. |
| Dark mode entry point | An explicit toggle, remembered in `localStorage`; **not** `prefers-color-scheme` | Following the OS would make the tool disagree with the light marketing page around it. The choice is the visitor's, and it is the only thing this tool ever persists. |
| No-flash theme | Blocking inline `<script>` in `<head>` | Without it a returning dark-mode visitor gets a cream flash on every navigation. It is the one place a blocking script earns its cost. |
| Blue for small text | New `--primary-text` token (light 42%, dark 68%) | `#3482ff` is 3.0:1 on cream — it fails AA at 10px, and `.section-label` is the most repeated text in the system. `--primary` is untouched for fills, dots, borders and the gradient. |
| Primary button fill | New `--primary-strong` token (48%) | White on `#3482ff` measures **3.35:1** — the primary CTA failed AA in both themes. Two points of lightness fixes it at the same hue. Deliberate, minimal deviation from DESIGN.md — see open question 26. |
| Severity marker | Shape as well as colour: disc / ring / bar | WCAG 1.4.1. The written label already carried it; the shape means it survives greyscale and forced colours too. |
| Arrow-CTA hit area | Invisible `::after`, not a taller box | `.cta-arrow` is 21px of inline text and appears mid-paragraph; growing the box would move the page's spacing everywhere it is used. |
| Motion vocabulary | One move — 8px rise + fade — used twice | Questions replay it on every change; flag cards stagger it at 55ms. `animation-fill-mode: both` means the end state shows even when the animation never runs. |
| OG card fonts | Four latin-subset **WOFF** files vendored in `src/assets/fonts/` | Satori reads TTF/OTF/WOFF but not WOFF2, so `next/font`'s faces are unusable. ~97KB, read at build, never served to a visitor. |
| `overflow-hidden` on the tool `<main>` | Removed | On a flex item it zeroes `min-height: auto`, which is a clipping bug waiting to happen on an 8,000px results page. Nothing needed the clip. |
| Component CSS naming | DESIGN.md's own class names in `globals.css` (`.btn-primary`, `.card-elevated`, `.section-label`…) | Keeps spec and code greppable against each other; React primitives stay thin wrappers. |
| Option controls | Real `<input>` + CSS sibling selectors, not JS state classes | Native keyboard nav, form semantics and screen-reader grouping for free. `peer-*` variants could not reach the nested indicator. |
| `clsx` + `tailwind-merge` | Added as deps | A 2-package `cn()` so every primitive accepts a `className` override without specificity fights. |
| Fonts | `next/font/google`, self-hosted; DM Serif Display loaded **italic-only** | The brand never uses it upright, so the upright face is dead weight. Self-hosting also means no Google requests at runtime. |
| Severity colour | Carried by the 6px badge dot; Blocker alone tints its border | DESIGN.md forbids orange/yellow and reserves blue for chrome, which rules out a red/amber/green ramp. Red is sanctioned for "warnings". |
| Starter home page | Replaced with a placeholder | It depended on the Geist fonts Step 2 removed, so it could not be left as-is. |
| Test runner | Vitest **5.0.0**, Node environment | Step 3 is framework-free data and logic, so it does not need a browser DOM or React test harness. |
| Delay aggregation | Fully concurrent, slowest-fix critical path | Fixes start together; total delay is `max(min)`–`max(max)`, never the sum of all flags. |
| Indefinite delays | `null` min and max | Preserves the spec's non-numeric Press Note 3 timing without inventing a number or using non-serializable infinity. |
| Results copy | A pure `buildResults()` in `src/lib/results.ts`; the component renders it | Every user-visible string lives in one framework-free function, so the tone and no-score rules are enforced by tests instead of by review. |
| Headline model | An array of `{kind: text|number}` segments, not a string | The headline mixes DM Serif Display italic with IBM Plex Mono numerals; segments let the renderer honour that without parsing text. |
| Indefinite headline | Keep the determinate range, name the approval separately | Collapsing a 7-flag result to "indefinite" because of Press Note 3 throws away the founder's real timeline. Step 3's `aggregateParallelDelay` is untouched; the results layer derives its own. |
| Free guidance scope | **All 11 flags**, not just the 2 the founder owns | Only `founder-vesting-missing` and `roc-filings-not-current` are founder-owned, so scoping free guidance to the self-fix bucket would hand some founders nothing. The split still means "who closes it". |
| Flag card leads with provenance | `You answered "<their own option label>"` | The hard rule is that every line traces to something the founder answered. Showing the answer itself is the most literal possible form of it. |
| Product name | `CAP_TABLE_PRODUCT = "Tabulate"` in `src/lib/brand.ts` | Re-confirmed by the human on the Step 6 build. `DESIGN.md` §1 still says "Equity"; a test asserts the string "Equity" never reaches the page. |
| Pitch selection | Priority-ordered variant list, first match takes the cap-table slot | Deterministic, greppable, and it makes "which pitch does this founder see" a single readable list rather than nested conditionals. |
| Pitch volume | At most one cap-table pitch + one advisory pitch, ever | Two destinations are the most a page can ask for without becoming the banner §4 forbids. |
| Two-free-fixes rule | `freeStepsBefore` computed per placement and asserted in tests | §1's corollary is the difference between a tool and a funnel. Enforcing it in the placement function means a future layout change cannot quietly break it. |
| Hoisting on `live` | Only the first pitch, only when the self-fix column already cleared the bar | "Term sheet in hand" earns a higher pitch, but not at the cost of the free-fixes rule. |
| Email capture | Stub handler, address never entered into analytics | No backend in v1. Keeping the address out of the event means a submission leaks nowhere — but it also means it is discarded, which is why this is a launch blocker, not a TODO. |
| Counts in prose vs. headings | Spelled out in sentences, numerals in display headings | DESIGN.md puts every *stat* in Plex Mono. "Two of these are blockers" is a sentence; "2 of these need a system." is the spec's own heading and a stat. |

## File map

| Path | Purpose |
|---|---|
| `LOG.md` | **This file.** Running build record. Read first, update last, every session. |
| `CLAUDE.md` | Agent instructions: session protocol, product constraints, design constraints, commands. |
| `AGENTS.md` | Auto-generated Next.js 16 framework rules. Pulled into `CLAUDE.md`. |
| `tool-spec-v1.md` | **Source of truth for product behaviour** — the 8 questions, flag table, results structure. |
| `DESIGN.md` | **Source of truth for visual design** — Incentiv design system (colors, type, components, layout). |
| `BUILD-PROMPTS.md` | The 8-step build plan, one prompt per step. Reference only. |
| `funding-readiness-product-thinking-v1.md` | Background product rationale. Context, not spec. |
| `README.md` | Project setup, architecture and rule-editing guide, with the pre-launch calibration warning and checklist. |
| `package.json` | Deps and scripts (`dev`, `build`, `start`, `lint`, `test`). |
| `package-lock.json` | Locked dependency tree. |
| `tsconfig.json` | TS config; `@/*` → `./src/*` path alias. |
| `next.config.ts` | Next config. Currently empty defaults. |
| `postcss.config.mjs` | Tailwind v4 PostCSS plugin. |
| `eslint.config.mjs` | Flat ESLint config. |
| `vitest.config.mts` | Vitest config; Node environment because the rules engine is framework-free. |
| `.gitignore` | Node/Next ignores + Office `~$*` lock files + encoding backup. |
| `src/app/layout.tsx` | Root layout — loads the three fonts, renders `<PageEdgeLines />`, sets metadata. |
| `src/app/page.tsx` | Placeholder home page linking to the styleguide. Not the tool. |
| `src/app/globals.css` | **The token layer.** Colours, the seven type roles, the one container (`.container-tool`), the measure caps, component classes, edge lines. Single source for all styling. |
| `src/app/favicon.ico` | Default favicon. To be replaced with Incentiv's. |
| `public/` | Static assets (default Next SVGs; now unused, to be cleaned out). |
| `src/lib/cn.ts` | `cn()` class-merge helper (clsx + tailwind-merge). |
| `src/lib/questions.ts` | Typed source of truth for all 8 questions, input modes and stable option ids. |
| `src/lib/flags.ts` | The 11 declarative flag rules, placeholder delays, ownership and CTA mappings. |
| `src/lib/evaluate.ts` | Pure evaluator: flags, severity ordering, parallel delay range, urgency and fix split. |
| `src/lib/evaluate.test.ts` | Vitest coverage for clean/worst paths, every trigger, Q2 and delay aggregation. |
| `src/lib/__fixtures__/scenarios.ts` | Six realistic founder answer sets for calibration and later end-to-end checks. |
| `src/lib/brand.ts` | Product names, the on-page subhead + stat line, the five outbound URLs, the nine check areas and their three groups, and (Step 15) the whole site chrome: nav, breadcrumb, rail copy, cross-sell, link cards, footer columns. **The only place "Tabulate" is written.** |
| `src/lib/analytics.ts` | The 10 events and the single swappable adapter. Console stub in v1. |
| `src/lib/pitch.ts` | The conversion layer: 9 pitch variants, placement, cross-links, email copy. |
| `src/lib/pitch.test.ts` | Enforces the two-free-fixes rule, variant routing, urgency modulation, copy hygiene. |
| `src/lib/guidance.ts` | Per-flag remediation content: action headline, concrete free steps, and why a system is needed. |
| `src/lib/results.ts` | Pure `buildResults()` — every user-visible string on the results screen, as data. |
| `src/lib/gate.ts` | **The lead gate.** Its copy, the work-email rule (two lists — see Step 11), and the unlock flag in `localStorage`. |
| `src/lib/gate.test.ts` | Vitest coverage for the provider lists, the messages, the interpolated count and a throwing storage. |
| `src/lib/leads.ts` | Where a captured lead goes. One swappable adapter; **posts nowhere in v1**. |
| `src/lib/summary.ts` | **The summary band, as data.** The two stat tiles, the tally strip (Step 15) and the view models for the timeline, the readiness map and the benchmark bar, plus `SUMMARY_COPY`. Decides every number and every word the visuals draw. |
| `src/lib/summary.test.ts` | Vitest coverage for the band: no score, every number also present as text, every severity carrying a glyph and a word, and no calendar date on a relative rail. |
| `src/lib/brand.test.ts` | Holds `CHECK_AREAS` to the rules table — every rule accounted for exactly once — and keeps the footer pointing away from this tool. |
| `src/lib/results.test.ts` | Vitest coverage for headlines, traceability, the split, the clean state and the copy rules. |
| `src/components/layout/page-edge-lines.tsx` | The signature animated scan lines. Rendered once, in the root layout. |
| `src/components/layout/site-nav.tsx` | **Step 15.** The sticky site nav: wordmark, four links, theme toggle, "Book a demo". Above the edge lines. Replaced `tool-header.tsx`. |
| `src/components/layout/site-footer.tsx` | **Step 15.** Products / Solutions / Resources / Company, with mono headers. Also the mobile fallback for the nav's hidden links. |
| `src/components/layout/tool-link-cards.tsx` | **Step 15.** The two bordered cards under the split. |
| `src/components/ui/index.ts` | Barrel re-export — import primitives from `@/components/ui`. |
| `src/components/ui/button.tsx` | `Button` + `ButtonLink`; variants primary / secondary / ghost / arrow. |
| `src/components/ui/card.tsx` | `Card`; elevations card / surface / raised, optional `interactive` hover. |
| `src/components/ui/badge.tsx` | `Badge`; tones neutral / blocker / delay / cleanup / success. Flag severity. |
| `src/components/ui/progress-bar.tsx` | `ProgressBar` for the 8-question track. |
| `src/components/ui/radio-option.tsx` | `RadioOption` — single-answer question choice. |
| `src/components/ui/checkbox-option.tsx` | `CheckboxOption` — multi-select choice (Q2). |
| `src/components/ui/section-label.tsx` | `SectionLabel` — the mandatory 10px uppercase blue label. |
| `src/components/ui/input.tsx` | `Input` — `.input-field`; the gate's name and work-email fields. |
| `src/components/ui/incentiv-logo.tsx` | **Step 17.** `<IncentivLogo />` — the brand mark, rendered in the flag card's "Fixed by" slot when the fix is Incentiv-owned. `alt` is the string it replaces. |
| `public/incentiv-logo.jpg` | **Step 17.** The 3.5 KB artwork behind that component. |
| `src/components/ui/icon-box.tsx` | `IconBox` — the fixed 48px brand-blue icon container. |
| `src/components/ui/persona-chip.tsx` | `PersonaChip` — toggle chip, `aria-pressed`, `data-active`. |
| `src/app/opengraph-image.tsx` | The 1200×630 social card, generated at build. Inherited by every route. |
| `src/app/twitter-image.tsx` | Re-export of the same card, because Next resolves the two separately. |
| `src/app/not-found.tsx` | In-brand 404. |
| `src/assets/fonts/*.woff` | Four latin-subset faces read at build time by the OG card. Never served. |
| `src/lib/theme.ts` | Theme state: storage key, the pre-paint inline script, and the store the toggle subscribes to. |
| `src/components/layout/theme-toggle.tsx` | Light ⇄ dark button. Remembers the choice. |
| `src/app/tools/diligence-readiness/page.tsx` | The tool's route. Server component; metadata + header. |
| `src/app/tools/diligence-readiness/loading.tsx` | Route skeleton in the shape of the intro screen. |
| `src/app/tools/diligence-readiness/error.tsx` | Route error boundary. Next 16 passes `retry`, not `reset`. |
| `src/app/tools/diligence-readiness/question-flow.tsx` | Client flow: intro → 4 paired screens → results. Holds all answer state. |
| `src/app/tools/diligence-readiness/screens.ts` | **How the 8 questions are grouped on screen** — the three steps (Step 15; four pairs before it). The group ids and labels come from `brand.ts`, so the rail and the tabs name the same three things. Throws at module load if it drifts from `questions.ts` or from `CHECK_GROUP_ORDER`. |
| `src/app/tools/diligence-readiness/tool-rail.tsx` | **Step 15.** The left rail: breadcrumb, the page h1 with its pale highlight, the lede, the accordion of check groups (which is also the step navigation) and the one standing cross-sell. Hides the accordion and cross-sell below 1024px. |
| `src/app/tools/diligence-readiness/step-tabs.tsx` | **Step 15.** The three step tabs. State is border colour AND label ink AND `aria-current`, never colour alone. |
| `src/app/tools/diligence-readiness/results-screen.tsx` | The risk register, split by the gate **by content type, not by count** (Step 14): stat tiles, the three visuals and every finding are free; the remedies, their CTAs and the cross-links are blurred. Renders `buildResults()`; writes no copy of its own. |
| `src/app/tools/diligence-readiness/summary-visuals.tsx` | The three inline-SVG visuals and the stat tiles. Geometry only; every string comes from `summary.ts` and every shape is `aria-hidden` decoration over text. |
| `src/app/tools/diligence-readiness/segments.tsx` | `HeadlineLine` — the one place a numeral is set in Plex Mono. Shared by the register and the gate. |
| `src/app/tools/diligence-readiness/results-screen.test.tsx` | Server-renders the screen for all six fixtures and checks structure, order and type roles. |
| `src/app/tools/diligence-readiness/conversion.tsx` | `PitchBlock`, `CrossLinks`, `EmailCapture` (clean state only) and `ReportGate`. Layout + analytics only; copy comes from `pitch.ts` and `gate.ts`. |
| `src/app/tools/diligence-readiness/icons.tsx` | The one shared inline icon (back arrow). |

**Still to build or correct** — Step 15 (2026-09-07) closed Step 14's "nothing
has been seen in a browser" gap: 36 screenshots at 375/768/1024/1440 in both
themes, no console errors, no horizontal overflow, evidence at
`C:/Users/Vipin/.codex/qa/step15-2026-09-07/`. Surfaces at
`/tools/diligence-readiness` are now the site nav, a 380px rail carrying the
page h1 and the scope accordion, three step tabs, the eight questions across
three steps (question one on screen at load — there is no intro splash), the
stat tiles, the tally strip, the summary band, every finding, the gate over the
remedies, two link cards and the site footer.

**Everything else still stands.** Delivery is a stub, the delay ranges and the
benchmark band are estimates, and the five outbound URLs are `#` — plus roughly
fourteen more `#` placeholders added by Step 15's chrome. The copy, free-value
and accessibility blockers in the 2026-09-05 re-verification are all unmade, and
the new accordion and step tabs have had no accessibility pass of their own.

## Step log

### Step 1 — Scaffold & logging setup — 2026-09-04

**Done:**
- Confirmed this directory was **not** an existing Next.js site (no `package.json`, no
  `next.config.*`, no `src/`, not a git repo) — only the four spec markdown files and two stale
  MS Word lock files. So scaffolding was correct, not an add-a-route-to-an-existing-site job.
- Scaffolded Next.js 16.3.4 with App Router, TypeScript, Tailwind v4, ESLint, `src/` dir and the
  `@/*` alias. Because `create-next-app` refuses a non-empty directory and also rejects
  `Funding readiness score` as an npm package name, it was generated into a temporary
  `diligence-readiness-check/` subfolder and its contents moved to the project root; the nested
  `.git` and `.next` it created were deleted first.
- Read `tool-spec-v1.md` in full. Read `DESIGN.md` in full — it was UTF-16LE encoded, so it was
  decoded and **re-saved as UTF-8**, with the original preserved as `DESIGN.utf16.bak.md`
  (gitignored). `BUILD-PROMPTS.md` warns that the file is "truncated at ## 2. Color Palette &
  Roles" — **it is not.** All 9 sections through §9 Agent Prompt Guide are present and intact.
  Only the encoding was the problem, and that is now fixed.
- Wrote `CLAUDE.md`: project one-liner, the read-LOG-first / update-LOG-last session rule, the
  source-of-truth file table, the non-negotiable product constraints (no backend, no auth, no DB,
  no AI calls, no cap-table upload, no score, no signup wall), the tone constraints, the condensed
  design constraints from `DESIGN.md`, and the dev/build/lint commands.
- Wrote this `LOG.md`.
- Extended `.gitignore` with editor/OS cruft, the `~$*` MS Office lock files already sitting in
  the directory, and the encoding backup.
- Initialised git and made one initial commit.
- Verified the toolchain: `npm run build` succeeds (4 static routes prerendered, TypeScript
  clean), `npm run lint` passes with zero findings, and `npm run dev` serves the starter page at
  `http://localhost:3000` with HTTP 200.

**Files created/changed:**
- Created: `LOG.md`, `CLAUDE.md`, `AGENTS.md`, `README.md`, `package.json`, `package-lock.json`,
  `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `.gitignore`,
  `next-env.d.ts` (gitignored), `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`,
  `src/app/favicon.ico`, `public/*` (default Next SVGs), `node_modules/` (gitignored).
- Changed: `DESIGN.md` — re-encoded UTF-16LE to UTF-8; content identical after decode.
- Added: `DESIGN.utf16.bak.md` — backup of the original, gitignored.
- Untouched: `tool-spec-v1.md`, `BUILD-PROMPTS.md`, `funding-readiness-product-thinking-v1.md`.

**Decisions made:**
- Scaffold-then-move, rather than fighting `create-next-app`'s empty-directory and package-name
  checks.
- npm package name `diligence-readiness-check`, since the folder name is not a legal npm name.
- Turbopack left on (the Next 16 default) — no reason to opt out for a static tool.
- Kept the auto-generated `AGENTS.md` and referenced it from `CLAUDE.md` with `@AGENTS.md` rather
  than deleting it; its Next 16 rules are a useful guardrail for future agents.
- Committed the spec markdown files so a fresh clone is self-sufficient.
- Fixed `DESIGN.md`'s encoding rather than leaving it as a blocker, since every later step reads it.
- Built **no** tool features, no design tokens, and no routes — Step 1 is setup only.

**Known gaps / TODO:**
- `src/app/page.tsx` is still the default Next.js starter page. The real entry point,
  `/tools/diligence-readiness`, does not exist yet.
- No design tokens, fonts, or primitives yet — that is Step 2. `globals.css` is stock Tailwind v4.
- `public/` still holds the default Next.js SVGs, and `favicon.ico` is still Next's.
- `README.md` is the stock scaffold readme.
- No tests and no test runner. The scoring rules table is pure logic and should get unit tests;
  nothing is set up for that yet.
- No analytics wired, though `tool-spec-v1.md` §7 defines five success metrics that need events.
- The delay ranges in the flag table are explicitly placeholders in the spec and are **not**
  calibrated.
- No deployment config (`vercel.json`, `basePath`, static-export settings) — depends on open Q4.

**Next step:**
**Step 2 — Design system foundation + styleguide page.** Load DM Serif Display, Inter (with the
`cv02` / `cv03` / `cv04` / `cv11` OpenType features) and IBM Plex Mono via `next/font/google`;
express DESIGN.md's palette, type scale, radii and spacing as Tailwind v4 `@theme` tokens in
`globals.css`; build the primitives (`.section-label`, `.heading-hero`, `.heading-section`,
`.number-display`, `.btn-primary`, `.btn-secondary`, `.card-elevated`, `.badge`,
`.section-divider`, `.page-edge-lines`); and ship an internal styleguide page to eyeball them all.

### Step 2 — Design system foundation + styleguide — 2026-09-04

**Done:**
- **Fonts.** All three loaded through `next/font/google` and self-hosted (20 woff2 files, zero
  runtime requests to Google): DM Serif Display 400 **italic-only** (the brand never uses it
  upright, so the upright face would be dead weight), Inter variable, IBM Plex Mono 300 and 400.
  Exposed as `--font-dm-serif` / `--font-inter` / `--font-plex-mono` and mapped to Tailwind's
  `font-serif` / `font-sans` / `font-mono`. The `cv02` / `cv03` / `cv04` / `cv11` OpenType
  features are set on `body` in `globals.css` so they apply to every Inter glyph on the page.
- **Tokens.** Full light and dark palettes as bare HSL triplets on `:root` / `.light` and `.dark`,
  surfaced to Tailwind through `@theme inline`. `bg-primary`, `text-muted-foreground`,
  `border-border` and the `/opacity` modifiers all work and re-resolve when `.dark` is applied.
  Radius is a single 4px value across `--radius`, `--radius-sm`, `--radius-md`, `--radius-lg`.
- **Type roles** from DESIGN.md §3 implemented as CSS with real breakpoints: `.heading-hero`
  (30→60px), `.heading-section` (20→36px), `.heading-sub`, `.text-body-lg`, `.text-body`,
  `.text-nav`, `.section-label`, `.number-display`, `.number-large`, `.text-gradient`. Every
  serif role is locked to `font-style: italic` and `-0.03em` so it cannot be used upright.
- **Primitives** in `src/components/ui/`, all presentational and stateless: Button (primary /
  secondary / ghost / arrow, plus a `ButtonLink` anchor twin), Card (card / surface / raised
  elevations, optional hover), Badge (blocker / delay / cleanup / neutral / success), ProgressBar,
  RadioOption, CheckboxOption, SectionLabel. Re-exported from `@/components/ui`.
- **Page edge lines** built as a layout-level component with two 1px rules positioned by
  DESIGN.md's `max(16px, calc((100vw - 1312px) / 2))` formula, each carrying a blue gradient that
  scans down on a 5s loop via a compositor-friendly `transform`. Marked `aria-hidden` — it is
  decoration. Under `prefers-reduced-motion` the scan parks static at 35% opacity, and a global
  rule collapses every other animation and transition in the system.
- **`/styleguide`** renders all of the above with each section shown twice, side by side, one
  panel pinned `.light` and one pinned `.dark`, plus a toggle for the surrounding page chrome.
  Covers colour swatches, gradients, every type role, an Inter OpenType specimen, all button
  variants and states, all four elevations, severity badges, a working progress bar, live radio
  and checkbox groups, the radius scale, dividers and background patterns. Route is
  `robots: noindex, nofollow`.
- Replaced the create-next-app starter home page — it depended on the Geist fonts this step
  removed — with a small placeholder that links to the styleguide.
- Verified: `npm run build` passes (3 routes prerendered, TypeScript clean), `npm run lint` passes
  with zero findings, and the production server returns 200 for both `/` and `/styleguide` with
  all design-system classes present in the emitted CSS and markup.

**Files created/changed:**
- Created: `src/lib/cn.ts`, `src/components/layout/page-edge-lines.tsx`,
  `src/components/ui/{index.ts,button.tsx,card.tsx,badge.tsx,progress-bar.tsx,radio-option.tsx,
  checkbox-option.tsx,section-label.tsx}`, `src/app/styleguide/{page.tsx,styleguide-client.tsx}`.
- Rewritten: `src/app/globals.css` (stock Tailwind → the full token layer),
  `src/app/layout.tsx` (Geist → the three brand fonts + `<PageEdgeLines />` + real metadata),
  `src/app/page.tsx` (starter → placeholder).
- Changed: `package.json` / `package-lock.json` — added `clsx` and `tailwind-merge`.
- Updated: `CLAUDE.md` (records Tabulate as the confirmed product name; adds a "Where the design
  system lives" section), `LOG.md`.

**Decisions made:**
- Component CSS is written in `globals.css` under **DESIGN.md's own class names**
  (`.btn-primary`, `.card-elevated`, `.badge`, `.section-label`, `.section-divider`,
  `.page-edge-lines`), with the React primitives as thin wrappers. A future agent can grep a name
  out of DESIGN.md and land directly on its implementation.
- Colours are stored as bare HSL triplets rather than hex so every token can take an alpha
  channel — `hsl(var(--primary) / 0.3)` — which the design system needs for hover borders, focus
  rings and washes.
- Dark mode is **class-based and off by default**. DESIGN.md is light-first, so the tool must not
  flip with the visitor's OS setting. A `.light` class re-asserts the light palette, which is what
  lets the styleguide pin both modes on one page.
- The radio and checkbox controls are driven by a real hidden `<input>` and CSS sibling selectors
  rather than JS-applied classes. Tailwind's `peer-*` variants cannot reach the nested indicator
  span (it is a descendant, not a sibling), and native inputs give keyboard navigation, form
  semantics and screen-reader grouping for free.
- Severity is carried by the badge dot, not a coloured pill — see the decisions table for why the
  usual red/amber/green ramp is unavailable in this palette.
- Added a fourth Button variant, `arrow`, beyond the three requested. DESIGN.md documents
  `.cta-arrow` as a button style and the results screen's key CTA ("See your real number →") is
  exactly that; it is a one-line entry in the variant map.
- Radio and checkbox glyphs keep their conventional circle and square. The 4px rule governs cards,
  buttons and inputs; the control glyph itself is an affordance, not a container.

**Known gaps / TODO:**
- **`/styleguide` is temporary and must be deleted before launch.** Remove `src/app/styleguide/`
  entirely; nothing else imports from it. It is `noindex` in the meantime.
- No tool features, no `/tools/diligence-readiness` route, no question data, no rules table yet.
- `public/` still holds the four default Next.js SVGs, now unreferenced. `favicon.ico` is still
  Next's. Safe to delete once Incentiv's assets are available.
- `README.md` is still the stock scaffold readme.
- Primitives not yet built because nothing needs them: nav/header, footer, persona chips, the
  hero lead row and email input, icon set, modal/dialog. Add them when a feature calls for them.
- The dark palette is implemented but never exercised by the product — only by the styleguide.
- Contrast has not been formally checked. `--muted-foreground` at `#666666` on `#FDFCF9` is
  roughly 5.7:1 (passes AA for body text); the dark-mode equivalents are inferred, not specified,
  and should be measured before any dark surface ships.
- No tests. The primitives are simple enough not to need them, but the rules table will.

**Next step:**
**Step 3 — the 8-question flow.** Model the questions from `tool-spec-v1.md` §2 as typed data in
`src/lib/`, build the question screen on RadioOption / CheckboxOption / ProgressBar, and wire
client-side state for answers, navigation and the Q2 multi-select. Still no scoring — that is
Step 4.

### Step 3 — Content + rules engine (no UI) — 2026-09-04

**Done:**
- Added all 8 questions from `tool-spec-v1.md` §2 as typed, readonly data. Prompt and option copy
  is verbatim; every question and option has a stable id, Q2 is the only multi-select, and Q8 is
  represented in the answer model used for urgency.
- Added 11 declarative flag rules from §3. Each carries a typed trigger, short title, a maximum
  two-sentence investor rationale, severity, min/max delay, primary fixer and CTA id. Every one
  of the 11 delay entries is immediately marked `// CALIBRATE`.
- Built the pure `evaluate(answers)` function with no React, Next.js or side effects. It sorts
  blockers before delays before cleanup, maps Q8 to `none` / `planning` / `near` / `live`, and
  divides triggered flags into self-fixable and system-needed lists.
- Implemented delay aggregation as a fully concurrent critical-path model: every remediation can
  start together, so the combined range is the largest minimum through the largest maximum, not
  a sum. Press Note 3's `Indefinite` estimate is preserved as `{ min: null, max: null }`; no
  arbitrary week count was introduced.
- Added six realistic calibration fixtures: a clean Series A, a bootstrapped first raise, an
  instrument-heavy seed, a live foreign-angel round, a departed-cofounder case, and a complex
  cross-border case.
- Installed Vitest 5 and added 30 tests covering the zero- and one-flag clean paths, the maximum
  simultaneously reachable worst path, every rule and every alternative answer trigger in
  isolation, Q2 distinct-instrument/uncertainty behaviour, severity order, urgency, concurrent
  delay aggregation, the self/system split, and all six fixtures.
- Verified `npm run test` (30/30), `npm run lint` (zero findings), and `npm run build` (TypeScript
  clean; all existing routes statically prerendered).

**Files created/changed:**
- Created: `src/lib/questions.ts`, `src/lib/flags.ts`, `src/lib/evaluate.ts`,
  `src/lib/evaluate.test.ts`, `src/lib/__fixtures__/scenarios.ts`, `vitest.config.mts`.
- Changed: `package.json`, `package-lock.json` (Vitest, test script, Node 24 type definitions),
  `CLAUDE.md` (test command), `LOG.md`.
- No UI, route, component, backend or persistence code was added.

**Decisions made:**
- The spec's single-select questions make all 11 rules impossible to trigger in one answer set
  (for example, Q3 cannot be both `no pool` and `over-granted`). The suite therefore tests the
  maximum compatible worst path and separately proves that every flag rule fires in isolation.
- Q2's instrument-count rule counts distinct SAFEs, convertible notes/CCDs, CCPS and ESOP grant
  types; `Nothing` and `Not sure` do not count. The uncertainty blocker is independent, so it can
  coexist with the count flag if an answer set contains known instruments plus `Not sure`.
- Where the spec names two fixers but the required schema permits one, the primary route is used:
  founder-vesting documentation → `you`; no/unclear ESOP pool → `incentiv`; departed-founder
  equity → `incentiv`. Both `you` and `ca-cs` remain in the self-fixable bucket as required.
- CTA routing follows §4: cap-table/instrument/ESOP/ownership-system issues → `tabulate`;
  founder-vesting and ROC preparation → `self-fix-guide`; FEMA, Press Note 3 and Rule 11UA →
  `advisory`.
- Vitest runs in a Node environment because this step is pure TypeScript. Installing current
  Vitest required aligning `@types/node` from 20 to 24, which matches the actual Node 24 runtime.

**Known gaps / TODO:**
- Every delay is still an uncalibrated placeholder. `null` for Press Note 3 means indefinite and
  must be handled explicitly when the results headline is built.
- Q2's future UI should make `Nothing` and `Not sure` exclusive choices; the evaluator remains
  deterministic even if it receives a mixed selection.
- The fixer schema intentionally stores one primary owner, so secondary collaborators from the
  prose table (`Incentiv + CS`, `You + CS`, `You + Incentiv`) are not separately represented.
- The CTA ids are mappings only. Copy, URLs, contextual pitch variants and click behaviour belong
  to Step 6 and are not implemented.

**Next step:**
**Step 4 — Question flow UI.** Build the intro and one-question-per-screen flow from
`QUESTIONS`, keep answers in a client-side reducer, auto-advance single selects, give Q2 an
explicit Continue action, preserve Back navigation, and route completion to a results
placeholder. Do not build the results screen yet.


### Step 4 — Question flow UI — 2026-09-04 *(logged retroactively in Step 5)*

**This entry is reconstructed from the code, not written at the time.** Step 4 was built
but `LOG.md` was never updated for it, which breaks the session protocol at the top of
`CLAUDE.md`. What follows is only what is verifiable from `question-flow.tsx`; the
decisions and trade-offs made during that session are lost and were not recovered.

**Done (as evidenced by the code):**
- `src/app/tools/diligence-readiness/page.tsx` — server component, metadata only.
- `src/app/tools/diligence-readiness/question-flow.tsx` — a client `useReducer` flow with
  three screens (`intro` / `questions` / `complete`), all answer state in memory, nothing
  persisted anywhere.
- Single-selects auto-advance on a 200ms timer; Q2 (multi-select) has an explicit
  **Continue** and treats `Nothing` and `Not sure` as mutually exclusive with the
  instrument options — which closes the Q2 UI gap Step 3 flagged.
- Back navigation throughout, including back out of the completion screen; arrow keys move
  between options, Enter selects, Esc goes back; focus moves to the selected (or first)
  input on every question change.
- `ProgressBar` shows *n* of 8.

**Known gap carried into Step 5:** the reducer holds `Partial<Answers>`, so the results
screen needed a narrowing gate before it could be handed a complete answer set.

### Step 5 — The results screen — 2026-09-04

**Done:**
- **The risk register is live.** `/tools/diligence-readiness` now runs end to end: intro →
  8 questions → results. Sections in the order `tool-spec-v1.md` §4 specifies — headline,
  flags, the split, then the Step 6 slots.
- **Headline.** `N issues found · estimated X–Y weeks of delay at close`, set in DM Serif
  Display italic with the blue→terracotta gradient, and every numeral broken out into its
  own IBM Plex Mono 300 span. The mono spans are forced upright: Plex Mono is loaded
  without an italic face, so inheriting the heading's italic would synthesise an oblique.
  The spec's subline sits underneath verbatim.
- **A timing line that finally uses Q8.** Until now Q8 fed `urgency` and nothing rendered
  it. The headline block now closes with a line keyed to the founder's raise timing —
  "a term sheet is in hand or diligence has started" reads differently from "six or more
  months out", and it is the line that makes the week counts mean something.
- **Flag cards, blockers first.** Each card leads with **provenance** —
  `You answered "In Excel or Google Sheets"` — then the flag title, then the
  "why an investor asks" line. A right-hand rail carries the severity badge, the delay in
  Plex Mono, and who fixes it.
- **The split, with real content behind it.** `src/lib/guidance.ts` is new: for all 11
  flags it holds an action headline and 3–5 concrete, ungated steps — named MCA forms and
  their windows (AOC-4, MGT-7/7A, PAS-3, MGT-14, SH-7, DIR-3 KYC, ADT-1), FC-GPR at 30 days
  and FC-TRS at 60, how Indian founder vesting is actually written when the shares are
  already issued, and how to reconcile a sheet against the MCA record. The 9 system-owned
  flags additionally carry a `systemReason` saying plainly why doing it once does not hold.
- **Zero-flag state.** A sentence rather than a zero ("Nothing here that typically delays a
  close."), the founder's own clean answers read back to them, an explicit caveat naming
  what the check does *not* cover, and a next step — the three moments the record drifts,
  and the filing clocks attached to each.
- **One-flag state.** Singular copy throughout, a line noting every other answer came back
  clean, and the lone card promoted to display type (`heading-section` + `number-large`)
  instead of card type, so a single finding does not read as a thin page.
- **Step 6 placeholders** in three positions, dashed-bordered and labelled
  "Step 6 — placeholder, not shipped copy": the Tabulate pitch under the system column,
  the clean-state next step, and the secondary CTA row. Tests assert no pitch copy leaked
  in early.
- **Verified against all six Step 3 fixtures**, twice: once through `buildResults()` and
  once by server-rendering the real component for each. 161 tests pass; `npm run lint` is
  clean; `npm run build` prerenders all four routes.

**Files created/changed:**
- Created: `src/lib/guidance.ts`, `src/lib/results.ts`, `src/lib/results.test.ts`,
  `src/app/tools/diligence-readiness/results-screen.tsx`,
  `src/app/tools/diligence-readiness/results-screen.test.tsx`,
  `src/app/tools/diligence-readiness/icons.tsx`.
- Changed: `src/lib/flags.ts` (exports a derived `FlagId`), `src/lib/questions.ts` (adds
  `isCompleteAnswers`), `src/app/tools/diligence-readiness/question-flow.tsx` (renders the
  results screen, adds a `restart` action, shares the back-arrow icon), `vitest.config.mts`
  (adds the `@/*` alias so components can be server-rendered in tests), `LOG.md`.
- No backend, no persistence, no network call, no AI call, no score.

**Decisions made** — see the decisions table above for the full list. The three that
matter most:
- **All 11 flags get free guidance, not just the 2 the founder owns.** `CLAUDE.md` requires
  giving at least two fixes away, but only `founder-vesting-missing` and
  `roc-filings-not-current` are founder-owned, so a founder whose only flag is a departed
  cofounder would otherwise have received nothing. The split still means *who closes it*;
  the system column just also says what you can start yourself today.
- **The indefinite headline keeps the determinate range.** Step 3 correctly returns
  `{min: null, max: null}` for any set containing Press Note 3, but rendering that as the
  headline of a 7-flag result throws away the founder's real timeline. The results layer
  derives its own determinate range and names the approval separately. Step 3's
  `aggregateParallelDelay` is untouched.
- **The component writes no user-visible copy.** Every string comes from `buildResults()`,
  which is why the tone rules (no score, no accusation, factual Press Note 3 wording) can be
  asserted by tests rather than checked by eye.

**Known gaps / TODO:**
- **Nobody has looked at this in a browser.** The Chrome extension was not connected this
  session, so verification was structural — server-rendered markup for all six fixtures,
  checked for section order, type roles, ordering and copy. Layout, spacing, the gradient
  headline and mobile behaviour have **not** been seen by a human or by a rendering engine.
  This is the first thing to do next session.
- **The delay ranges are still uncalibrated**, and it now shows. Because delays aggregate on
  a parallel critical path, real headlines land at 2–8 weeks — the spec's illustrative
  "5–9 weeks" is not reachable from the placeholder table. Whether that is the placeholders
  or the parallel model is a calibration question, not a code one. See open question 2.
- The three `StepSixPlaceholder` blocks must be **replaced**, not deleted, in Step 6.
- `.text-gradient` sets `color: transparent` with no `forced-colors` fallback, so the
  headline would disappear in Windows High Contrast mode. A four-line fix in `globals.css`;
  left alone this step to keep the token layer out of scope.
- Dark mode is still never exercised by the product — the results screen is light-only.
- No analytics events (§7's five metrics), no email capture, no PDF, no shareable result.
- `/styleguide` is still temporary and still has to be deleted before launch.

**Next step:**
**Step 6 — the Tabulate pitch and CTAs.** Replace the three `StepSixPlaceholder` blocks:
the contextual Tabulate pitch attached to the specific flags it solves (never a banner),
`Talk to Advisory` attached to the FEMA / Press Note 3 / Rule 11UA flags, `Email me this
report` as optional capture with no wall, and the routes into the Funding Round Simulator,
ESOP Tax Calculator and Valuation Calculator. Open questions 5 and 7 block parts of this.
Before writing any of it, open the page in a browser and look at Step 5's work.


### Step 6 — The conversion layer — 2026-09-04

**Product name re-confirmed by the human before any CTA copy was written: Tabulate.**
It now exists exactly once, as `CAP_TABLE_PRODUCT` in `src/lib/brand.ts`, and a test
asserts the string "Equity" never reaches the rendered page. `DESIGN.md` §1 still says
"Equity" and should be corrected at source.

**Done:**
- **The contextual pitch.** Nine variants in `src/lib/pitch.ts`, priority-ordered; the
  first match takes the cap-table slot and the advisory slot is filled independently, so
  a page carries **at most two** pitch blocks. Each is a `<Card>` in the normal flow of
  the "needs a system" column, anchored after the guidance card for the last flag it
  cites. Nothing is fixed, sticky, overlaid or full-bleed — a test greps the rendered
  markup for `fixed` / `sticky` / `position:` and fails if any appears.
- **The cliffhanger** (§1's "single best moment") fires on a cap table that is not a
  system of record plus two or more instrument types, and reads:
  *"You have 3 instrument types outstanding — SAFEs, CCPS and ESOP grants — and your cap
  table lives in a spreadsheet. That means you don't currently know what the founders own
  post-conversion — and it's question one in every diligence call."* The instrument count,
  the instrument names and the cap-table clause all come from the founder's own answers;
  the clause adapts for "my CA or CS maintains it" and "honestly, not sure".
- **The other eight variants**, each quoting the founder back: `instruments-unknown`
  (Q2 "not sure"), `ownership-cleanup` (departed founder), `roc-reconciliation` (the
  compounding story when the cap table *and* the filings both flagged), `instrument-stack`
  (instruments outstanding but the cap table is on a platform), `cap-table-only`,
  `esop-pool` (separate copy for no-pool vs. over-granted), `advisory-filings`, and
  `clean-state`. A test proves every one is reachable and that every system-owned flag
  routes to some pitch.
- **FEMA, Press Note 3 and Rule 11UA route to Advisory, never to the cap-table product** —
  asserted directly. That pitch names only the clauses that actually fired, uses the
  singular connective when there is one, and stays factual on Press Note 3 (a test rejects
  "banned", "prohibited", "illegal", "blocked").
- **Urgency modulation from Q8.** Four distinct CTA labels and four distinct notes per
  destination. "Term sheet in hand" gets the spec's own **See your real number**; "not
  raising" gets **See how it would model**. For a founder already in diligence the pitch is
  also **hoisted** to the top of the system column — but only when the self-fix column has
  already cleared the two-free-fixes bar on its own, and only for the first pitch, so two
  never stack into the banner §4 forbids.
- **The two-free-fixes rule is enforced in code, not in review.** Every placement carries
  `freeStepsBefore`, and `pitch.test.ts` asserts it never drops below
  `MIN_FREE_STEPS_BEFORE_PITCH` across **every fixture crossed with every raise timing**
  (44 cases). The render test independently checks document order: it counts how many free
  steps actually appear above the pitch in the emitted HTML. A results page whose only
  flags are founder-owned — vesting, ROC, or both — shows **no pitch at all**, because the
  fixes were given away and there is nothing left to sell.
- **Cross-links, only when the flag that justifies them fired.** Instruments → Funding
  Round Simulator; ESOP pool → ESOP Tax Calculator; valuation → Valuation Calculator. Each
  card says why it is on the page, from the answers ("You have SAFEs and CCPS outstanding").
  A clean result shows none.
- **Email capture with no wall.** Last section on the page, after everything is readable;
  nothing above it is hidden, blurred or gated. Validates, fires `email_submitted`, and
  **posts nowhere** — see the launch blocker below.
- **Analytics.** All seven events (`tool_started`, `question_answered`, `results_viewed`,
  `pitch_shown`, `pitch_clicked`, `email_submitted`, `crosslink_clicked`) behind one
  swappable adapter in `src/lib/analytics.ts`. The v1 adapter writes to the console;
  switching to Plausible / PostHog / GA4 is one `setAnalyticsAdapter` call and no change to
  any call site. No event carries an answer verbatim and `email_submitted` carries no
  address.
- **The three Step 5 placeholders are gone**, replaced by real surfaces. A test asserts the
  words "Step 6" and "placeholder" no longer appear on the page.
- 375 tests pass; `npm run lint` clean; `npm run build` prerenders all four routes.

**Files created/changed:**
- Created: `src/lib/brand.ts`, `src/lib/analytics.ts`, `src/lib/pitch.ts`,
  `src/lib/pitch.test.ts`, `src/app/tools/diligence-readiness/conversion.tsx`.
- Changed: `src/lib/results.ts` (exposes `urgency`, `totalDelayWeeks` and `conversion`),
  `src/app/tools/diligence-readiness/results-screen.tsx` (interleaves pitches into the
  split, adds cross-links and email capture, fires `results_viewed`),
  `src/app/tools/diligence-readiness/question-flow.tsx` (fires `tool_started` and
  `question_answered`), `src/lib/results.test.ts` (copy rules now cover the pitch strings),
  `src/app/tools/diligence-readiness/results-screen.test.tsx`, `LOG.md`.
- Still no backend, no persistence, no network call, no AI call, no score, no wall.

**Known gaps / TODO:**
- **LAUNCH BLOCKER — the email form posts nowhere.** It validates the address, logs the
  intent, then discards it, while telling the founder "this register is queued for
  you@company.com". In development an extra line says no endpoint is wired; in production
  that line is compiled out, so the page would be making a promise it cannot keep. Wire an
  endpoint or remove the form. See open question 5.
- **LAUNCH BLOCKER — all five outbound URLs are `#`.** `OUTBOUND_URLS` in
  `src/lib/brand.ts`; `hasPlaceholderUrls()` is there for a pre-launch check. Every CTA on
  the page currently goes nowhere. See open question 7.
- **Still nobody has looked at this in a browser.** The Chrome extension was not connected
  in Step 5 and is not connected now. Verification remains structural: server-rendered
  markup for every fixture, checked for section order, document order of the pitch relative
  to the free steps, type roles and copy. The pitch card's visual weight against the
  guidance cards around it is exactly the kind of thing this cannot check.
- The variant priority order is my judgement, not tested against real founders. The list is
  one readable array in `pitch.ts` — reordering it is a one-line change.
- Delay ranges are still uncalibrated (open question 2), so the week counts inside the
  pitch inherit that.
- No analytics provider chosen (open question 8) — events fire into the console today.
- `.text-gradient` still has no `forced-colors` fallback; `/styleguide` still has to be
  deleted before launch.

**Next step:**
**Step 7 — pre-launch.** In rough order: open the tool in a browser and look at all six
fixtures; get the five real URLs and the email endpoint (or drop the form); choose an
analytics provider and write the adapter; calibrate the delay ranges from Incentiv's book;
have a CA or CS read `src/lib/guidance.ts` end to end; delete `src/app/styleguide/`; and
settle the deployment shape (open question 4).


### Step 7 — Responsive, dark mode, motion, accessibility, metadata — 2026-09-04

**Someone finally looked at it.** The Chrome extension was still not connected, so a CDP
screenshot harness was driven against the dev server instead: headless Chrome over the
DevTools protocol, walking the real client flow (start → eight answers → register) and
capturing at 375 / 768 / 1280 in both themes, plus a scripted audit that walks every text
node in the rendered page and computes actual contrast ratios against actual composited
backgrounds. Everything below was verified against a rendering engine, not against
markup. The harness lives in the session scratchpad, not the repo.

**Done:**

- **Responsive pass — 375 / 768 / 1280, both themes.** Zero horizontal overflow at every
  width, measured rather than eyeballed. The results page was the hard one and got the
  real work: on mobile each flag card's severity rail was three stacked blocks — badge,
  then weeks, then who fixes it — which on a seven-flag register cost about 340px of
  scrolling. It is now a wrapped row under the finding, and becomes the right-hand rail
  from 640px up. The cross-border fixture at 375 went from 11,948px to 11,606px.
- **Every screen now shares one column.** The intro, the questions, the register and the
  new header all sit in `container-full` on the same `max-w-5xl` measure, so the animated
  page-edge rules read as the margins of one document. Before this, on a 1280px screen
  the header would have started at 64px and the question at 296px, with the edge lines
  relating to neither — the rules were drawn, but nothing was drawn to them.
- **Dark mode, wired and reachable.** DESIGN.md's dark palette has existed since Step 2
  and nothing in the product turned it on. There is now an explicit toggle in the tool
  header, remembered in `localStorage` under `incentiv-theme`, applied before first paint
  by a blocking inline script so a returning visitor never sees a cream flash. It
  deliberately does not follow `prefers-color-scheme` — see the decisions table. Verified
  end to end in a browser: class, `aria-pressed`, label, page background and stored value
  all flip both ways, survive a reload, and produce no console warning and no hydration
  mismatch. Three dark-mode corrections were needed where the light treatment carried no
  information: `.card-raised`'s soft black shadow (replaced with the luminance stepping
  DESIGN.md §6 specifies), the background grid's alphas, and the Blocker badge's 5% red
  wash.
- **Motion.** One move — an 8px rise plus a fade — used twice: questions replay it on
  every change of question, and the register staggers it across flag, guidance and
  cross-link cards at 55ms, capped at eight so the last card is never left waiting. Under
  `prefers-reduced-motion` all 17 cards were confirmed at opacity 1 with an identity
  transform, and the edge-line scan parked. The reduced-motion block now also zeroes
  `animation-delay` — without that a staggered card stayed invisible for its delay and
  then popped, which is worse than the animation it replaced.
- **Accessibility.**
  - Question groups are now a real `<fieldset>` whose `<legend>` contains the `<h1>`, so
    the prompt is both the group's accessible name and a document heading. The previous
    sr-only legend duplicated the visible prompt.
  - The results headline is a polite live region **and** takes focus on mount. The
    register replaces the last question in place with no navigation, so without both,
    nothing tells a screen-reader user that eight answers became a result.
  - The progress track announces each advance, including the 200ms auto-advance.
  - Focus rings: the answer options' focus state was a 3px ring at 10% alpha around a
    `sr-only` input — effectively invisible. It is now a 2px solid ring at 2px offset.
  - **Contrast, measured in both themes at three widths: zero AA failures.** Getting
    there took two token additions, both in the decisions table — brand blue is 3.0:1 as
    text on cream and 3.35:1 behind white button text. The primary CTA failing AA in both
    themes was the most serious single finding of this pass.
  - Severity never rides on colour: each badge already carried a written label, and now
    also a distinct marker shape — filled disc, open ring, short bar.
  - Tap targets: inline `.cta-arrow` links were 21px tall. They now carry an invisible
    `::after` that grows the hit area to about 45px without moving anything on the page;
    confirmed with `elementFromPoint` at 10px above and below the text box.
  - `.text-gradient` finally has its `forced-colors` fallback (old open question 20), so
    the page's most important element no longer vanishes in Windows High Contrast mode.
- **Loading, empty and error states.** `loading.tsx` draws the intro screen's skeleton
  rather than a spinner — the tool is client-side, and on a slow mobile connection this
  is a real state. `error.tsx` is a route boundary that says plainly that nothing was
  sent or saved, and offers a retry (Next 16 passes `retry`, not `reset`).
  `not-found.tsx` is an in-brand 404. The flow also gained a recoverable screen for the
  theoretically unreachable case where it completes without eight answers, instead of
  silently falling through to question one. The empty state was already the clean-result
  screen; it was re-checked at 375 and in dark.
- **Metadata and the social card.** `metadataBase`, a title template, description,
  keywords, canonical, robots, Open Graph and Twitter card, plus `themeColor` for both
  themes. The card is generated at build by `next/og` at the app root, so every route
  inherits it, and it is built from the real design system: warm cream ground, the blue
  edge rules, DM Serif Display italic for the headline with the blue→terracotta gradient
  on the second line, Inter for the label, IBM Plex Mono for
  `8 questions · 90 seconds · free, no signup`. The first render clipped the gradient
  line — satori shrinks flex children before it wraps them — which is why that line is
  now a single span with `flexShrink: 0`.
- **`/styleguide` is deleted**, as Step 2 said it must be. The home page linked to it and
  now points at the tool.
- **A latent clipping bug removed.** The tool's `<main>` carried `overflow-hidden` while
  being a `flex-1` child, which zeroes a flex item's automatic minimum size. Nothing
  needed the clip, and the 8,400px results page is exactly the sort of content it would
  eventually have eaten.
- Verified: 375 tests pass, `npm run lint` is clean, and `npm run build` prerenders all
  five routes including both image routes.

**Files created/changed:**
- Created: `src/lib/theme.ts`, `src/components/layout/theme-toggle.tsx`,
  `src/components/layout/tool-header.tsx`, `src/app/opengraph-image.tsx`,
  `src/app/twitter-image.tsx`, `src/app/not-found.tsx`,
  `src/app/tools/diligence-readiness/loading.tsx`,
  `src/app/tools/diligence-readiness/error.tsx`, `src/assets/fonts/` (four WOFF files).
- Changed: `src/app/globals.css` (contrast tokens, `color-scheme`, focus rings, severity
  shapes, forced-colors fallback, motion and skeleton layers, dark-mode corrections),
  `src/app/layout.tsx` (metadata, viewport, theme script), `src/app/page.tsx`,
  `src/app/tools/diligence-readiness/{page,question-flow,results-screen,conversion}.tsx`,
  `src/components/ui/{badge,progress-bar}.tsx`, `src/lib/brand.ts` (site identity),
  `CLAUDE.md`, `LOG.md`.
- Deleted: `src/app/styleguide/`.
- Still no backend, no persistence of any answer, no network call, no AI call, no score,
  no wall. The only thing stored anywhere is the word "light" or "dark".

**Known gaps / TODO:**
- **The two launch blockers from Step 6 are untouched and still block launch**: the email
  form posts nowhere, and all five outbound URLs are `#`. Open questions 5 and 7.
- **`loading.tsx` and `error.tsx` were verified by build and by reading, not by eye.**
  Both need a deliberate trigger — a throttled connection, a thrown error — that this
  pass did not set up. The 404 and every other screen were rendered and looked at.
- The primary button is no longer exactly `#3482ff`. It is a deliberate, measured,
  one-line-revertible deviation, but it is a deviation — see open question 26.
- The OG card's copy is my drafting and has had no marketing review. It is the first
  thing anyone sees when this is forwarded, which is the whole point of the tool.
- `SITE_URL` defaults to `https://incentiv.finance` and is overridable with
  `NEXT_PUBLIC_SITE_URL`. If the deployment shape (open question 4) puts the tool
  somewhere else, the OG image URL and the canonical will be wrong until that is set.
- `public/` still holds the four unreferenced create-next-app SVGs, and `favicon.ico` is
  still Next's. Open question 15.
- Delay ranges are still uncalibrated (open question 2), and no analytics provider is
  chosen (open question 8).

**Next step:**
**The remaining work is not code.** In rough order: get the five real URLs and an email
endpoint, or drop the form; choose an analytics provider; calibrate the delay ranges from
Incentiv's book; have a CA or CS read `src/lib/guidance.ts` end to end; get the OG card
copy and the overall tone reviewed; supply the favicon and brand assets; and settle the
deployment shape. Open questions 2, 4, 5, 7, 8, 9, 15, 16 and 26.

### Step 8 — Final verification, fixture calibration and handoff — 2026-09-04

**Status: MVP CODE COMPLETE · NOT LAUNCH-READY.** The requested product is implemented,
tested and documented. The remaining blockers require Incentiv data, destinations, provider
choices or human sign-off; they were reported rather than silently guessed or removed.

**Six-scenario end-to-end report:**

| Fixture | Flags fired | Delay at close | Pitch variant(s) |
|---|---|---:|---|
| Diligence-ready Series A | 0 — none | 0 weeks | `clean-state` |
| Bootstrapped first raise | 4 — cap-table source, no approved ESOP pool, founder vesting, ROC filings | 3–6 weeks | `roc-reconciliation` |
| Instrument-heavy seed | 3 — cap-table source, unmodelled instruments, founder vesting | 2–4 weeks | `cap-table-conversion` |
| Foreign angel, live round | 4 — foreign-capital filings, cap-table source, ROC filings, valuation report | 4–8 weeks | `roc-reconciliation`, `advisory-filings` |
| Departed cofounder | 1 — departed-founder equity | 4–8 weeks | `ownership-cleanup` |
| Cross-border complexity | 7 — unknown instruments, Press Note 3, cap-table source, over-granted ESOP pool, founder vesting, ROC filings, valuation report | Indefinite | `instruments-unknown`, `advisory-filings` |

The sorted flag counts are 0, 1, 3, 4, 4 and 7, so the fixture median is **3.5**.
Against the product premise that a representative early-stage Indian company genuinely has
3–5 issues, the trigger rules are **about right directionally** — neither decorative nor
obviously punitive. This validates issue-count calibration only. The week estimates remain
placeholders, and the six deliberately varied fixtures are not a substitute for a real-user
distribution.

**Verification:**

- All six typed fixtures were run through `evaluate()` and `buildResults()`. The live browser
  flow was also completed from intro through all eight answers to the rendered register; the
  inspected four-flag result matched 4–8 weeks and both expected pitches. Browser console:
  zero warnings or errors.
- Copy audit passed: no 0–100 score is rendered or calculated; no accusatory compliance
  language or funding guarantee is present; every finding includes the triggering answer;
  urgency, clean-state confirmations, guidance and pitch selection are all derived from the
  submitted answers or fixed explanatory boilerplate.
- Architecture audit passed: no backend, authentication, database, AI call or upload path.
  Founder answers remain in React state. `localStorage` holds only the light/dark preference.
- `npm run test`: **375/375 passed**. `npm run lint`: **clean**. `npm run build`:
  **passed**, with all five routes prerendered. Nothing failed, so no product code was changed
  during this pass.
- Replaced the scaffold `README.md` with the run guide, architecture map, question/rule edit
  instructions and a prominent **do not launch** warning for every `// CALIBRATE` delay.

**Known gaps and launch blockers (complete current list):**

1. All 11 delay ranges are advisory placeholders; Press Note 3 is intentionally indefinite.
2. The email form validates and claims the register is queued, but posts nowhere.
3. All five outbound CTA destinations in `src/lib/brand.ts` are `#`.
4. `src/lib/guidance.ts`, Press Note 3 wording and the full results tone need CA/CS/legal review.
5. Analytics uses a console adapter; no production provider is chosen.
6. Deployment shape is unsettled; `NEXT_PUBLIC_SITE_URL` must match the final origin.
7. The final public tool name is not confirmed.
8. The default Next favicon and four unused starter SVGs remain; brand assets are missing.
9. Open Graph card copy has not had marketing review.
10. Route loading and error boundaries compile but have not been visually forced in a browser.
11. Accessible button/label blues intentionally deviate from the raw brand blue and await approval.
12. Only two flags are formally founder/CA-CS-owned, although every flag includes a free first move.
13. The fully parallel delay model cannot reproduce the spec's illustrative 5–9-week example.
14. Pitch priority, the no-pitch self-fix-only path, Advisory destination and impression semantics
    remain product/analytics judgement calls.
15. Dark mode defaults to light with an explicit saved toggle rather than following the OS.
16. `DESIGN.md` still says the cap-table product is Equity, while the confirmed product is Tabulate,
    and contains unresolved colour-token inconsistencies.
17. Two ignored Word lock files remain in the project root and should only be removed after their
    source documents are closed.

**Files changed in Step 8:** `README.md`, `LOG.md`. A temporary fixture-report test was created
to print the deterministic scenario matrix and then removed; it leaves no repository artifact.

### Step 9 — Layout, alignment and type-scale pass — 2026-09-04

**No new features.** A pure layout, alignment, spacing and typography pass, run as the
UI designer. Every claim below was measured in a real rendering engine — headless Chrome
over CDP, walking the live client flow (intro → eight answers → register) at 375 / 768 /
1280 / 1600 in both themes, reading `getBoundingClientRect()` and `getComputedStyle()` off
the composited page. The harness lives in the session scratchpad, not the repo.

**What was actually wrong — diagnosed before anything was changed:**

| Symptom | Real cause |
|---|---|
| Header wordmark not on the content's left rail; "clipped" at the viewport edge | `-mx-2` on the wordmark `<Link>` (and `-ml-2` on the question screen's Back button). At 375px the content rail is 24px and the wordmark box started at **16px** — 8px *outside* the container, sitting exactly on the page-edge rule. It was never a container wider than the viewport: measured `scrollWidth === clientWidth` at all four widths, before and after. |
| Content floating upper-left with a large dead zone on the right | Three nested max-widths: `.container-full` (1312/64) → `max-w-5xl` (1024) → `max-w-3xl` (768). At 1600px the intro copy occupied 768 of 1600px, starting at x=288 and ending at x=1056. |
| The page-edge rules relating to nothing | They were drawn at the 1312px container while content sat on a 1024px column: 112px apart at 1280, 144px apart at 1600. |

**Done:**

- **One container, one left rail.** `.container-tool` — max-width **1120px**, centred,
  **24px** padding mobile / **40px** from 1024px up — is now the only layout container.
  `.container-full`, `.container-narrow` and `.container-wide` are gone, and nothing nests a
  second max-width inside it. The header, all six screens (intro, question, register, clean
  state, 404, error), the loading skeleton and the home footer all use it and nothing else.
  Measured left rail, every screen, every width: **375 → 24 · 768 → 24 · 1280 → 120 ·
  1600 → 280**, identical across intro, question and results. Zero horizontal overflow.
- **The wordmark bug is fixed at the cause.** The negative margins are gone, and
  `.btn-ghost` now carries `padding-inline: 0` so a ghost button's *label* starts on the
  rail rather than its invisible box. The 44px touch target moved to `min-height` on `.btn`.
- **Page-edge rules redrawn to the container.** `max(16px, calc((100% - 70rem) / 2))`,
  measured against the fixed parent rather than `100vw` — `vw` includes the scrollbar and
  would push both rules off the real container edges. They now land at 80px (1280) and
  240px (1600), i.e. exactly the container's outer edge, one 40px gutter outside the text.
- **Measure caps.** `.measure-copy` (64ch) on all body and subheading copy;
  `.measure-answers` (560px) on the answer rows — they were running the full 768–1040px
  column; `.measure-card` (704px = the 64ch measure plus a card's 24px padding on each
  side) on the prose-only guidance and pitch cards, which were 1040px boxes holding 645px
  of text. Flag cards are deliberately exempt: they carry a second column (the severity
  rail), so they earn the full width.
- **Spacing scale — 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96.** Every margin, padding and
  gap in `src/` now snaps to it; verified by enumerating every spacing utility in every
  `.tsx` (the surviving set is exactly `1 2 3 4 6 8 12 16 24` plus `0`) and by grepping for
  arbitrary values, of which there are none. Casualties: `p-5`, `gap-3.5`, `mt-0.5`,
  `gap-x-10`, `mt-10`, `py-3.5`, `sm:mt-7`, `sm:w-52`.
- **Type scale, seven roles and no others.** display 56/60 · h1 40/44 · h2 28/34 ·
  h3 20/28 · body 16/26 · small 14/22 · mono-label 12/16 @ 0.08em uppercase. DM Serif
  Display italic for display/h1/h2, Inter for h3 and below, IBM Plex Mono 300 for every
  numeral, week count and eyebrow. Those are the >=1024px values; the smaller steps keep
  the same ratio via unitless line-heights. `.heading-h1`, `.text-small` and `.mono-label`
  are new; `.text-body-lg` and `.text-nav` are gone, because the scale has no such roles.
  The question prompt moved up from h2 to **h1**, which is what it always was semantically.
- **Header and subheading on one line.** The intro subheading was three lines of
  `TOOL_DESCRIPTION` — the metadata sentence, doing a job it was never written for. New
  `TOOL_SUBHEAD` and `TOOL_STAT_LINE` in `brand.ts`. Measured: h1 and subheading are
  **one line each at 768, 1280 and 1600**; at 375 the h1 takes two and the subheading
  takes exactly two, which is the stated mobile budget.
- **A real optical centre for the intro.** Committed to *centre the column* rather than to
  a two-column layout — a deliberate right-hand panel would have been a new feature, and
  the register below needs the full measure anyway. The column is centred and the intro is
  vertically centred in the viewport; the dead zone is closed by a stat-line/CTA row that
  spans the whole column above a hairline, so the measure reads as occupied instead of
  abandoned. The same treatment is on the home page. The loading skeleton was redrawn to
  match the new intro shape so nothing jumps when the real screen lands.
  The **question** screen stays top-aligned on purpose: vertically centring it would make
  the progress bar jump between questions with different option counts.

**Verified:** `npm run test` **375/375**, `npm run lint` clean, `npm run build` passed with
all five routes prerendered. Twelve screenshots (intro / question / results × 375 / 768 /
1280 / 1600) plus dark mode at 1280 and the home and 404 screens were captured and read.
Nothing in `src/lib/` was touched except the two new `brand.ts` strings, so no scoring,
flag, guidance or pitch behaviour changed.

**Decisions made:**

| Decision | Choice | Why |
|---|---|---|
| Container width | **1120px**, 24/40 padding | Per the human's brief. Narrower than DESIGN.md's 1312/64 marketing container because this is a single reading column, not a multi-column marketing page. |
| Intro layout | Centre the column; no right-hand panel | The brief offered either. A deliberate right-hand panel is a new feature, and this step is explicitly not one. |
| Section rhythm | 48px mobile / 96px desktop | DESIGN.md's 40/80 are **not on the new spacing scale**. 48/96 are the nearest values that are, and they step in the same direction as DESIGN.md's intent. |
| `.section-label` | IBM Plex Mono 300 / 12px / 0.08em | The brief assigns eyebrow labels to Plex Mono 300 and defines the mono-label role as 12/16 @ 0.08em uppercase. This **overrides** DESIGN.md §3 and CLAUDE.md, both of which call Inter 700 / 10px / 0.15em non-negotiable. Brand blue is kept. See open question 1. |
| Ghost button padding | `padding-inline: 0` | A ghost button has no visible box, so its label — not its padding edge — is what a reader sees as the first character on the line. It has to start on the rail. |
| Edge-rule alignment | The container's own edge, via `%` of the fixed parent | 1312 vs a 1024 column meant the rules framed nothing. `%` rather than `vw` because `vw` includes the scrollbar. |
| Prose cards capped, flag cards not | `.measure-card` 704px | "Nothing stretches the full container just because it can" — but a flag card has a real second column, so its width is earned. |
| Results headline left at two lines | Copy is spec-fixed | See known gaps, below. |

**Known gaps and TODO:**

1. **The results headline is the one heading that exceeds a line on desktop** — two lines of
   56px display type at 1280 and 1600. Its copy is fixed by `tool-spec-v1.md` and
   `CLAUDE.md` (`N issues found · X–Y weeks of delay at close`), and the Press Note 3
   variant ("…plus an approval that runs on its own clock") can never fit one line at any
   sane display size. Deleting the word "estimated" in `results.ts` would bring the common
   case to one line and move the copy *closer* to the canonical form — but it is product
   copy with test coverage and tone implications, so it was not changed unilaterally.
   See open question 2.
2. `DESIGN.md` and the design-constraints block in `CLAUDE.md` now disagree with the code on
   container width, container padding, section padding, the `.section-label` role, the
   `.heading-hero`/`.heading-section` size ramps and the badge text size. `CLAUDE.md` carries
   a pointer to this step; `DESIGN.md` has not been edited, because it is the human's
   source-of-truth document.
3. The page-edge rules fall back to their 16px floor below ~1184px viewport width, so at
   375 and 768 they sit 8px *inside* the 24px content gutter rather than on the container
   edge. That floor is DESIGN.md's own formula and was left alone.
4. Everything on the Step 8 blocker list is untouched and still blocks launch — delay
   ranges, the email endpoint, the five outbound URLs, CA/CS sign-off, analytics provider,
   deployment origin, the final tool name and the brand assets.

**Files changed in Step 9:** `src/app/globals.css`, `src/lib/brand.ts`,
`src/components/layout/tool-header.tsx`, `src/components/ui/progress-bar.tsx`,
`src/app/page.tsx`, `src/app/not-found.tsx`,
`src/app/tools/diligence-readiness/{question-flow,results-screen,conversion,loading,error}.tsx`,
`CLAUDE.md` (design-constraints pointer), `LOG.md`. No files created, none deleted.

**Next step:** answer open questions 1 and 2 — they are both one-line decisions that this
pass deliberately did not make alone — then resume the Step 8 launch-blocker list.

### Step 10 — Two questions per screen — 2026-09-05

The flow is now **4 screens of 2 thematically paired questions**, not 8 screens of one.
Nothing about what is asked changed: `questions.ts`, `flags.ts` and `evaluate.ts` were not
touched (verified by mtime — every file in `src/lib/` still carries its Step 3–6 timestamp),
the engine still takes all eight answers, and the Step 3 unit suite and six fixture
scenarios pass untouched. This step changed only how the eight are **grouped on screen**.

**The pairing**, held in a new presentation-only module so `questions.ts` stays a flat list
of eight:

| Screen | Label | Questions |
|---|---|---|
| 1 | Ownership record | Q1 cap table location · Q2 outstanding instruments |
| 2 | Equity structure | Q3 ESOP pool · Q4 founder vesting |
| 3 | Compliance | Q5 ROC / MCA filings · Q6 foreign shareholders |
| 4 | Valuation & timing | Q7 valuation basis · Q8 raise timing |

**Done:**

- **`screens.ts` is the grouping, and only the grouping.** It maps each screen to two
  question ids and a short noun phrase per question ("where your cap table lives"), looks
  the real definitions up out of `QUESTIONS`, and **throws at module load** if the plan does
  not cover all eight exactly once — so a future edit to `questions.ts` that the plan does
  not follow fails the build rather than silently never asking a question. It also exports
  `questionNumber()`, the 1-based position in `QUESTIONS`, so the `question_answered`
  analytics event still carries 1…8 and the completion funnel reads exactly as before.
- **Two equal columns from 1024px, stacked below it.** Measured in headless Chrome over
  CDP at 375 / 768 / 1280 / 1600 in both themes: at 1280 the columns are **520 + 520**
  starting at x=120 and x=640; at 1600, 520 + 520 at x=280 and x=800. Tops aligned to the
  pixel (both fieldsets y=352). Below 1024 they stack with a **48px** gap — measured
  677→725 at 375 and 678→726 at 768. Zero horizontal overflow at every width.
- **The pair reads as one grid.** A hairline under the screen label, a hairline between the
  columns, meeting in a T. The column top padding sits on the column wrapper rather than on
  the grid, so the vertical rule starts *at* the horizontal one instead of 48px below it.
  The rule is `border-l` on the second column inside a zero-gap grid, giving a 64px gutter
  with the hairline centred in it.
- **Question prompts dropped from h1 to h2** (`.heading-section`, 28/34 at ≥1024). Two
  display-size headings on one page would fight; the screen's label is the h1 now.
- **Section label above the pair**, as the `<h1>`: `SectionLabel` gained `"h1"` in its `as`
  union. So every question screen still has exactly one h1, and a screen-reader user hears
  "Ownership record, heading level 1" followed by two level-2 questions.
- **Progress is "1 of 4"** over a 4-step track, and the live announcement is now
  `Step 2 of 4: Equity structure` — it names the section rather than just counting.
- **Auto-advance waits for both answers, then 300ms.** It fires only on screens where both
  questions are single-select, so **screen 1 never auto-advances** — Q2's multi-select
  cannot tell "still choosing" from "done choosing". Verified: after two single answers the
  screen is still in place at 150ms and has moved on by 550ms; on screen 1, 800ms after
  answering both, it has not moved.
- **A visible Continue on every screen**, disabled until both are answered, and the only way
  off screen 1. On screen 4 it reads **"See my results"**. Beside it, a quiet inline hint
  names what is still open — *"Still to answer: your ESOP pool and founder vesting."*, and
  narrows to the one remaining question as the first is answered.
- **Keyboard.** Arrow keys are scoped to the question they are in (via a
  `[data-question-group]` wrapper and `closest()`) instead of cycling all sixteen options on
  the screen; Tab moves between the two groups; Enter selects; Esc goes back a screen — the
  screen is the unit now, so Esc returns to the previous pair, not the previous question.
  Verified: focus starts in group 0, ArrowDown moves to option 1 of group 0, Tab lands in
  group 1. Q2's six checkboxes carry a **roving tab stop** (the first checked, else the
  first option) so the pair behaves symmetrically — one Tab stop per question, not one per
  checkbox. See open question 7.
- **Both option lists start on the same y.** `.question-prompt` reserves two lines of its own
  leading at ≥1024px, so the pair does not drift apart when one prompt wraps and the other
  does not (which is exactly screen 3: "ROC / MCA filings:" against "Foreign shareholders or
  foreign capital?"). On screens that carry a multi-select, the helper line is reserved in
  both columns for the same reason. Measured option-list tops: 486/486 on screen 1, 452/452
  on screen 2. Neither reservation applies below 1024, where there is nothing to align to.

**Verified:** `npm run test` **375/375**, `npm run lint` clean, `npm run build` passed with
all five routes prerendered. A full pass through the flow in headless Chrome ends on the
real register — *"1 issue found · estimated 3–4 weeks of delay at close"* — so the engine is
demonstrably reading all eight answers through the new grouping. Screenshots read at 375 /
768 / 1280 / 1600 plus dark mode at 1280.

**Decisions made:**

| Decision | Choice | Why |
|---|---|---|
| Where the pairing lives | New `screens.ts` beside the flow, not in `questions.ts` | The brief froze the data layer. Which questions appear together is a screen concern, and keeping it out means `questions.ts` stays a flat list of eight that the engine and the tests read unchanged. |
| Plan/question mismatch | Throws at module load | A missing question would otherwise be invisible until the completeness gate failed on the way to the results. This fails the build instead. |
| The screen label is the `<h1>` | `SectionLabel as="h1"` | One h1 per screen, as before. The label is the screen's title even though it is set at eyebrow size — semantics are not size. |
| The header row's "Diligence check" label | Removed | With a blue mono label above the pair, a second one 100px above it was noise. The wordmark in `ToolHeader` already says which tool this is. |
| Column gutter | 64px, hairline centred | 32px of padding either side of the rule. 40px would have been off the Step 9 spacing scale. |
| Prompt reserves two lines at ≥1024 | `.question-prompt { min-height: 2lh }` | One deterministic rule aligns the answer rows on all four screens. Cost: ~34px of white space on the two screens whose prompts are both one line. See known gaps. |
| Column padding on a wrapper, not the fieldset | Wrapper `<div>` | A `<legend>` is laid out against the fieldset's *border* box and ignores its padding — padding on the fieldset pushed the options down while leaving the prompt sitting on the rule. Caught in the browser, not in review. |
| Final screen's button | "See my results" | Continue is now always visible, so the last screen has to say where it goes. |
| Multi-select analytics | Reported on leaving the screen | Unchanged in spirit from Step 4 — a multi-select cannot report itself on click. `questionNumber` still comes from `QUESTIONS`, so the event stream is identical to the 8-screen flow. |

**Known gaps and TODO:**

1. **The two-line prompt reservation costs white space on screens 2 and 4**, where both
   prompts are one line and 34px sits empty under each. The alternative that costs nothing —
   a CSS subgrid row shared by both columns — needs the prompt and the options to be
   siblings, which means dropping `<fieldset>`/`<legend>` for `role="group"` +
   `aria-labelledby`. That trades a stronger native semantic for a layout nicety, so it was
   not done unilaterally.
2. **Q2's roving tab stop removes its checkboxes from individual Tab order.** Arrow keys
   move within the group and the on-screen hint says so, and screen readers in browse mode
   are unaffected — but a Tab-only user now reaches options 2–6 with arrows rather than Tab.
   See open question 7.
3. The keyboard hint line is still `hidden sm:block`, so the arrow/Tab affordance is not
   announced on mobile. That is unchanged from Step 9 and correct for touch, but it is the
   only place the roving behaviour is explained.
4. `tool-spec-v1.md` describes the tool as eight questions and says nothing about how they
   are laid out, so nothing there contradicts this step. `BUILD-PROMPTS-PHASE2.md` Step 10
   is now implemented.
5. Everything on the Step 8/9 blocker list is untouched and still blocks launch.

**Files created in Step 10:** `src/app/tools/diligence-readiness/screens.ts`.
**Files changed in Step 10:** `src/app/tools/diligence-readiness/question-flow.tsx`,
`src/app/globals.css` (`.question-prompt`), `src/components/ui/section-label.tsx`
(`as="h1"`), `LOG.md`. None deleted. Nothing in `src/lib/` touched.

**Next step:** Step 11 — results redesign and the visuals. Open questions 1–3 from Step 9
are still unanswered and are still one-line decisions.

### Step 11 — The lead gate on the results page — 2026-09-05

**This is `BUILD-PROMPTS-PHASE2.md` STEP 12, built before STEP 11.** The human asked for
the gate directly, so the results redesign (the close timeline and the readiness map) is
still outstanding. That matters here because the brief's "what stays free" list names three
things — the hero figure, the close timeline, the readiness map — and only the hero figure
exists today. The free region is therefore the headline block plus the first two findings,
and the gated region begins straight after them. When STEP 11 lands, the timeline and the
map go into the free block above the gate; nothing about the gate needs to change to allow
it. See known gaps.

**What is free, and always will be:** the section label, the headline (issue count and
delay range), the subline, the severity/urgency lines, and the **first two findings in
full** — the answer they trace back to, the "why an investor asks", the severity, the week
count and who fixes it. That block stands on its own and is what a founder screenshots.

**What is gated:** every remaining finding, both halves of the split (all self-fix
guidance *and* the "needs a system" column with its CTAs), and the cross-links.

**Done:**

- **A real blur over real content.** The gated markup is the actual report — every guidance
  step is in the DOM, blurred, never swapped for placeholder text. `filter: blur(6px)`,
  `opacity: .55`, `user-select: none`, `pointer-events: none`, `aria-hidden` and `inert`.
  Measured in headless Chrome: fourteen consecutive Tab presses from the headline never put
  focus inside the blurred region — the tab stops are the two gate fields, the submit
  button, then Review/Start over and the header.
- **A gradient scrim** at the top of the region, a sibling of the blurred element rather
  than a child (a scrim inside the blur would itself be blurred), fading from the page
  background down to transparent over 128px so the boundary between sharp and blurred is
  not a hard line. A matching 160px fade closes the bottom.
- **The region is capped** at 50rem mobile / 52rem desktop with `overflow: hidden`.
  Uncapped, a locked page ran **8,093px**, nearly all of it blurred — slow to composite on a
  mid-range Android and pointless to scroll. Capped it is **2,604px** at 1280 and 2,662px at
  375, with roughly 250px of legible blur below the card.
- **The gate card is inline, never a modal.** It is absolutely positioned inside the blurred
  region, 704px (`measure-card`) on the container's own left rail, so the blur stays visible
  to its right and below it. Nothing is `fixed`, `sticky` or `inset-0`; there is no dialog
  role, no backdrop and no scroll lock. §4's "Never a banner ad" applies to the gate as much
  as to the pitch, and a test asserts it.
- **Two fields, and nothing else.** Name and Work email. No company, no phone, no role.
  Heading "Unlock the full register", button "Send me the full report", trust line "One
  email with your report. Nothing else."
- **Work-email validation, friendly rather than scolding.** Two lists, because the two kinds
  of match are different: 15 provider names matched on the domain's **first label**, so
  every country variant is covered without enumerating them (yahoo.co.in, hotmail.co.uk,
  outlook.in, yandex.ru, zoho.in), plus three **whole-domain** entries (me.com, mail.com,
  proton.me) whose names are ordinary words. That split is what lets `mail.acme.com` and
  `me.acme.com` through — a company's own mail host is not a free provider. `rediffmail` is
  on the list because this is India. Rejection reads *"Please use your work email — that's
  where the report goes."*
- **Unlock.** 400ms ease on `filter` and `opacity`; under `prefers-reduced-motion: reduce`
  the transition is removed and it is a plain state change (verified with the media feature
  emulated: `filter` was already `none` 60ms after submit). The card is removed, `inert` and
  `aria-hidden` come off, the height cap is dropped, and a `role="status"` confirmation
  naming the address appears above the region.
- **Persistence.** `localStorage["incentiv-report-unlocked"] = "1"`, and nothing else — no
  name, no address, no answers. Every read and write is wrapped in `try/catch` behind a
  `typeof window` guard, and both a throwing store and an absent one read as *locked*, which
  is the safe direction. Verified: re-answering after a reload lands on an ungated register.
- **`src/lib/leads.ts` — one swappable adapter.** `submitLead()` never rejects and the
  default adapter writes to the console. The payload carries the flag ids, counts and delay
  range rather than the answer sheet: a real endpoint can rebuild the report from the same
  rules table, so there is no reason to ship a founder's answers off the device.
- **Three analytics events** — `gate_shown` (with the number of findings behind the blur),
  `gate_submitted`, `gate_invalid_email` (the reason only). No event carries the name or the
  address, matching the existing rule for `email_submitted`.
- **The two copy fixes the brief asked for.** `TOOL_STAT_LINE` is now
  *"8 questions · 90 seconds · free · full report by email"* — the "nothing leaves your
  browser" claim is gone, because it stopped being true. `TOOL_DESCRIPTION` ends
  *"Free — the full report comes by email."* rather than "Free, no signup."
- **Two more of the same claim, found while there.** The social card hard-coded
  *"free, no signup"*; it now renders `TOOL_STAT_LINE`, so there is one string to change
  instead of two. The results page footer said *"Nothing you answered left your browser.
  This check is free, needs no account…"* — now *"This check is free, and you can run it
  again whenever something on your cap table changes."*
- **The old ungated email form now renders only in the clean state.** Its copy promises
  *"there is no wall, no account, and no step you have to complete to read your own
  results"* — true exactly where there is nothing to gate, and false everywhere else. A
  clean result is never gated (there is no depth to protect and "All 0 issues" is
  nonsense), so the form and its promise stay together and stay honest. `pitch.ts` carries
  a comment saying so.
- **`gateBody(1)` takes the singular.** The brief's sentence is "All {n} issues…"; at n=1
  that renders "All 1 issues" on the one surface that asks the founder for something. A
  single-flag result gets *"The 1 issue in full, the fix you can make yourself this week,
  and what it costs you at close."*
- **`HeadlineLine` moved to `segments.tsx`** and is now shared by the register headline, the
  split headings and the gate body, so there is one place that decides how a numeral is set
  (Plex Mono 300, upright). The gate's interpolated count goes through it.

**Verified:** `npm run test` **438/438** (46 new in `gate.test.ts`, 4 rewritten in
`results-screen.test.tsx`), `npm run lint` clean, `npm run build` green with all five routes
prerendered. In headless Chrome, on a six-flag result: the blur, the inertness, the tab
walk, all three validation paths (missing name, rediffmail, malformed), the unlock, the
console lead payload, the analytics events, the reload path, the clean-state path, the
single-flag path and reduced motion. Screenshots read at 1280 light, 1280 dark and 390.

**Decisions made:**

| Decision | Choice | Why |
|---|---|---|
| Clean results | **Never gated** | Nothing to protect, and the gate body would read "All 0 issues". The clean state keeps the optional capture. |
| The old bottom email form | Removed from every gated result | Two email asks on one page, one of which promised "no wall", directly under a wall. |
| Gate copy and validation | `src/lib/gate.ts`, a pure module | Same arrangement as `results.ts` and `pitch.ts` — the copy rules are then enforced by tests, not by review. |
| Free-provider matching | First label + whole domain, two lists | A single list of substrings would reject `mail.acme.com`, which is a company's own mail host. |
| Region height cap | 50rem / 52rem, `overflow: hidden` + bottom fade | 8,093px of blurred content is a compositing cost and a scroll trap. At 36rem the card filled the whole region on a phone and no blur was visible at all — the cap has a floor, not just a ceiling. |
| Scrim colour | `--background`, not `--surface` | The brief says "the surface colour"; the surface *behind the gate* is the page background. `--surface` would paint a warm-gray band across a cream page and read as a bug. |
| Persisted value | The single flag `"1"` | An email address in `localStorage` is a liability with no upside — the page never needs it again. |
| Lead payload | Flag ids and counts, not answers | A real endpoint can rebuild the report from the rules table. The answer sheet never has to leave the device. |
| Unlock on submit, not on delivery | Optimistic | `submitLead()` never rejects; taking the register back because a network call failed would be the worst of both worlds. |
| `inert` **and** `aria-hidden` | Both | `inert` does the focus and pointer work; `aria-hidden` is what the brief asked for and what older assistive tech reads. |

**Known gaps and TODO:**

1. **A client-side blur is inspectable.** The full report is in the DOM behind a CSS filter:
   devtools, "view source", reader mode or a script can read it without submitting anything.
   That is an **accepted trade for a v1 lead magnet** — the audience is founders, not
   adversaries, and the alternative costs the no-backend constraint. The fix, when it is
   worth it, is to serve the gated half from an endpoint *after* submit rather than render
   it and hide it: `buildResults()` already splits cleanly at the flag list, so the seam is
   `results.flags.slice(2)`, both `SplitColumn`s and `conversion.crossLinks`.
2. **The gate puts the two free fixes behind the email.** `CLAUDE.md` calls "give away at
   least two fixes the founder can do themselves, free, today, without Incentiv" a
   non-negotiable, and the brief explicitly gates all self-fix guidance. As shipped, the
   free half is the headline plus two complete findings, and the fixes arrive with the
   report. This is a deliberate product change, made on the human's instruction — see open
   question 5.
3. **The report is still never sent.** `leads.ts` posts nowhere, so the gate currently
   promises an email that will not arrive — the same launch blocker as the old form, now
   attached to a promise the founder paid for with an address. This is the single most
   urgent item on the list. Open question 4.
4. The free region is thinner than the brief intends until `BUILD-PROMPTS-PHASE2.md` STEP 11
   adds the close timeline and the readiness map. Both belong above the gate.
5. `gate_shown` fires twice in development. That is React Strict Mode double-invoking
   effects, the same as `results_viewed` and `pitch_shown`; it does not happen in a
   production build.
6. Everything on the Step 8/9 blocker list is untouched and still blocks launch.

**`CLAUDE.md` now carries a pointer.** Its product-constraints block still says
"No signup wall" and "Results are not gated", both marked non-negotiable. Those bullets are
the human's own text, so they were annotated rather than rewritten: a note at the top of the
block records that Step 11 superseded them on the human's instruction, says the code is
current where the two disagree, and points at open questions 4-6. The same note flags the
two-free-fixes tone constraint.

**Files created in Step 11:** `src/lib/gate.ts`, `src/lib/gate.test.ts`, `src/lib/leads.ts`,
`src/app/tools/diligence-readiness/segments.tsx`.
**Files changed in Step 11:** `src/app/tools/diligence-readiness/results-screen.tsx`,
`conversion.tsx`, `results-screen.test.tsx`, `src/app/globals.css`, `src/lib/analytics.ts`,
`src/lib/brand.ts`, `src/lib/pitch.ts` (comment only), `src/app/opengraph-image.tsx`,
`CLAUDE.md` (superseded-constraints pointer), `LOG.md`. None deleted. `questions.ts`, `flags.ts`, `evaluate.ts`, `results.ts` and
`guidance.ts` are untouched — the gate changes what is *shown*, never what is *found*.

**Next step:** wire a real endpoint behind `setLeadAdapter()` (open question 4), then
`BUILD-PROMPTS-PHASE2.md` STEP 11 — the close timeline and the readiness map, which go into
the free block above the gate.

### Re-verification — 2026-09-05

**Outcome: functional checks pass; launch verification fails.** The human requested
a fresh pass after Steps 9–12, findings rather than silent fixes, six complete
browser fixtures, free/gated calibration, copy/accessibility/responsive checks,
build/lint/tests, and README/LOG updates. Only these two documentation files were
changed. No application source, rules, dependencies or existing tests were changed.
The working tree already contained substantial earlier work; it was preserved.

**Critical scope finding:** this checkout does not contain the results visuals
assumed by the request. `rg` over `src/` found no timeline/radar implementation;
`results-screen.tsx` goes directly from headline to finding cards to the gate.
Every browser fixture rendered zero charts. The previous Step 11 log explicitly
calls itself PHASE2 Step 12 implemented before PHASE2 Step 11 and leaves both
charts outstanding. Therefore there is no honest radar shape, chart screenshot,
chart severity audit or text-equivalent pass to report. No charts were fabricated
or implemented during this findings-only pass.

**Environment and method:** installed Next.js guide
`node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md` read first;
frontend-testing-debugging skill applied. Browser plugin/skill unavailable, so
bundled Playwright **1.62.1**, headless Chromium, production `npm start -- --port
3100`, route `http://localhost:3100/tools/diligence-readiness`. Fresh contexts for
each fixture to avoid an old unlock hiding the gate. Each scenario was answered
through all four paired screens, not injected into React state. Expected results
were independently obtained from the existing `buildResults()` and fixtures.
All five flagged cases exercised empty submission, Gmail rejection, valid work
email, local unlock, actual resulting flag/pitch text and storage. The clean
fixture exercised its optional email form. Supplemental mobile checks covered
reload/re-answer with persisted unlock and the single-finding gate.

**Six-scenario end-to-end table**

Flag labels below abbreviate the actual rule names. Free/gated columns partition
the complete fired list; all remediation is gated even for a free finding.
All flagged pitches are hidden before submission and shown after unlock.

| Scenario | Flags fired | Displayed delay | Radar shape | Free finding cards | Gated finding cards | Pitch variant shown |
|---|---|---|---|---|---|---|
| Diligence-ready Series A | 0 | No delay flagged (engine 0–0); clean headline | Missing | None; clean answer summary and maintenance guidance fully free | None; no gate | `clean-state`, free |
| Bootstrapped first raise | 4: cap-table source, ESOP pool unconfirmed, vesting missing, ROC unclear | 3–6 weeks | Missing | Cap-table source; ESOP pool unconfirmed | Vesting missing; ROC unclear | `roc-reconciliation`, after gate |
| Instrument-heavy seed | 3: cap-table source, instrument stack, vesting missing | 2–4 weeks | Missing | Cap-table source; instrument stack | Vesting missing | `cap-table-conversion`, after gate |
| Foreign angel, live round | 4: foreign filings unclear, cap-table source, ROC unclear, valuation report | 4–8 weeks | Missing | Foreign filings unclear; cap-table source | ROC unclear; valuation report | `roc-reconciliation` + `advisory-filings`, after gate |
| Departed cofounder | 1: departed-founder equity | 4–8 weeks | Missing | Departed-founder equity | No additional finding cards; its guidance/pitch still gated | `ownership-cleanup`, after gate |
| Cross-border complexity | 7: instruments unknown, Press Note 3, cap-table source, ESOP over-granted, vesting missing, ROC unclear, valuation report | 3–6 weeks **plus unbounded approval timing**; aggregate engine bounds are null | Missing | Instruments unknown; Press Note 3 | Cap-table source; ESOP over-granted; vesting missing; ROC unclear; valuation report | `instruments-unknown` + `advisory-filings`, after gate |

**Free/gated calibration — what the founder actually sees before submission**

Every flagged case gets the full headline, severity count/description and Q8
urgency prose. Each free finding includes the literal answer, title, investor
rationale, severity badge, weeks and fixer. Neither chart adds any free value
because neither exists. The gate asks for Name and Work email, with the issue
count and a promise of a report. Below it, all ordered remediation steps, remaining
finding cards, system guidance, product pitches and cross-links are blurred.

Here "actionable" means a concrete remedial first step; an issue title, owner,
"start now", or the generic invitation to rerun the check does not count as a fix.

| Scenario | Free value before the ask | Too much vs too little | Zero concrete remedial actions? |
|---|---|---|---|
| Diligence-ready Series A | Clean headline, seven record confirmations plus Q8 timing, scope caveat, three maintenance items, soft Tabulate pitch. No gate; email is optional. | On the "nothing extra worth an email" side, deliberately: everything is already readable. Reason to email is keeping a copy, not unlocking depth. This is appropriate for clean results. | No: maintenance actions are visible. Procedural accuracy still needs review. |
| Bootstrapped first raise | 4 issues / 3–6 weeks; spreadsheet reconciliation and missing pool diagnoses. Both visible fixers say Incentiv. The two relatively accessible vesting/ROC items are hidden. | **Too little.** It names familiar admin gaps but gives no way to start. The hidden list has value, yet the ask has not earned trust through a free fix. | **Yes** |
| Instrument-heavy seed | 3 issues / 2–4 weeks; spreadsheet and post-conversion diagnosis. The free copy asks what every holder owns after conversion. | **Too little.** It identifies a useful question but withholds the terms checklist and a worked first step. Claiming the founder has not modelled it can actively reduce trust. | **Yes** |
| Foreign angel, live round | 4 issues / 4–8 weeks; foreign-filing uncertainty, possible compounding and cap-table reconciliation. | **Too little.** High-stakes warning without the evidence-folder checklist; enough specificity to alarm, little help to act before submitting. | **Yes** |
| Departed cofounder | One blocker / 4–8 weeks; repeats that the departed founder owns equity, identifies Incentiv as fixer. All finding cards are already free. | **Too little useful help**, while revealing the entire diagnosis. Weakest incremental gate value: "issue in full" adds no new finding, and the useful document/position checklist is hidden. | **Yes** |
| Cross-border complexity | 7 issues; 3–6 weeks plus approval caveat; two blocker cards for unknown instruments and Press Note 3. Five other findings hidden. | **Too little**, although this has the strongest remaining depth. The founder can see prioritization but cannot see even one concrete record-reconstruction or ownership-chain step. | **Yes** |

Recommendation for a subsequent implementation decision: expose at least two
concrete first steps with the free findings, retain deeper remediation/remaining
findings behind the gate, and tailor the one-finding gate to the actual extra
value. This pass did not change the split. The existing `freeStepsBefore` tests
count guidance before pitches inside the gated DOM; they do **not** prove that
anonymous founders receive two free fixes.

**Step 8 calibration re-run:** counts 0, 4, 3, 4, 1, 7; sorted 0, 1, 3, 4, 4, 7;
median **3.5**. The 2+ bar passes. **The rules are about right by this check, not
too soft.** Six authored fixtures do not establish a real-user distribution,
causality of each inference, or validity of placeholder week estimates.

**Copy audit — the earlier blanket pass is withdrawn**

| Check | Result and evidence |
|---|---|
| No 0–100 score | **Pass.** No score is computed or rendered in the flow/results/metadata. OG prose says "not a score"; that is not a numerical score. |
| Intro removes obsolete claims | **Pass.** Actual intro says `8 questions · 90 seconds · free · full report by email`; metadata says the full report comes by email. Neither "free, no signup" nor "nothing leaves your browser" is rendered there. The email promise itself is currently false. |
| No accusatory wording | **Fail.** `pitch.ts:242` says "you don't currently know" without asking; `pitch.ts:285` says the comparison is "being run against you" (bootstrapped/foreign fixtures). `guidance.ts:78` blames a hand-maintained tracker for the ESOP gap without asking how it was tracked (cross-border). No explicit "you are non-compliant" accusation was found, but a banned-phrase test is too weak. |
| Every finding line grounded in answers | **Fail.** Every card echoes an actual selected answer, but that does not validate all conclusions. `flags.ts:81` asserts ownership is not modelled from instrument count alone. `flags.ts:226` asserts the report is absent for Q7 "Not sure". `results.ts:393` says "at your stage" although stage is never asked. Planning pitch says "You have runway" from raise timing, and live pitch says diligence has already started from the combined term-sheet/diligence option. |
| No promise of an outcome | **Fail.** `results.ts:401` calls the single issue the only thing standing between the founder and a data room with nothing to explain; eight questions cannot establish that. `results.ts:299` and gate copy promise fixes "this week" without knowing scope; departed-founder guidance actually describes a negotiation and an estimated 4–8 weeks. `guidance.ts:137` says the Press Note 3 variable is timing, not permission, implying approval is assured. This is a copy-risk finding, not a legal determination. |
| Gate/confirmation truthfulness | **Fail.** Both forms say queued; no email is sent. `results.ts:308` still says "No email, no call, no gate" inside guidance just unlocked by an email gate. The gate promises "all issues" even when the single finding is already fully shown. |

The clean fixture's core answer echoes are sound, but its scope/maintenance and
product claims are generic rather than independently established from eight
answers. Filing deadlines, vesting mechanics, Rule 11UA applicability and Press
Note 3 procedural copy were not legally validated in this QA pass; CA/CS review
remains a launch condition. Do not interpret retained prose as approved advice.

**Accessibility on the new surfaces**

| Requirement | Observed result |
|---|---|
| Severity has glyph and word | Existing finding badges pass in both themes: Blocker = 7px filled disc + word; Delay = 7px ring with 2px border + word; Cleanup = 8×2px bar + word. Headline severity prose is word-only, so a literal "glyph AND word everywhere" requirement is not fully met. No severity is encoded only by colour in the existing finding cards. |
| Severity inside both charts | **Blocked/missing:** neither chart exists. No pass claimed. |
| Blur hidden from accessibility tree/tab order | **Pass:** `aria-hidden="true"`, native `inert`, blur(6px); nine Tab presses per flagged fixture never entered it. Both attributes disappear on unlock. |
| Sensible focus into gate | **Pass for entry:** H1 receives focus on results mount; next Tab = Name, then Work email, then Submit. |
| Gate validation/unlock focus | **Fail:** empty submit leaves focus on Submit. Error text is connected with `aria-describedby`, but is not a live region and focus does not move to an invalid field. Successful submit removes the focused form and leaves BODY active; next Tab goes to Review your answers, skipping the newly unlocked report/pitches. Reproduced in both themes at 375. |
| Results headline announces | DOM/focus **pass:** ancestor has `role="status"`, `aria-live="polite"`; H1 gets focus in all six fixtures. Actual NVDA/VoiceOver announcement was not listened to, so no full assistive-technology certification is claimed. |
| Both charts have text equivalents | **Missing**, along with the charts. The finding register is not verification of nonexistent chart alternatives. |

**Responsive/screenshots**

- All four paired screens at **375/768/1024**, both themes: 24 full-page question
  screenshots. Stacked at 375 and 768, side-by-side at 1024. First-screen fieldsets:
  327px wide at x=24 on mobile; 720px wrappers at x=24 on tablet (answer rows remain
  measure-capped); 440/439px at x=40/545 on desktop, both y≈352. The stacked gap is 48px.
- Six full locked-results screenshots plus six gate viewport screenshots. Long
  Press Note 3 headlines and approval timing wrap without horizontal clipping.
  All 30 measured screen/width/theme states have `scrollWidth === viewport width`.
- Gate overlay fits its 800px mobile / 832px larger capped region in both themes.
  Four extra screenshots cover both-error and single-issue states at 375; both fit.
  Blur remains visible below the card. No unrelated overlap or cropped controls found.
- **Timeline/radar small-width screenshots: impossible in this checkout**, recorded
  as missing rather than substituting pictures of another surface.
- All six contact sheets were visually reviewed. Screenshots used reduced-motion
  emulation for stable captures. Mobile software keyboards and 200% zoom were not tested.

Evidence lives outside the repository at
`C:/Users/Vipin/.codex/qa/diligence-reverification-2026-09-05/`:
`fixtures.json`, `browser-results.json`, `supplement.json`, replay scripts
`data.cjs` / `browser.cjs` / `supplement.cjs`, **40 PNG screenshots**, and six
`contact-{light|dark}-{375|768|1024}.jpg` sheets. Full-size screenshot names are
`{theme}-{width}-questions-{1..4}.png`, `...-results.png`, `...-gate.png`, plus
`{theme}-375-gate-errors.png` and `{theme}-375-single-gate.png`.

**Non-negotiables and execution checks**

- **Pass:** no application backend/API state, auth, database, AI calls, uploads,
  or chart library in source/dependencies. No outbound/write requests occurred
  during all six fixture flows and either form submission. Local requests loaded
  the static app assets. Next.js serving the app for QA is not a stateful backend;
  actual static-export deployment configuration is still undecided.
- Answers stay in React state. Theme and a single unlock flag persist. Gate
  name/email are console-logged by `consoleLeadAdapter`, not sent or stored in
  localStorage. A DOM blur can be bypassed; it is not access control.
- Page identity, meaningful content, no framework overlay, console health,
  screenshot evidence and interaction proof all pass for the tested production
  route. Six browser fixtures; zero collected console warnings/errors/pageerrors.
- `npm run test`: **438/438**, five files. `npm run lint`: exit 0.
  `npm run build`: exit 0, compilation/TypeScript/prerender successful; five route
  entries including both social image routes. No failing project checks to fix.
- QA-only script initially used the wrong accessible name for the optional email
  field (`Your email address` instead of `Your email`); the harness was corrected
  and the full six-fixture pass rerun successfully. This was not an app failure.
- Limits: Chromium only, no actual screen-reader listening, chart implementation,
  email delivery, legal sign-off, or deliberately triggered loading/error boundaries.

**Remaining launch blockers — current priority, superseding earlier lists**

`P0` = must resolve before exposing the tool publicly. `P1` = must resolve for
the specified experience/measurement to be launch-ready. Items below are not fixed
in this pass. Dependencies on human choices are stated instead of guessed.

**Code can fix**

1. **P0 — Truthful delivery/confirmation behavior.** Gate and optional clean form
   both claim an unsent report is queued. Implement the approved delivery or
   no-delivery experience in both paths; don't blindly mark a failed send queued.
   The clean form currently does not use `submitLead()` at all. A delivery adapter
   alone also cannot recreate the exact current report: flag ids don't retain
   the chosen answer echoes (e.g. sheets vs CA/CS), and clean confirmations need
   answers. Define the minimal approved report payload/template and client
   initialization, not just a server-layout `setLeadAdapter()` call. Depends on
   human decision 1 below.
2. **P0 — Correct misleading copy and provenance.** Remove contradictory "no
   gate" guidance, unsupported assertions, blame and implied one-week/full-clearance
   guarantees identified above; carry uncertainty through Q2/Q7 and distinguish
   generic guidance from observed facts. Align procedural copy to human review.
3. **P1 — Missing results implementation.** Recover or implement the timeline
   and radar using native markup/SVG, with explicit severity glyphs and words and
   text equivalents; re-run every fixture and both-theme width captures.
4. **P1 — Gate accessibility.** Focus the first invalid field or announce an
   error summary; deliberately move focus to unlocked content/confirmation after
   form removal. Bring severity prose into the literal glyph+word requirement.
5. **P1 — Meaningful free value.** After decision 2, expose concrete first steps
   before the gate and match single/low-count gate copy to what remains hidden.
   Add assertions against the accessible locked UI; `freeStepsBefore` in the
   conversion model is not evidence of anonymous access.
6. **P1 — Functional destinations and honest analytics.** Wire the five approved
   URLs and selected provider. `PitchBlock` currently fires `pitch_shown` when
   mounted behind the blur, before anyone sees it. Count only the approved
   visible/unlocked event and regression-test it. Choices depend on human 5/6.
7. **P1 — Release integration and regression coverage.** Apply approved delay
   values/model, hosting/origin/assets; reconcile README/CLAUDE/DESIGN/spec claims
   after decisions; add browser checks for gate focus, visible free value, charts
   and delivery truthfulness. Then repeat this pass. Existing 438 tests currently
   pass despite these failures; some assert the problematic copy verbatim.

**Needs a human decision, data or sign-off**

1. **P0 — Email delivery and privacy contract.** Choose a real external receiver,
   report generator/sender, allowed payload and privacy notice, or change the
   experience/promise to on-page access only. A stateful in-app endpoint would
   violate the current no-backend constraint; do not introduce one silently.
   Approve whether the CSS-only bypass and persistent device-wide unlock are
   acceptable. Decide the work-email-only policy, including founders using
   personal email and false positives from matching domain first labels.
2. **P0 — Minimum free value.** Resolve the explicit conflict between gating all
   guidance and providing two fixes without an email. Five of six fixtures have
   zero concrete free remediation; the one-issue case has no extra finding to unlock.
3. **P0 — CA/CS/legal and tone approval.** Review all procedural content, especially
   filing deadlines, vesting, Rule 11UA applicability and Press Note 3 language.
   Approve conditional language instead of promises; confirm product capability
   claims about Tabulate/Advisory. This QA report is not that review.
4. **P0 — Real delay data/model.** Supply all 11 approved ranges, indefinite-approval
   treatment and evidence for the fully parallel critical-path assumption.
   The 3.5 flag median does not validate weeks or support stage-specific claims.
5. **P1 — Five real destinations.** Tabulate, Advisory (including whether booking,
   form or email), Funding Round Simulator, ESOP Tax Calculator, Valuation Calculator.
6. **P1 — Measurement choice.** Select analytics provider, privacy policy and exact
   impression semantics. Approve or reject pitch priority/ownership routing on
   real founder feedback; retain contextual rather than blanket selling.
7. **P1 — Hosting and final brand approval.** Standalone vs embedded, exact origin,
   public name, favicon/logomark/OG copy, accessible blue exceptions and Step 9
   type/container changes. Align source documents once approved. Keeping
   "estimated" is the conservative current choice; removing it is not a blocker.

Other earlier questions (OS-following theme, cosmetic prompt whitespace, full
answer-sheet expansion, stale Word locks) are optional follow-ups, not additional
launch blockers. Q2's unusual roving checkbox model should be included in human
keyboard/screen-reader acceptance alongside the concrete gate focus fix.

**Next step:** resolve the P0 human decisions and assign the corresponding code
corrections, then implement/recover the absent charts and repeat this verification.

### Step 14 — Visual summary band + the gate logic fix — 2026-09-05

Resumed mid-way: a previous session ran out of budget after writing `summary.ts`,
`summary.test.ts`, the new `gate.ts` copy and `summary-visuals.tsx`, but had wired
none of it into the page and left the typecheck red. This entry covers the whole
of Step 14, including that inherited work, and says which parts it inherited.

**What existed before this session** — `src/lib/summary.ts` and its 28 tests,
`src/lib/gate.ts` with the "Get the fixes" / "Send me the fixes" copy and its
updated tests, and `src/app/tools/diligence-readiness/summary-visuals.tsx` with
the three SVG components. **None of it was reachable from the page**:
`summary-visuals.tsx` was imported nowhere, `results-screen.tsx` had no reference
to `summary` at all, `npx tsc --noEmit` failed on one error, and one test in
`summary.test.ts` plus six in `results-screen.test.tsx` were red.

#### Done

**PART A — the gate logic, which was a correctness bug.** The free/gated split
was a fixed flag count (`FREE_FLAG_COUNT = 2`): a two-flag result showed both
findings in full and then asked for an email to "unlock all 2 issues" already on
the screen. It is now a **content-type** split, and the constant is gone.

- Free, always, at every flag count: the two stat tiles, all three summary
  visuals, and **every** finding complete with its severity, weeks, owner and
  "why an investor asks" line. The diagnosis.
- Gated: the step-by-step self-fix guidance, the "needs a system" column with
  its CTAs, and the cross-links. The remedy.
- Zero flags shows no gate at all, as before.
- `analytics.ts`'s `gate_shown` carries `gatedGuidanceCount` — the number of
  remedies actually behind the blur — rather than the old `hiddenFlagCount`,
  which is now always zero by construction. The type had been renamed already;
  the call site had not, and that was the one typecheck error.

Two tests hold it: the gated region must contain a remedy for every flag, and
everything above `.gate-region` must contain every finding in full. Both run
over all six fixtures plus the 1-flag and 0-flag cases.

**PART B — the hero is a KPI row, not a sentence.** The single serif headline
mixing italic, gradient and mono numerals across two lines is gone. The `<h1>` is
now the two stat tiles — Plex Mono 300 at 48/56/72px with Inter labels beneath,
side by side above 768px and stacked below. The sentence survives as the
heading's `aria-label`, so `buildHeadline()` is still the thing a screen reader
hears and no copy was invented or lost. `StatTiles` renders spans throughout
because a heading's content model is phrasing content.

**PART C — the three visuals, wired in as one band under the tiles.** Inline SVG,
no chart library. Timeline full width; readiness map and benchmark side by side
beneath it, stacking under 768px. Free in every state including the clean one,
where a full hexagon and "you have 0" are the strongest thing the page can say.
All the CSS is new — `summary-visuals.tsx` referenced two dozen class names that
did not exist in `globals.css`.

- **Close timeline.** One lane per flag, all starting at week 0, ordered blocker
  → delay → cleanup, solid head for the min and a lighter tail for the min–max
  spread. They start together because `aggregateParallelDelay` assumes remediation
  runs in parallel; laying them end to end would draw a total the headline
  contradicts. The axis is relative and has a 4-week floor. The Press Note 3 lane
  is masked to fade out rather than ending, because it has no length to draw.
  Native `title` tooltip per lane. No calendar date anywhere.
- **Readiness map.** Six axes, coarse 0–3 from the worst severity that fired
  there, never summed. Polygon stroke 2px brand blue, fill 10%, grid in the warm
  border colour. A blocker vertex carries a drawn ▲ (a path, not a glyph, so it
  survives a missing font). Every axis is also a row of text with its status
  word, and the caption says out loud that a radar exaggerates.
- **Benchmark bar.** 0–9 scale, shaded 3–5 band labelled in words, marker at the
  founder's count. **The 3–5 band is an estimate and needs calibration alongside
  the delay ranges** — flagged in `summary.ts` and in the human list below.

Severity carries its glyph **and** its word everywhere; `.severity-glyph` is the
only place a severity colour touches type and it colours the glyph, never the
word beside it. The SVGs are all `aria-hidden` decoration over text that is
already on the page.

**PART D — the dead space.** Two separate causes, both fixed.

- *Between sections.* `.section-padding` is 48/96 — correct for a screen that IS
  one section, but two adjacent results sections each carrying 96px top and
  bottom put **192px** between two lines of text. Added `.section-gap`
  (24/32px, so 48/64px across a divider — the Step 9 section gap) plus
  `.section-gap-lead` / `.section-gap-tail` for the first and last sections,
  which have no neighbour on one side. Every results section moved onto them.
  `.section-padding` is unchanged and still used on the intro and the index.
- *Below the fold on the intro.* Added the **"what we check" strip**: the nine
  check areas as a quiet mono grid, no icons and no cards. `CHECK_AREAS` lives
  in `brand.ts` and `brand.test.ts` asserts it accounts for every rule in
  `flags.ts` exactly once, so it cannot drift from what the tool checks. The
  same strip is on the index page, which had the same empty lower half. The gap
  between the hairline and the mono line came down from 32px to 24px on both.

**PART E — the footer bug.** `src/app/page.tsx` pointed "More tools from Incentiv"
at `TOOL_PATH` — this same tool. It now lists the ESOP Tax Calculator and the
Funding Round Simulator from a new `SIBLING_TOOLS` in `brand.ts`. Both hrefs are
still `#` placeholders (open question 11), which the test asserts is at least not
this tool's own path.

**Also.** `opengraph-image.tsx`'s `alt` promised "ninety seconds, free" with no
mention of the email; it now matches the intro's mono line — "free, with the full
report by email". `summary.test.ts`'s "no calendar date" regex matched the modal
verb in two flag titles that say an approval "may apply"; it now requires a month
name to sit next to a day or a year.

#### Files created

| Path | Why |
|---|---|
| `src/lib/brand.test.ts` | Holds `CHECK_AREAS` to the rules table, and the footer off this tool. |

#### Files changed

| Path | Change |
|---|---|
| `src/lib/summary.ts` | Added `SUMMARY_COPY` — the band's own headings, so the component still writes no copy. |
| `src/lib/summary.test.ts` | Fixed the calendar-date regex (it failed on "may apply"). |
| `src/lib/brand.ts` | Added `CHECK_AREAS`, `CHECK_AREAS_LABEL`, `SIBLING_TOOLS`. |
| `src/lib/analytics.ts` | *(inherited)* `gate_shown` carries `gatedGuidanceCount`. |
| `src/app/globals.css` | All the summary-band styles, `.severity-glyph`, `.mono-figure`, `.section-gap*`, the check strip. |
| `src/app/page.tsx` | Footer bug; the scope strip; the 32→24px hairline gap. |
| `src/app/opengraph-image.tsx` | `alt` no longer implies no signup. |
| `.../summary-visuals.tsx` | `StatTiles` renders spans so it can be the `<h1>`. |
| `.../results-screen.tsx` | The whole restructure: tiles, band, all findings free, remedy gated. |
| `.../conversion.tsx` | `ReportGate` takes `gatedGuidanceCount`; fixed the call site. |
| `.../question-flow.tsx` | Intro scope strip and the hairline gap. |
| `.../results-screen.test.tsx` | Rewrote the hero and gate assertions; added the band. |

#### Verified

`npx tsc --noEmit` clean · `npm run lint` exit 0 · `npm run test` **510 passed**
(up from 438, and 7 were failing at the start of this session) · `npm run build`
exit 0, five static routes. `results-screen.test.tsx` server-renders all **six
fixtures plus the 1-flag and 0-flag cases** and asserts the split, the band, the
tiles and the one gradient on each. The three low-count cases were dumped and
read by hand: the 2-flag case now shows both findings free and puts **two**
remedies behind the gate, which is the bug in the Step 14 brief, closed.

#### Known gaps and TODO

- **No screenshots.** The brief asked for the results page in both themes at
  1280px and 375px. The Chrome extension is not connected in this environment
  ("Browser extension is not connected"), and I did not substitute a different
  driver. The dev server was checked to serve 200 and the index page's new markup
  was read from the wire, but **nothing in this step has been looked at by a
  human eye or by a browser**. That is the single largest gap in this entry, and
  the responsive/dark-mode behaviour of the three visuals is unconfirmed.
- The gradient question below (open question 1) is a real conflict I resolved by
  following the newer instruction. It should be looked at.
- `guidance.ts` puts "Reconcile your sheet against the MCA record **yourself**"
  in the *needs a system* column on the 1-flag and 2-flag cases. Pre-existing,
  not introduced here, and outside Step 14's scope — but it reads oddly now that
  the split is the thing the gate sells.
- Everything in the 2026-09-05 re-verification's blocker list that Step 14 did
  not touch still stands: delivery is still a stub, the delay ranges are still
  estimates, the five URLs are still `#`, and `pitch_shown` still fires behind
  the blur.

#### Next step

Get a browser on it: both themes at 1280px and 375px, all six fixtures, and check
the timeline lane widths, the radar at 375px and the benchmark band in dark mode.
Then the P0 list from the re-verification entry, which Step 14 did not address.

#### Open questions for the human — new in this step

1. **The gradient conflict, and I had to choose.** `DESIGN.md` and `CLAUDE.md`
   say the blue → terracotta text gradient is **display scale only**. Step 14's
   PART B says to take it off the figures and "reserve the blue→terracotta
   gradient for the section heading only". Removing the display headline removed
   the only display-scale element on the page, so the two cannot both hold. I
   followed the newer, explicit instruction: the gradient is on exactly one h2 —
   the summary band's — and nowhere else, and a test asserts there is exactly
   one of it. If DESIGN.md wins instead, the page should carry no gradient at
   all; say which and it is a one-line change.
2. **The stat tile sizes are mine.** PART B says "56–72px". The tiles run
   48px → 56px → 72px across the three breakpoints, which is the display step
   at ≥1024px and smaller below so two tiles fit a 375px screen side by side
   when they are short. Not from DESIGN.md's scale, which has no 72px step.
3. **The nine check areas are my grouping.** The strip had to be nine, and there
   are eight questions and eleven rules — so neither maps to nine directly. I
   grouped the two instrument rules into "Convertible instruments" and the two
   foreign-capital rules (including Press Note 3) into "Foreign capital and
   FEMA", which gets to nine with every rule accounted for. The wording is
   deliberately data-room language, not question language. Please check it says
   what you want the tool to claim it checks — it is the first scope promise a
   visitor reads.
4. **The benchmark's 3–5 band is invented.** Same status as the delay ranges in
   `flags.ts`: it is a plausible read, not measured. It is now on the page in
   words — "Companies at your stage typically carry 3–5" — which is a claim
   about a population we have no data on. It needs real numbers or it needs to
   come off before launch. This is additive to human decision 4 in the
   re-verification list.
5. **The section rhythm changed on the results page only.** `.section-gap`
   (48/64px across a divider) replaced `.section-padding` (96/192px) there.
   Step 9's 48/96 section padding is unchanged and still applies everywhere
   else. If the intro and index should move too, say so.
6. **Two free fixes vs. gating all remedies — still unresolved, and now
   sharper.** `CLAUDE.md`'s tone constraint says give away at least two fixes
   the founder can do themselves. Step 14 puts *every* remedy behind the gate
   and compensates by making every *finding* free. That is a better gate and a
   defensible trade, but it is not what the tone constraint says. This is
   re-verification human decision 2 and it is still open; Step 14 changed which
   side of it the code sits on, on the human's own PART A instruction.

### Step 15 — Site chrome, the three-step split, and the tally strip — 2026-09-07

The human pasted a new build prompt ("Build the front end for a tool called the
**Diligence Readiness Check**") describing the tool as a page of the marketing
site: sticky nav, 380px left rail, three step tabs, a white question card, two
link cards and the full site footer. It differed from this repo in four material
places, so the session **asked before building** rather than guessing — the
answers are recorded under "The four forks" below, and all four went to the
conservative option.

**This is the first step in the project to have been looked at in a browser.**
Step 14's single largest gap is closed: 36 full-page screenshots at 375 / 768 /
1024 / 1440 in both themes, zero console errors, zero horizontal overflow.

#### The four forks — asked, and answered

| The prompt said | The repo said | The human chose |
|---|---|---|
| A serif `6/9` verdict heading the report | `CLAUDE.md`: **no score, ever** | **No score.** Keep the two stat tiles; add the prompt's three-cell tally strip, which is a partition rather than a mark |
| Nine single-select questions in three steps | Eight questions, one multi-select, four paired screens | **Keep the eight**, regrouped into the prompt's three steps |
| An ungated report with an optional email panel | Step 11's name + work-email gate | **Keep the gate** exactly as Step 14 left it |
| How much to replace | Steps 1–14 | **Restructure in place** — engine, results, summary band and every test untouched |

A fifth conflict was **not** asked about. The prompt's design tokens (`#FAF9F6`,
Fraunces, Instrument Sans, radius 6/8/10, "no gradients") contradict `DESIGN.md`,
but the prompt's own preamble says *"Replace the token values in Design system if
your real values differ"* and `CLAUDE.md` gives `DESIGN.md` authority over looks.
Everything below is therefore built in Incentiv tokens: cream `#FDFCF9`, DM Serif
Display italic, Inter, IBM Plex Mono, 4px radius, the edge lines, the one
gradient. If the intent really was to re-skin the design system, this is the
decision to reopen — see open question 14.

#### Done

**PART A — the site chrome.** `ToolHeader` (wordmark + theme toggle) is deleted.
Every page now carries `SiteNav` and `SiteFooter`.

- **`SiteNav`** — sticky, `z-index: 40` so it sits above `.page-edge-lines` (30)
  rather than under the scan lines. Wordmark, four links, theme toggle, "Book a
  demo". The four links are hidden below 1024px and **are not lost there**: each
  one is a footer column heading on every screen, which is why there is no
  hamburger and no second navigation to maintain.
- **`SiteFooter`** — wordmark, one line of description, and Products / Solutions
  / Resources / Company with mono headers. It replaces the ad-hoc "More tools"
  list that used to sit at the bottom of the index page, and `SIBLING_TOOLS` is
  gone with it.
- **`ToolLinkCards`** — the two bordered cards under the split.

**PART B — the intro splash is gone, and the rail is why.** The prompt asks for
question one on screen at load, with no "Start the check" gate. That is only
honest if everything the splash carried is still visible, so it moved into the
rail: breadcrumb, the `<h1>`, the lede, the scope of the check, and one
cross-sell. `FlowScreen` is now `"questions" | "complete"`; `tool_started` fires
on mount instead of on a button.

- The rail `<h1>` is **"What will investors flag in your data room?"** with a
  pale-blue highlight on the middle phrase, drawn from `hsl(var(--primary)/0.16)`
  so it re-resolves in dark mode with everything else rather than being a second
  hue. `box-decoration-break: clone` keeps both lines painted when it wraps,
  which in a 380px rail it always does.
- The **accordion is navigation**, not decoration: the group matching the current
  step is the only one expanded, and clicking any group jumps the tool to it.
  Current = blue **and** filled dot **and** expanded **and** `aria-current="step"`
  — four channels, so colour is never the only one.
- Below 1024px the rail keeps the heading and the lede and **drops the accordion
  and the cross-sell**. The step tabs already carry the three groups on a phone,
  and a product pitch stacked above the first question is the banner §4 forbids.

**PART C — three steps, not four pairs.** `screens.ts` regroups the same eight
questions, and the groups are `brand.ts`'s, not the screen layer's — the rail's
accordion and the step tabs have to name the same three things.

| Step | Questions | What the accordion lists |
|---|---|---|
| Cap table | Q1 cap table · Q2 instruments · Q7 valuation | Cap table source of truth · Convertible instruments · Valuation basis |
| Equity plan | Q3 pool · Q4 vesting | ESOP pool approval · Pool headroom · Founder vesting · Departed founders |
| Compliance & timing | Q5 ROC · Q6 foreign capital · Q8 raise timing | ROC and MCA filings · Foreign capital and FEMA |

The third label carries "& timing" because Q8 fires no flag — it is urgency, not
compliance, and calling the group "Compliance" would claim the tool checks
something it does not. Two module-load assertions hold the grouping to the data:
every question appears exactly once, and the three step ids match
`CHECK_GROUP_ORDER` in order. `questionNumber()` is unchanged, so the completion
funnel still reads off the question's own number and regrouping did not move it.

**PART D — the tool column.** Step tabs (2px top border, mono label, sans
sub-label), a mono meta row, and the white card.

- **The progress bar is gone.** The prompt rules out a percentage, and
  "Step 2 of 3 · 5 of 8 answered" is the number a founder actually wants. The
  meta row is the flow's live region, so a jump between steps is announced with
  its new position. `ProgressBar` is now unused by the app; the primitive and its
  test are left in place.
- The meta row's right-hand promise is **"Free · full report by email"**, not the
  prompt's "Free · no login". The 2026-09-05 copy audit withdrew every no-signup
  claim: the results carry an email gate, so a promise of no login on the way in
  is false by the time the founder reaches it. `brand.test.ts` asserts it.
- **Continue validates instead of sitting disabled.** A disabled button cannot
  say why it is disabled. Pressing it with a gap shows an amber
  `role="alert"` — "3 questions still to answer." — and any answer clears it. On
  the last step it validates *all eight* answers and jumps back to the first step
  with a gap, because the steps can be jumped between.
- Options are a 2×2 grid via `repeat(auto-fit, minmax(15rem, 1fr))` — **no media
  query**, because the column's width depends on the rail beside it as much as on
  the viewport, so the grid measures itself.
- Auto-advance is kept where it already applied, and **disabled on the last
  step**: the next thing there is the register, and a founder should be the one
  to ask for it.
- Focus no longer jumps into a radio group on first paint. It still moves on
  every step change, to the answered option if there is one.

**PART E — the tally strip.** Three cells under the stat tiles: Blocking / To
tidy / Clear.

This is the one piece of the prompt's report screen that was adopted, and the
reason it is safe on a tool that refuses to score anything is its shape: the
three cells **partition the nine check areas**, they always add to the same nine,
and the caption names the denominator out loud — "Across the nine areas this
check looks at." A cell is never a mark out of a total the page failed to state.
It counts *areas*, not flags, for the same reason the readiness map is coarse:
two findings on "Foreign capital and FEMA" are one area in trouble, not two.

The numerals are Plex Mono. The prompt asked for a display serif here; `DESIGN.md`
§3 does not allow a number in DM Serif anywhere, and that rule wins.

Two tests hold the line: the three cells sum to `CHECK_AREAS.length` in all eight
fixtures, and the rendered page matches neither `6/9`, nor "6 out of 9", nor a
percentage.

**Also.** `CHECK_AREAS` gained a `group`; `CHECK_AREA_COUNT_WORD` is the spelled
count the rail's lede and the tally caption both read, held to `CHECK_AREAS.length`
by a test so a tenth rule cannot leave two sentences claiming nine. The results
page's "Review your answers" is now "Change an answer". `.question-prompt` — which
reserved two lines of leading so side-by-side prompts aligned — is deleted, since
questions stack now and there is nothing to align to.

#### Files created

| Path | Why |
|---|---|
| `src/components/layout/site-nav.tsx` | The sticky site nav. Replaces `ToolHeader`. |
| `src/components/layout/site-footer.tsx` | The four-column site footer, on every page. |
| `src/components/layout/tool-link-cards.tsx` | The two bordered cards under the split. |
| `src/app/tools/diligence-readiness/tool-rail.tsx` | The left rail: breadcrumb, h1, lede, accordion, cross-sell. |
| `src/app/tools/diligence-readiness/step-tabs.tsx` | The three step tabs. |

#### Files deleted

| Path | Why |
|---|---|
| `src/components/layout/tool-header.tsx` | Superseded by `SiteNav` on every page that used it. |

#### Files changed

| Path | Change |
|---|---|
| `src/lib/brand.ts` | `CHECK_GROUP_*`, `group` on every check area, `CHECK_AREA_COUNT_WORD`, `areasInGroup()`, and the whole site-chrome block: nav, breadcrumb, rail copy, cross-sell, meta promise, link cards, footer columns. `SIBLING_TOOLS` removed. |
| `src/lib/brand.test.ts` | Rewritten: group coverage, the spelled count, nav↔footer parity, and the no-signup assertion. |
| `src/lib/summary.ts` | `TallyView`, `buildTally()`, wired into `SummaryView`. |
| `src/lib/summary.test.ts` | Five tally tests, including the partition property and the area-counted-once rule. |
| `src/app/globals.css` | The whole Step 15 block — nav, footer, split, breadcrumb, rail, step tabs, meta row, card, option grid, validation note, tally strip, link cards. `.question-prompt` deleted. |
| `.../screens.ts` | Four pairs → three groups, read from `brand.ts`; `screenIndexOf()`; `shortLabel` dropped. |
| `.../question-flow.tsx` | The restructure: splash removed, split layout, tabs, meta row, validate-on-Continue, jump-to-step, first-paint focus fix. |
| `.../results-screen.tsx` | The tally strip; "Change an answer". |
| `.../summary-visuals.tsx` | `TallyStrip`. |
| `.../results-screen.test.tsx` | Tally assertions across all eight fixtures, plus the no-fraction rule. |
| `.../page.tsx`, `.../loading.tsx` | Site chrome; the skeleton now draws the split. |
| `src/app/page.tsx`, `src/app/not-found.tsx` | Site chrome; the ad-hoc footer removed. |

#### Verified

`npx tsc --noEmit` clean · `npm run lint` exit 0 · `npm run test` **536 passed**
(up from 510) · `npm run build` exit 0, five static routes.

**Browser — the first visual verification in this project.** Production build on
`http://localhost:3200`, headless Chromium via the Playwright 1.62.1 already in
the npm `_npx` cache (nothing was added to this project's dependencies), reduced
motion, fresh context per run so no stored theme or unlock leaked between them.
Answers were clicked through the real flow, never injected into React state.

- **36 full-page screenshots**: 375 / 768 / 1024 / 1440 × light and dark ×
  {step 1, step 2, step 3, results}, plus the amber validation state at 375 and
  1440 in both themes. Evidence at
  `C:/Users/Vipin/.codex/qa/step15-2026-09-07/`, with the capture script.
- **Zero** console errors, warnings or page errors across all eight runs.
- `document.scrollWidth === clientWidth` at every one of the eight width/theme
  combinations — no horizontal overflow anywhere.
- Read by eye: the split at 1440 light, the results page at 1440 light, the
  stacked layout and the validation note at 375 light, and step 2 at 1440 dark.
  The dark-mode highlight behind "investors flag" and the tally strip were
  zoomed and checked individually.
- One defect found and fixed from the screenshots: at 375 the third tab's label
  wraps to two lines, which dropped its "3 questions" sub-label below the other
  two. `.step-tab__sub` now has `margin-block-start: auto`.

#### Known gaps and TODO

- **Everything in the 2026-09-05 re-verification's P0 list is still open.** Step 15
  did not touch delivery, the delay estimates, the five `#` URLs, the accusatory
  copy, gate focus, or `pitch_shown` firing behind the blur. The tool is still
  **not launch-ready** and this step did not change that.
- **The chrome adds ~14 new `#` placeholders** — four nav links, the demo CTA, the
  footer's Solutions and Company columns, and "How this check works". That is the
  largest single block of dead links in the project and it is new as of this step.
- **The screenshots were read, not audited.** No screen reader was listened to, no
  keyboard walk of the new accordion and tabs was performed, and 200% zoom and a
  mobile software keyboard were not tested. The jump-to-step controls are new
  interactive surface that has had no accessibility pass.
- The rail's cross-sell is a product block that is not attached to a flag. It is
  deliberately the quietest thing in the rail and it is hidden below 1024px, but
  it is still a standing pitch — open question 13.
- `ProgressBar` is now unused by the application.

#### Next step

The P0 human decisions from the 2026-09-05 re-verification, which are what stand
between this and a launch. Nothing in Step 14 or Step 15 addressed them.

#### Open questions for the human — new in this step

11. **Was the pasted prompt's design system meant literally?** It specifies
    `#FAF9F6`, Fraunces, Instrument Sans, radius 6/8/10 and "no gradients", and
    also says to replace those values if the real ones differ. This step read
    that as "use Incentiv's", because `DESIGN.md` is a source of truth and
    re-skinning would mean rewriting `globals.css` and every primitive. If the
    intent was a genuine re-skin, say so — it is a large piece of work and it
    should not be inferred.
12. **Fourteen new dead links.** The nav's four, "Book a demo", the footer's
    Solutions and Company columns, and "How this check works" are all `#`. The
    footer's Products and Resources columns reuse the existing `OUTBOUND_URLS`,
    so they resolve as soon as re-verification decision 5 is answered. The
    others need the real site's URL structure. Also: the Solutions and Company
    labels are **mine** — taken from `CLAUDE.md`'s one-line description of what
    Incentiv does. Please check they are the site's actual sections.
13. **The rail cross-sell versus "never a banner ad."** `CLAUDE.md` §4 says the
    pitch attaches to the flag it solves. The prompt puts a standing Tabulate
    block in the rail on every step, before any flag exists. It is built as
    asked, but kept as quiet as the design allows — no card, no fill, hairline
    above, and hidden entirely below 1024px. Is a standing rail block the
    exception you want, or should it appear only once there is a register?
14. **The report screen only took the tally strip.** The prompt also describes a
    verdict row, one-line flag rows with the chip in a fixed left column, and an
    ungated email panel — all of which would replace the Step 14 summary band,
    the flag cards and the gate. Given "restructure in place", none of that was
    done: the register is untouched apart from the strip and one button label.
    Say if you want the flag rows restructured too.
15. **The results page drops the rail and runs full width.** The prompt says the
    report "replaces the card contents", i.e. inside the 572px column. The Step
    14 band — a timeline, a radar and a benchmark bar side by side — does not
    read at that width, and the gate overlay is positioned against
    `.container-tool`. So the split applies to the questions and the register
    keeps the full measure. Confirm, or say the report should live in the column.
16. **Auto-advance survived, and it now sits oddly beside an explicit Continue.**
    Step 2 (two single-selects) still jumps 300ms after the second answer. The
    prompt's model is "Continue validates", which implies the founder presses it.
    Keeping auto-advance was the low-churn choice; removing it is a two-line
    change. Which?

### Step 16 — The first commit since Step 2 — 2026-09-07

The human asked for the work to be pushed. **It could not be pushed:** `git remote -v`
is empty and the GitHub CLI is not installed on this machine, so there is nowhere for
a push to go. Everything short of the push was done instead — the tree is now
committed, and a remote is the only thing missing. See open questions 17 and 18.

**The repository had two commits and thirteen steps of uncommitted work.** `HEAD` was
still Step 2 (`be29836`, 2026-09-04). Steps 3–15 — the rules engine, the results
screen, the conversion layer, the lead gate, the summary band, the site chrome, the
three-step split, all 536 tests, and every revision to `LOG.md`, `CLAUDE.md` and
`README.md` — existed only as working-tree changes. Until this step, a stray
`git checkout .` would have destroyed all of it with no way back.

#### Done

- **Ran `CLAUDE.md`'s pre-commit gate before staging anything.** `npm run test` —
  **536 passed, 7 files**. `npm run build` — exit 0, five static routes
  (`/`, `/_not-found`, `/opengraph-image`, `/tools/diligence-readiness`,
  `/twitter-image`). Both green, on the tree as committed.
- **Read the untracked list in full before staging** (`git status -uall`): 47 paths,
  all of them project source. No `.env`, no keys, no `.next/`, no screenshots — the
  Step 15 evidence lives outside the repo at `C:/Users/Vipin/.codex/qa/`, so it was
  never a candidate. `.gitignore` already covered `/.next/`, `.env*`,
  `*.utf16.bak.md`, npm debug logs and the Office `~$` lock files, and needed no edit.
- **Kept the four vendored WOFF faces** in `src/assets/fonts/` (104 KB total). They
  are build inputs for the OG card, not runtime assets — Satori cannot read the WOFF2
  that `next/font` emits — so a fresh clone cannot build without them.
- **Staged the two `styleguide` deletions explicitly.** `src/app/styleguide/page.tsx`
  and `styleguide-client.tsx` were removed in Step 7 as planned, but the deletion was
  never recorded; `git add -A` carries it.
- Committed as **one commit on `master`**.

#### Files created and changed

- `LOG.md` — this entry. **No source file was touched this session.** The commit
  contains exactly what Steps 3–15 already produced.

#### Decisions made

| Decision | Choice | Why |
|---|---|---|
| Commit granularity | **One commit** for Steps 3–15 | The steps are not separable from the working tree after the fact. Reconstructing thirteen commits would mean inventing a history that never existed; the step log in this file is the real record, and the commit message points at it. |
| Branch | **`master`**, not a feature branch | Steps 1 and 2 were committed straight to `master`, there is no remote, no second contributor and no PR flow. A branch would be ceremony with nothing on the other side of it. |
| Ordering | `LOG.md` written **before** the commit | The session protocol makes the log part of the work, so it belongs inside the commit rather than trailing it. |
| Pre-commit gate | Run before staging, not after | `CLAUDE.md` requires the build to pass before any commit; running it on the exact tree being committed is the only version of that check that means anything. |

#### Verified

- `npm run test` 536 passed · `npm run build` exit 0 — both **before** the commit.
- `git status` clean after the commit, with the ignore rules unchanged.

#### Known gaps and TODO

- **Nothing has left this machine.** The work is committed but unpushed, and one
  local repository is one disk failure away from the same loss this step was meant
  to prevent. This is the top of the list until a remote exists.
- **The commit is not a launch signal.** Every P0 in the 2026-09-05 re-verification
  is still open — delivery is still a stub, the delay ranges are still estimates, the
  copy corrections are unmade, and Step 15's ~14 new `#` placeholders are all still
  dead. Committing changed the repository, not the product.
- The spec documents (`tool-spec-v1.md`, `DESIGN.md`, `BUILD-PROMPTS*.md`) are in the
  commit, as Step 1 decided. If this repository is ever made public, that is the
  decision to revisit first — see open question 17.

#### Next step

Unchanged from Step 15: the P0 human decisions from the 2026-09-05
re-verification. A remote, per open question 17, is now the one thing ahead of them.

#### Open questions for the human — new in this step

17. **Where should this repository live, and public or private?** There is no remote
    and no GitHub CLI on this machine, which is the only reason the push did not
    happen. Two things are needed: the remote URL, and a private/public call.
    **Private is the safe default** — the repo contains `tool-spec-v1.md`,
    `DESIGN.md` and the full product rationale, i.e. the unlaunched positioning of an
    Incentiv funnel, not just the code. Paste a URL and the push takes one command;
    or install `gh` (`winget install GitHub.cli`, then `gh auth login`, which has to
    be run by a human because it is interactive) and the repo can be created and
    pushed in one step.
18. **`master` or `main`?** This repo has been on `master` since Step 1, but GitHub
    defaults new repositories to `main` and the tooling around this project assumes
    `main` is the base branch. Renaming is one command **before** the first push and
    a small annoyance after it, so it is worth answering now:
    `git branch -m master main`. Say which you want.

### Step 17 — The remote, the first push, and the uncommitted layout pass — 2026-09-08

The human supplied the remote URL that Step 16 was missing —
`https://github.com/vipin801/Diligence-Readiness-Checker` — and asked for the work
to be pushed. It is pushed. **Open questions 17 and 18 are now closed by that
instruction**: the repository lives at that URL, and the branch is `main`.

The tree was not clean when this session started. Eight paths of undocumented
layout work were sitting in the working tree — six modified, two new — with no
`### Step` entry describing them. They are described below from the diff, not from
a brief, because there was no brief in this file to read. **If any of it was
mid-thought rather than finished, say so and it can be reverted in one commit.**

#### Done

- **Ran the pre-commit gate on the exact tree being committed.** `npm run test` —
  **536 passed, 7 files**. `npm run build` — exit 0, the same five static routes.
  Both green before anything was staged.
- **Added `origin`** and pushed `main`. The remote was empty (`git ls-remote`
  returned no refs), so this is its first content and there was nothing to
  reconcile or overwrite.
- **Committed the working tree** as one commit alongside this entry.

#### The uncommitted work, as read from the diff

| File | What changed |
|---|---|
| `src/app/page.tsx` | The home hero splits into a two-column `.home-grid`: intro left (label, an `h1` capped at `14ch`, subhead, stat line, "Start the check →"), and the nine check areas move into a `.home-scope` aside on the right under a "The scope" label and an `h2`. The area labels are now body text, not mono labels. |
| `src/app/tools/diligence-readiness/results-screen.tsx` | The register head becomes `.results-grid`: stat tiles, tally strip and sublines left, and the **readiness map moves up** into a `.results-aside` beside them instead of waiting in the summary band. Flag cards move to `.flag-layout` / `.flag-details`, with the delay figure and "Fixed by" in a two-column grid. Where `fixedBy` is `incentiv`, the label renders as the new logo component. |
| `src/app/tools/diligence-readiness/summary-visuals.tsx` | The timeline drops its Tailwind column utilities for named `.close-timeline` / `.timeline-row` / `.timeline-meta` / `.timeline-scale` classes, and loses the duplicate mobile start label. The readiness legend gains `.readiness-legend` and a no-wrap status cell. |
| `src/lib/summary.ts` | The readiness caption reads "The register **below** is the record", following the map's move above the register. |
| `src/app/tools/diligence-readiness/question-flow.tsx` | The option grid carries `data-choice-kind="single" \| "multiple"`, so Q2's multi-select can be laid out differently in CSS. Top padding normalised to `pt-16`. |
| `src/app/globals.css` | The layout classes behind all of the above, plus a change to the gate: the locked region loses its `max-height` cap and the blurred report becomes an absolutely-positioned cropped backdrop, so the **form's** height sets the region's height and validation messages can no longer push the card past the crop. |
| `src/components/ui/incentiv-logo.tsx` | **New.** `<IncentivLogo />` — `next/image`, `unoptimized`, 200×200, `alt="Incentiv"`, class `.incentiv-logo`. |
| `public/incentiv-logo.jpg` | **New.** 3.5 KB brand artwork behind that component. |

The gate still gates: `.gate-content[data-locked="true"]` keeps its blur, its
opacity and its `user-select: none`, and the split by content type from Step 14 is
untouched. The `alt` on the logo is exactly the string it replaces
(`FIXED_BY_LABEL.incentiv` is `"Incentiv"`), so the register reads the same to a
screen reader as it did before.

#### Files created and changed

- `LOG.md` — this entry, the file map rows for the two new files, and the status banner.
- No source file was touched by me this session. The commit carries the human's
  working tree as it stood, plus this entry.

#### Decisions made

| Decision | Choice | Why |
|---|---|---|
| Commit granularity | **One commit** for the layout pass + this entry | Same reasoning as Step 16: the changes arrived as one undifferentiated working tree, and inventing a sequence for them would be fiction. |
| Whether to review before committing | **Read the whole diff first, committed second** | The changes were not mine and were undescribed. Committing unread work is how a broken gate or a lost `alt` ships. |
| Commit message | Names the layout pass, not "Step 17" alone | The step number means nothing to anyone reading `git log` from the remote. |
| Push target | `main` → `origin/main`, tracking set | The remote was empty and the local branch was already `main`. |

#### Verified

- `npm run test` **536 passed** · `npm run build` exit 0 — both before the commit.
- `git ls-remote` on the supplied URL: reachable, **no refs**, so nothing was overwritten.
- Push completed; `origin/main` now matches local `main`.

#### Known gaps and TODO

- **The layout pass has not been seen in a browser by me.** Step 15's 36-screenshot
  pass is now out of date: the home page, the register head, the flag cards and the
  timeline all moved. Nothing here was re-shot at 375/768/1024/1440 in both themes.
  The tests pass, but 536 unit tests do not see a two-column grid collapse.
- **The repository is public.** `github.com/vipin801/Diligence-Readiness-Checker` is
  reachable without credentials, which means `tool-spec-v1.md`, `DESIGN.md`,
  `funding-readiness-product-thinking-v1.md` and this log — the unlaunched
  positioning of an Incentiv funnel, its flag table and its pitch copy — are now
  public too. That was open question 17's "private is the safe default", answered
  the other way. See open question 31 before adding anything further.
- **Nothing about launch readiness changed.** Every P0 in the 2026-09-05
  re-verification is still open, the five outbound URLs are still `#`, delivery is
  still a stub and the delay ranges are still estimates.

#### Next step

Unchanged: the P0 human decisions from the 2026-09-05 re-verification. Ahead of
them now sits a browser pass over the moved layout, and open question 31.

#### Open questions for the human — new in this step

31. **The repository is public. Was that deliberate?** The push succeeded against a
    URL that resolves anonymously, so the spec, the design system, the product
    rationale, the eleven flag rules and every pitch variant are readable by anyone
    with the link — including this log, which records what is not finished. If it
    should be private: GitHub → Settings → General → Danger Zone → Change
    visibility. Nothing in the repository is a secret in the credentials sense — no
    keys, no `.env`, no lead data — so this is a positioning call, not a security
    incident.
32. **Was the layout pass finished?** It is committed as found. The map moving above
    the register is the largest single change — the summary band now leads with the
    timeline alone, and the caption was updated to match — and it is the one most
    likely to have been mid-thought. Confirm, or name what to revert.

## Earlier open questions for the human — historical context
1. **The `.section-label` role changed.** Step 9's brief assigns eyebrow labels to
   IBM Plex Mono 300 / 12px / 0.08em uppercase, so `.section-label` is no longer
   Inter 700 / 10px / 0.15em — which `DESIGN.md` §3 and `CLAUDE.md` both call
   non-negotiable and "the brand fingerprint". Brand blue is unchanged. Is the mono
   eyebrow the intended new brand mark, or should `.section-label` revert to Inter and a
   separate mono role be used only for stat lines?
2. **May "estimated" be dropped from the results headline?** `4 issues found · estimated
   2–6 weeks of delay at close` runs to two lines of 56px display type on desktop.
   `4 issues found · 2–6 weeks of delay at close` fits on one, and is the exact form
   `CLAUDE.md` specifies. It is a product-copy and tone call, not a layout one.
3. **Are the Step 9 layout deviations from `DESIGN.md` approved?** Container 1120 (not
   1312), container padding 40 (not 64), section padding 48/96 (not 40/80, which are off
   the new spacing scale), badge text 14px (not 13px), and the reworked `.heading-hero` /
   `.heading-section` size ramps. If yes, `DESIGN.md` should be corrected at source.
4. **Where does a captured lead actually go?** This is now the most urgent item on the
   list. The gate asks for a name and a work email and promises "one email with your
   report" — and `src/lib/leads.ts` posts nowhere, so nothing is sent and the address is
   discarded when the tab closes. Wiring a destination is one `setLeadAdapter()` call in
   the root layout. Which provider (Formspree / HubSpot / Loops / a Vercel function), at
   which endpoint, and who renders and sends the report itself? Until this is answered the
   page makes a promise it cannot keep, and that is a launch blocker, not a TODO.
5. **The gate puts the two free fixes behind an email — is that the intended trade?**
   `CLAUDE.md` calls "give away at least two fixes the founder can do themselves, free,
   today, without Incentiv" non-negotiable, and says it is what makes this a tool rather
   than a funnel. The Step 11 brief explicitly gates all self-fix guidance. As built, the
   free half is the headline, the delay figure and the first two findings complete with
   the "why an investor asks" detail, and the fixes arrive with the emailed report.
   Confirm the change — and if it stands, `CLAUDE.md` should be corrected at source.
   The alternative is to lift the first two findings' fixes above the gate so the rule
   holds on the page itself.
6. **The blur is inspectable, and that is deliberate for v1.** The full report sits in
   the DOM behind a CSS filter, so devtools, view-source or reader mode will read it
   without an address. The audience is founders rather than adversaries, and the
   alternative — serving the gated half from an endpoint after submit — costs the
   no-backend constraint. Confirm this is acceptable at launch, and if so, what evidence
   (conversion, or a leak that actually matters) would make it worth revisiting.
7. **Should Q2 keep one Tab stop or six?** Step 10 gives Q2 checkboxes a roving tab stop —
   Tab enters the group once (at the first checked option, else the first) and arrow keys
   move inside it, which is what a radio group does natively and what makes "Tab moves
   between the two question groups" true on screen 1. The cost is that a Tab-only keyboard
   user reaches options 2–6 with arrows rather than Tab. Screen readers are unaffected.
   Keep it, or give every checkbox its own Tab stop and accept six stops on screen 1?
8. **Alignment vs white space on the paired screens.** The question prompt reserves two
   lines at ≥1024px so both option lists start on the same y. On screens 2 and 4, where
   both prompts are one line, that leaves ~34px empty under each. Removing the cost
   entirely means a CSS subgrid row shared by the columns, which requires dropping
   `<fieldset>`/`<legend>` for `role="group"` + `aria-labelledby`. Keep the reservation,
   take the subgrid and the weaker semantics, or accept that screen 3's two columns start
   34px apart?
9. **Two small copy calls made in Step 10.** The header row's "Diligence check" eyebrow was
   removed, because the screen's own label ("Ownership record") is now a brand-blue mono
   label 100px below it and two competing eyebrows read as noise — the wordmark already
   says which tool this is. And the last screen's button reads **"See my results"** rather
   than "Continue", since Continue is now visible on every screen. Both are reversible.
10. What are the approved delay ranges for all 11 flags, based on Incentiv's advisory data?
11. What are the five real destinations for Tabulate, Advisory, Funding Round Simulator,
   ESOP Tax Calculator and Valuation Calculator?
12. Who provides CA/CS/legal sign-off for the procedural guidance and Press Note 3 language?
13. Which analytics provider should replace the console adapter, and should `pitch_shown` mean
   rendered or actually scrolled into view?
14. Is the tool standalone or embedded, and what exact production origin should set
   `NEXT_PUBLIC_SITE_URL`?
15. Is **Diligence Readiness Check** the final public name?
16. Are the darker accessible primary button and small-label blues approved as brand exceptions?
17. Please supply/approve the favicon, logomark and Open Graph copy.
18. Confirm the fully parallel critical-path delay model, especially because it does not reproduce
    the spec's illustrative 5–9-week headline.
19. Confirm pitch priority, whether self-fix-only results should have no pitch, and the exact
    interaction destination for Advisory.
20. Should dark mode remain explicit-toggle-only or follow the operating-system preference?
21. Should more flags be owned by the founder/CA-CS, or is the current split correct?
22. Should the complete eight-answer sheet appear on non-clean results?
23. May the stale Word lock files be removed after the source documents are closed?

## Historical question ledger (superseded by the priority list above)

1. ~~**Cap-table product name — Tabulate or Equity?**~~ **RESOLVED 2026-09-04: Tabulate.**
   Recorded in `CLAUDE.md`. `DESIGN.md` §1 still lists the product as "Equity" and should be
   corrected at source, since it is otherwise the visual source of truth.
2. **Are the delay ranges calibrated yet?** The spec labels them placeholders and says they must
   come from Incentiv's 200+ company book — "this is the credibility of the whole tool and it
   can't be guessed." They now live together in `src/lib/flags.ts`, with all 11 entries marked
   `// CALIBRATE`, so real values can be swapped in with a single-file edit.
3. **Final tool name — "Diligence Readiness Check" or "Cap Table Health Check"?** Spec §8.3
   leaves this open. I assumed **Diligence Readiness Check** for the repo, the package name, and
   all docs; the route `/tools/diligence-readiness` follows from it. Changing it later means a
   route rename and a redirect.
4. **Deployment shape.** Is this a standalone app on its own host, or does the built page get
   embedded into the existing `incentiv.finance` site? This determines whether we need
   `basePath` / `assetPrefix`, `output: 'export'`, or a reverse proxy — and whether the tool
   renders its own nav and footer or inherits the site's. Assumed standalone for now;
   `next.config.ts` is left at defaults.
5. **"Email me this report" with no backend — NOW A LAUNCH BLOCKER.** §4 lists this as a
   secondary CTA, but the v1 constraints forbid a backend. Step 6 built the form as
   instructed: it validates, fires `email_submitted`, and **posts nowhere**. The address is
   deliberately kept out of the analytics event, so a submission today is discarded
   entirely while the page tells the founder "this register is queued for you@…".
   In development an extra line says no endpoint is wired; in production that line is
   compiled out. **This must not ship as-is.** Either give me an endpoint (`mailto:`,
   Formspree, HubSpot, Loops) or say the word and I will remove the form. The whole thing
   is `EmailCapture` in `src/app/tools/diligence-readiness/conversion.tsx`, marked with a
   `LAUNCH BLOCKER` comment.
6. ~~**Dark mode in v1?**~~ **BUILT in Step 7.** Every screen works in both themes, with an
   explicit toggle in the tool header, remembered across visits and applied before first
   paint. What remains a judgement call is whether it should also follow the OS setting —
   see the new open question 27.
7. **Real URLs for the outbound CTAs — still needed, now blocking.** Five of them: Tabulate,
   Advisory, and the routes into the existing Funding Round Simulator, ESOP Tax Calculator
   and Valuation Calculator (§4, item 5). All five are `#` in `OUTBOUND_URLS` in
   `src/lib/brand.ts` — one object, one edit. Every CTA the conversion layer renders
   currently goes nowhere, so `pitch_clicked` and `crosslink_clicked` will fire against a
   dead link. `hasPlaceholderUrls()` is exported from the same file for a pre-launch check.
8. **Analytics provider.** §7's five metrics (completion rate, median flags per user, CTA click
   rate, "term sheet in hand" share, email opt-in rate) all need event tracking, but there is no
   backend. Plausible / PostHog / GA4 / the existing site analytics? Nothing wired yet.
9. **Legal and tone sign-off.** Spec §8.2 requires a review that every line reads as "investors
   typically flag this" and never "you are non-compliant", and §8.4 flags the Press Note 3 wording
   specifically. Who reviews it, and at which step? I will write to that rule, but it needs a
   human pass before launch.
10. **Two stale MS Word lock files** (`~$ILD-PROMPTS.md`, `~$ol-spec-v1.md`) are sitting in the
    project root, which suggests those documents may still be open in Word somewhere. I left them
    alone and gitignored the `~$*` pattern. Safe to delete once the documents are closed.
11. **Brand blue: `#3482ff` or `hsl(214 100% 60%)`?** `DESIGN.md` presents these as the same
    colour, but they are not — `#3482ff` is `hsl(217 100% 60%)`. The gap is about 3° of hue and
    visually imperceptible, but they are different values. I used **`214 100% 60%`**, the HSL
    token `DESIGN.md` states explicitly, so the number in `globals.css` matches the number in the
    doc. If the hex is the real brand colour, say so and I will switch — it is a one-line change.
12. **Dark-mode values `DESIGN.md` does not specify.** It defines dark backgrounds, borders and
    foreground, but not `--muted-foreground` or `--primary-hover` for dark. I used
    `hsl(0 0% 62%)` for muted text (40% would be near-unreadable on `#0A0A0A`) and *lightened*
    the primary on hover (`214 100% 68%`) rather than darkening it, since darkening reads as
    "disabled" on a dark ground. Both are my inference, not the spec.
13. **`DESIGN.md` contradicts itself on the dark card colour.** §1 says `#0D0D0D` and §2 says
    `hsl(0 0% 7%)` (= `#121212`); likewise dark surface, `#1A1A1A` vs `hsl(0 0% 10%)`. I followed
    §1, which is what your Step 2 brief also specified. Worth fixing in the doc.
14. **Is the Blocker badge's red border tint acceptable?** Severity normally uses a red/amber/green
    ramp, which this palette forbids (no orange or yellow in chrome; blue reserved for chrome).
    So severity rides on the 6px dot — red / blue / gray — and Blocker alone also tints its
    border, since it is the one severity meant to stop a reader. If that is too much colour for
    the system, the tint comes out and the dot alone carries it.
15. **Favicon and brand assets.** `public/` still holds create-next-app's SVGs and the favicon is
    still Next's. Send Incentiv's favicon and logomark and I will wire them in. The OG image
    no longer needs supplying — Step 7 generates one at build from the design system — but if
    there is an art-directed card you would rather use, it replaces
    `src/app/opengraph-image.tsx` with a `.png` of the same name.

16. **The self-fix guidance names real forms and real deadlines — who signs off on it?**
    `src/lib/guidance.ts` is the first content in this repo that gives specific procedural
    advice: AOC-4 and MGT-7/MGT-7A for annual filings, DIR-3 KYC, ADT-1, PAS-3 within
    30 days of an allotment, MGT-14, SH-7, FC-GPR within 30 days and FC-TRS within 60,
    and the shape Indian founder vesting takes when the shares are already issued (a
    buy-back right in the founders' agreement, mirrored as a transfer restriction in the
    AoA). All of it is written as "what diligence looks for", never as an accusation, and
    all of it is my drafting, not Incentiv's. **A CS or CA should read the whole file
    before launch.** It is one file, roughly 150 lines of prose, and it is the single
    highest-risk content in the tool — it is also the thing that makes it a tool rather
    than a funnel, so it should not simply be cut.

17. **Only 2 of the 11 flags are founder-owned. Is that right?**
    `CLAUDE.md` says to give away at least two fixes the founder can do themselves.
    But `fixedBy` is `incentiv` for 9 of the 11 rules, so the self-fix column is at most
    two items and is frequently empty — a founder whose only flag is a departed cofounder
    would have got a results page with nothing free on it. I resolved this by writing free
    steps for **all 11** flags and keeping the split as "who closes it". If instead the
    intent was that more flags are genuinely founder-fixable (the spec's own table names
    `You + CS` and `You + Incentiv` for several), `flags.ts` should change and the split
    will follow.

18. **The spec's example headline is not reachable from the placeholder delays.**
    `tool-spec-v1.md` §3 illustrates `4 issues found · 5–9 weeks`. With the parallel
    critical-path model from Step 3 and the current placeholder ranges, four flags produce
    3–6 weeks; the largest result in the fixture set is 4–8. Either the placeholders are
    low or the aggregation should be less generous than fully-concurrent. This is the same
    calibration question as number 2, but it now has a visible consequence: the headline is
    the whole product, and it currently understates.

19. **Should the results screen show the founder's full answer sheet?**
    Each flag card shows the one answer that triggered it. Nothing shows the answers that
    *didn't* trigger anything (except in the clean state, where that is the whole point).
    Showing all eight would make the register feel more like a report and less like a
    verdict — but it also adds length to a page that is already long. Not built either way.

20. ~~**`.text-gradient` disappears in Windows High Contrast mode.**~~ **FIXED in Step 7.**
    A `@media (forced-colors: active)` block in `globals.css` drops the clip and restores
    `color: CanvasText`, so the headline survives High Contrast mode.

21. **Is the variant priority order right?** When several clusters fire at once, only one
    cap-table pitch renders, and the order in `CAP_TABLE_VARIANTS` decides which. I ranked
    it: the §1 cliffhanger first, then the two blockers (unknown instruments, departed
    founder), then the ROC-compounding story, then the weaker single-flag cases, with the
    ESOP pool last. That last one is a judgement call I am least sure about — a no-pool
    answer from a company about to hire is arguably a stronger pitch than a generic
    "your cap table is in a sheet". Reordering is a one-line move in a readable array.

22. **Should the pitch also appear for a founder with only self-fixable flags?**
    Today it does not — vesting-only, ROC-only and both-together all render the free
    guidance and then stop, with no pitch anywhere on the page. That is the strictest
    honest reading of "give away two, sell the other two", and I think it is right: there
    is genuinely nothing for a system to do. But it does mean a real slice of visitors see
    a page with no commercial ask at all. Confirm you are happy with that.

23. **"Talk to Advisory" is a conversation, not a click-through.** The advisory CTA
    currently points at `OUTBOUND_URLS.advisory` like any other link. If Advisory is
    actually a calendar booking, a form or an email, tell me which — the copy around it
    ("These run on statutory clocks") is written for someone about to start a
    conversation, and the destination should match that rather than dropping them on a
    marketing page.

24. **Analytics: which of these do you actually want?** Seven events are wired, which is
    more than §7's five metrics strictly need. `question_answered` fires on every one of
    the eight questions, which is what gives you a per-question drop-off funnel but is
    also the highest-volume event by far. If the eventual provider charges per event,
    that is the one to cut first.

25. **`pitch_shown` fires on render, not on visibility.** It counts pitches that were
    rendered into the page, not pitches a founder actually scrolled to. Click-through rate
    measured against it will therefore read low. An IntersectionObserver would fix that,
    but it changes the number's meaning mid-flight, so it is better decided before launch
    than after.

26. **The primary button is no longer exactly `#3482ff`. Confirm, or tell me to revert.**
    White text on brand blue measures **3.35:1** in a browser. WCAG AA wants 4.5:1 for
    14px button text, so the tool's single most important control — "Start the check",
    "Continue", "Send it to me" — failed AA in *both* themes. `.btn-primary` now fills
    with `--primary-strong`, `hsl(214 100% 48%)`, which is the same hue two points
    darker and measures 4.8:1. Everything else about the brand blue is untouched:
    `--primary` at `214 100% 60%` still fills every badge dot, border tint, focus ring,
    progress fill and the display gradient, exactly as DESIGN.md specifies.
    The same reasoning produced `--primary-text` (`214 100% 42%` light, `68%` dark) for
    small blue *text* — `.section-label` at 10px was 3.0:1 on cream, and it is the most
    repeated text in the system.
    Both are single lines in `globals.css` and revert in one edit. If the brand requires
    `#3482ff` on the button, say so and I will revert it and record the failure as a
    known, accepted exception instead.

27. **Dark mode: toggle-only, or should it follow the OS after all?**
    Old question 6 is now half-answered — dark mode is built and reachable on every
    screen. What is still my call rather than yours is the *entry point*: an explicit
    toggle, defaulting to light, remembered in `localStorage`. It does **not** follow
    `prefers-color-scheme`, because DESIGN.md is emphatically light-first and the tool is
    meant to sit on a light marketing page; a visitor with a dark OS would otherwise get
    a tool that disagrees with the site around it. If the tool ends up standalone rather
    than embedded (open question 4), following the OS becomes the better default and it
    is a two-line change in `src/lib/theme.ts`.

28. **The OG card is the first thing anyone sees, and nobody has reviewed its copy.**
    The whole premise is that founders forward this. The card currently reads
    *"Find what investors will flag / in your data room."* over
    *"A risk register, not a score — every issue investors typically flag, the delay it
    adds at close, and who fixes it."* with `8 questions · 90 seconds · free, no signup`.
    That is my drafting. It is also the one piece of copy that gets read by people who
    never open the tool, so it deserves the same tone review as the flags (open
    question 9). Regenerate by editing `src/app/opengraph-image.tsx`; the build emits it.

29. **`NEXT_PUBLIC_SITE_URL` needs to be set at deploy time, or the OG image 404s.**
    Scrapers require an absolute URL for `og:image`, so `metadataBase` is
    `https://incentiv.finance` by default. If the tool is served from anywhere else
    while the deployment shape is being settled (open question 4) — a preview URL, a
    subdomain, a subpath — the card and the canonical will both point at the wrong
    origin. One environment variable; it just has to be remembered.

30. **`loading.tsx` and `error.tsx` have not been seen rendering.**
    Both are written, both compile, both were read line by line — but neither was
    triggered in a browser this pass, because both need a deliberate setup (a throttled
    connection, an injected throw). Every other screen, including the 404 and the clean
    state, was rendered at three widths in both themes and looked at. Worth ten minutes
    with devtools' network throttling before launch.
