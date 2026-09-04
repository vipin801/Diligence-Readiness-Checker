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
| `src/app/layout.tsx` | Root layout. **Fonts and `.page-edge-lines` will live here (Step 2).** |
| `src/app/page.tsx` | Default Next starter page. **Placeholder — to be replaced.** |
| `src/app/globals.css` | Global styles. **Design tokens will live here (Step 2).** |
| `src/app/favicon.ico` | Default favicon. To be replaced with Incentiv's. |
| `public/` | Static assets (default Next SVGs; to be cleaned out). |

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

## Open questions for the human

1. **Cap-table product name — Tabulate or Equity?** `tool-spec-v1.md` calls it **Tabulate**
   throughout ("See your real number in Tabulate"); `DESIGN.md` §1 lists Incentiv's products as
   **Equity · Transact · Folio · Advisory**. Every CTA on the results screen depends on this.
   I have not guessed — no product name appears anywhere in the code yet. Needed before Step 6.
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
6. **Dark mode in v1?** `DESIGN.md` specifies a complete dark palette. Does this tool need it, or
   is light-only acceptable for v1? Assumed light-first, with the dark tokens defined but not
   wired to a toggle, since the tool is a one-shot flow on a public marketing page.
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
