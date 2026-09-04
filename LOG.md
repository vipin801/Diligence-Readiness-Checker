# Build Log — Diligence Readiness Check
Running record for any AI agent or developer picking this project up.
Read this file FIRST, before any other file.

## Project summary

The Diligence Readiness Check is a free, no-signup web tool for `incentiv.finance/tools/`.
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
| Language | TypeScript 5, `strict: true` | Scoring is a rules table — typed flags/severities catch mismatches at build time. |
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
| No features yet | Starter page left untouched | Step 1 is setup only per `BUILD-PROMPTS.md`. |
| Cap-table product name | **Tabulate** | Confirmed by the human 2026-09-04, resolving the Tabulate-vs-Equity conflict. DESIGN.md §1 is wrong on this; the spec is right. |
| Token format | Bare HSL triplets (`214 100% 60%`) in `:root`/`.dark`, mapped through `@theme inline` | Lets every token take an alpha channel — `hsl(var(--primary) / 0.3)` — and re-resolve on theme change, which a hex cannot do. |
| Dark mode strategy | Class-based (`.dark`), light by default; `.light` re-asserts the light palette | DESIGN.md is light-first, so the tool must not flip with the OS. The `.light` twin lets the styleguide pin both modes on one page. |
| Component CSS naming | DESIGN.md's own class names in `globals.css` (`.btn-primary`, `.card-elevated`, `.section-label`…) | Keeps spec and code greppable against each other; React primitives stay thin wrappers. |
| Option controls | Real `<input>` + CSS sibling selectors, not JS state classes | Native keyboard nav, form semantics and screen-reader grouping for free. `peer-*` variants could not reach the nested indicator. |
| `clsx` + `tailwind-merge` | Added as deps | A 2-package `cn()` so every primitive accepts a `className` override without specificity fights. |
| Fonts | `next/font/google`, self-hosted; DM Serif Display loaded **italic-only** | The brand never uses it upright, so the upright face is dead weight. Self-hosting also means no Google requests at runtime. |
| Severity colour | Carried by the 6px badge dot; Blocker alone tints its border | DESIGN.md forbids orange/yellow and reserves blue for chrome, which rules out a red/amber/green ramp. Red is sanctioned for "warnings". |
| Starter home page | Replaced with a placeholder | It depended on the Geist fonts Step 2 removed, so it could not be left as-is. |

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
| `README.md` | Default Next.js readme. Not yet rewritten. |
| `package.json` | Deps and scripts (`dev`, `build`, `start`, `lint`). |
| `package-lock.json` | Locked dependency tree. |
| `tsconfig.json` | TS config; `@/*` → `./src/*` path alias. |
| `next.config.ts` | Next config. Currently empty defaults. |
| `postcss.config.mjs` | Tailwind v4 PostCSS plugin. |
| `eslint.config.mjs` | Flat ESLint config. |
| `.gitignore` | Node/Next ignores + Office `~$*` lock files + encoding backup. |
| `src/app/layout.tsx` | Root layout — loads the three fonts, renders `<PageEdgeLines />`, sets metadata. |
| `src/app/page.tsx` | Placeholder home page linking to the styleguide. Not the tool. |
| `src/app/globals.css` | **The token layer.** Colours, type roles, component classes, edge lines. Single source for all styling. |
| `src/app/favicon.ico` | Default favicon. To be replaced with Incentiv's. |
| `public/` | Static assets (default Next SVGs; now unused, to be cleaned out). |
| `src/lib/cn.ts` | `cn()` class-merge helper (clsx + tailwind-merge). |
| `src/components/layout/page-edge-lines.tsx` | The signature animated scan lines. Rendered once, in the root layout. |
| `src/components/ui/index.ts` | Barrel re-export — import primitives from `@/components/ui`. |
| `src/components/ui/button.tsx` | `Button` + `ButtonLink`; variants primary / secondary / ghost / arrow. |
| `src/components/ui/card.tsx` | `Card`; elevations card / surface / raised, optional `interactive` hover. |
| `src/components/ui/badge.tsx` | `Badge`; tones neutral / blocker / delay / cleanup / success. Flag severity. |
| `src/components/ui/progress-bar.tsx` | `ProgressBar` for the 8-question track. |
| `src/components/ui/radio-option.tsx` | `RadioOption` — single-answer question choice. |
| `src/components/ui/checkbox-option.tsx` | `CheckboxOption` — multi-select choice (Q2). |
| `src/components/ui/section-label.tsx` | `SectionLabel` — the mandatory 10px uppercase blue label. |
| `src/app/styleguide/page.tsx` | **TEMPORARY** — styleguide route shell + `noindex` metadata. Delete before launch. |
| `src/app/styleguide/styleguide-client.tsx` | **TEMPORARY** — the styleguide itself. Delete before launch. |

**Planned but not yet created** — the tool's route is `/tools/diligence-readiness`, so it will
live at `src/app/tools/diligence-readiness/page.tsx`. The scoring rules table belongs in
`src/lib/` as pure, testable TypeScript with no React imports.

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


## Open questions for the human

1. ~~**Cap-table product name — Tabulate or Equity?**~~ **RESOLVED 2026-09-04: Tabulate.**
   Recorded in `CLAUDE.md`. `DESIGN.md` §1 still lists the product as "Equity" and should be
   corrected at source, since it is otherwise the visual source of truth.
2. **Are the delay ranges calibrated yet?** The spec labels them placeholders and says they must
   come from Incentiv's 200+ company book — "this is the credibility of the whole tool and it
   can't be guessed." I will implement the placeholder numbers as data in one editable file so
   real values can be swapped in with a single edit, but someone has to supply them.
3. **Final tool name — "Diligence Readiness Check" or "Cap Table Health Check"?** Spec §8.3
   leaves this open. I assumed **Diligence Readiness Check** for the repo, the package name, and
   all docs; the route `/tools/diligence-readiness` follows from it. Changing it later means a
   route rename and a redirect.
4. **Deployment shape.** Is this a standalone app on its own host, or does the built page get
   embedded into the existing `incentiv.finance` site? This determines whether we need
   `basePath` / `assetPrefix`, `output: 'export'`, or a reverse proxy — and whether the tool
   renders its own nav and footer or inherits the site's. Assumed standalone for now;
   `next.config.ts` is left at defaults.
5. **"Email me this report" with no backend.** §4 lists this as a secondary CTA, but the v1
   constraints forbid a backend. Which is it — a `mailto:` link, a third-party form endpoint
   (Formspree / HubSpot / Loops), or deferred to v2? Not built; no assumption baked in.
6. **Dark mode in v1?** `DESIGN.md` specifies a complete dark palette, and it is now fully
   implemented and visible in the styleguide — but nothing in the product turns it on. Should the
   tool ship a toggle, follow the OS setting, or stay light-only? Assumed **light-only**: the
   tool is a one-shot flow on a light-first marketing page, so flipping with the visitor's OS
   would clash with the surrounding site.
7. **Real URLs for the outbound CTAs** — "Talk to Advisory", plus the routes into the existing
   Funding Round Simulator, ESOP Tax Calculator and Valuation Calculator (§4, item 5).
   Clearly-marked `#` placeholders will be used until these are supplied.
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
    still Next's. Send Incentiv's favicon, logomark and any OG image and I will wire them in.
