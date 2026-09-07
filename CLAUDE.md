@AGENTS.md

# Diligence Readiness Check

**One-liner:** A free, no-signup web tool at `incentiv.finance/tools/` that asks a
founder 8 multiple-choice questions (~90 seconds) and returns a *risk register* —
the specific things investors will flag in their data room, each with a severity,
an estimated delay in weeks, and who fixes it — headlined as a time cost, not a score.

Incentiv is India private-markets infrastructure (cap table/ESOP, fund ops,
secondaries, advisory). This tool is top-of-funnel for the cap-table product,
which is called **Tabulate** — confirmed by the human on 2026-09-04. Use that
name in all CTA copy. DESIGN.md §1 calls it "Equity"; DESIGN.md is wrong on
this point and right about everything visual.

---

## Session protocol — NON-NEGOTIABLE

1. **Read `LOG.md` FIRST**, before any other file, at the start of every work session.
2. **Update `LOG.md` at the END of every work session** — append a new `### Step N` entry
   with Done / Files created+changed / Decisions made / Known gaps+TODO / Next step,
   and refresh the **File map** and **Open questions for the human** sections.
3. Anything you had to guess goes under **Open questions for the human**. Never silently guess.

## Source-of-truth files

| File | Authority over |
|---|---|
| `LOG.md` | Project state. Read first, always. |
| `tool-spec-v1.md` | Product behaviour — questions, flags, severities, copy, results structure. |
| `DESIGN.md` | Visual design — colors, type, components, layout, do's and don'ts. |
| `BUILD-PROMPTS.md` | The 8-step build plan. Reference only; do not run ahead of the current step. |
| `funding-readiness-product-thinking-v1.md` | Background rationale. Context, not spec. |
| `AGENTS.md` | Next.js 16 framework rules (auto-generated). Obey it. |

If `tool-spec-v1.md` and `DESIGN.md` conflict, spec wins on behaviour, DESIGN wins on looks.

---

## Product constraints — NON-NEGOTIABLE for v1

> **Two of these were superseded by Step 11 (2026-09-05), on the human's direct
> instruction: the results page now carries a name + work-email gate.** The bullets below
> are left as written because they are the human's own document — but where they and the
> code disagree, **the code is current**. Read `LOG.md` Step 11 and open questions 4–6
> before changing any of it. Specifically: *"No signup wall"* and *"Results are not gated"*
> now hold only for the headline, the delay figure and the first two findings, which are
> free to an anonymous visitor and always will be; everything past them is blurred until a
> name and a work email are given. The tone constraint below — two free fixes — is affected
> too, and is open question 5. Everything else in this block (no backend, no accounts, no
> database, no LLM, no upload, no score) is unchanged and still binding.

- **No backend.** Static page + client-side JS only. No API routes that hold state.
- **No auth. No accounts. No signup wall.** The tool must be fully usable by an anonymous visitor.
- **No database.** No persistence of user answers server-side.
- **No AI / LLM calls.** Scoring is a deterministic rules table, not a model.
- **No cap-table upload, no file upload, no PDF parsing.**
- **No score.** Never a 0–100 or a weighted average. Output is a risk register headlined
  as `N issues found · X–Y weeks of delay at close`.
- **Results are not gated.** `Email me this report` is optional capture with no wall.

Also explicitly out of scope in v1: term sheet parsing, investor matching, benchmarking,
PDF export, saved/shareable results.

## Tone constraints

- Always *"investors typically flag this"* / *"a partner will ask for"* — **never**
  *"you are non-compliant"*, never legal accusation. Evidence, not accusation.
- Give away at least **two** fixes the founder can do themselves, free, today, without
  Incentiv. Sell the other two. This is what makes it a tool, not a funnel.
- The pitch attaches to the specific flag it solves. **Never a banner ad.**
- Press Note 3 (Q6 land-border) wording must be factual and non-alarming.

---

## Design constraints — from DESIGN.md

> **Superseded in part by Step 9 (2026-09-04).** A layout and type pass, run on the
> human's direct instruction, changed the container, the spacing scale, the type scale
> and the `.section-label` role. **Where this section and the code disagree, the code is
> current** — read `LOG.md` Step 9 and open questions 1–3 before changing any of it.
> Everything not listed there (colours, radii, elevation, motion, the three typefaces,
> severity shapes, touch targets, the edge lines) is unchanged and still binding.
>
> The short version of what moved: one container `.container-tool` at **1120px / 24px
> mobile / 40px desktop** replaces `container-full` (1312/64); spacing snaps to
> **4/8/12/16/24/32/48/64/96**, so section padding is 48/96 not 40/80; the type scale is
> **display 56/60 · h1 40/44 · h2 28/34 · h3 20/28 · body 16/26 · small 14/22 ·
> mono-label 12/16 @ 0.08em**; and `.section-label` is now **IBM Plex Mono 300 / 12px /
> 0.08em**, still brand blue, rather than Inter 700 / 10px / 0.15em.

**Colors**
- Page background: warm cream `#FDFCF9` — never pure white.
- Surface: warm gray `#F5F2ED`. Card: white `#FFFFFF`.
- Text: `#1A1A1A` primary, `#666666` secondary.
- Borders: warm `#E5E2DC` — never cool gray.
- Brand blue `#3482ff` is the **only** chromatic color in UI chrome. Never decorative.
- Success `#22C55E`. Text gradient blue → terracotta `#D4715D`, display scale only.
- Dark mode base `#0A0A0A` (not `#000000`). Every screen must work in both themes.
- Severity is never carried by colour alone: each badge has a written label
  **and** a distinct marker shape (disc / ring / bar).

**Type — three faces, three jobs**
- `DM Serif Display` — display + section headings. **Always italic. Always `-0.03em`.** Never upright.
- `Inter` — all UI/body text, with `font-feature-settings: "cv02","cv03","cv04","cv11"` applied
  globally. Non-negotiable; without them it is generic Inter.
- `IBM Plex Mono` weight 300 — every number, stat, and financial figure. Never numbers in Inter or DM Serif.

**Structure**
- `.section-label` above every major heading: 10px / Inter 700 / uppercase / `0.15em` / brand blue.
- Border radius **4px everywhere**. Exceptions only: 6px hero form button, 8px hero lead row,
  100px pills, 50% circles. Never round cards or buttons further.
- `.section-divider` hairline between every major section.
- `.page-edge-lines` animated scan lines live at the layout level, once. Do not remove.
- Elevation via background stepping (cream → warm gray → white) + warm borders + `translateY(-2px)`.
  No dramatic drop shadows in light mode.
- Container max 1312px, 64px desktop padding / 24px mobile. Section padding 80px desktop / 40px mobile.
- Touch targets ≥44px.

---

## Where the design system lives

`src/app/globals.css` is the token layer and the only place colours, type sizes,
radii and the component classes are defined. It uses DESIGN.md's own class names
(`.section-label`, `.heading-hero`, `.btn-primary`, `.card-elevated`, `.badge`,
`.section-divider`, `.page-edge-lines`) so the spec and the code stay greppable
against each other. Never hard-code a hex in a component — use the tokens.

`src/components/ui/` holds the primitives (Button, Card, Badge, ProgressBar,
RadioOption, CheckboxOption, SectionLabel), re-exported from `@/components/ui`.
They are presentational only and hold no state.

`/styleguide` was deleted in Step 7, as planned. Do not recreate it.

`src/components/layout/` holds the chrome: `page-edge-lines.tsx` (the signature
scan lines, rendered once in the root layout), `site-nav.tsx` (the sticky site
nav), `site-footer.tsx`, `tool-link-cards.tsx` and `theme-toggle.tsx`.

> **Superseded in part by Step 15 (2026-09-07)**, on the human's direct
> instruction, from a pasted build prompt. `tool-header.tsx` is **deleted** —
> `site-nav.tsx` and `site-footer.tsx` replaced it on every page, so the tool now
> wears the marketing site's chrome rather than a two-item header. The tool also
> lost its intro splash (question one is on screen at load), the eight questions
> regrouped from four paired screens into **three steps**, a 380px editorial rail
> carries the page `<h1>` and a scope accordion, and the register gained a
> Blocking / To tidy / Clear tally strip. **The no-score rule was re-confirmed by
> the human and holds**: the prompt's `6/9` verdict was rejected, and the tally
> strip is a partition of the nine check areas, not a mark out of them. The gate
> and the eight questions are unchanged. Read `LOG.md` Step 15 and open questions
> 11–16 before changing any of it.

**Dark mode** is class-based (`.dark` on `<html>`), light by default, and set by
an explicit toggle whose choice is remembered in `localStorage` under
`incentiv-theme`. It deliberately does **not** follow `prefers-color-scheme` —
DESIGN.md is light-first and the tool sits on a light marketing page. A blocking
inline script in the root layout applies the stored theme before first paint.
The only thing ever persisted is the word "light" or "dark".

**Two contrast tokens exist alongside the brand blue, and they matter:**
`--primary-text` for small blue *text* (`.section-label`, `.cta-arrow`, list
numerals) and `--primary-strong` for the `.btn-primary` fill. Brand blue
`#3482ff` measures 3.0:1 as text on cream and 3.35:1 behind white button text —
both fail WCAG AA. `--primary` itself is unchanged and still fills every dot,
border, ring and gradient exactly as DESIGN.md specifies. Never reach past these
tokens to `--primary` for text or for a button background.

## Commands

```bash
npm run dev     # dev server → http://localhost:3000
npm run build   # production build — must pass before any commit
npm run lint    # eslint
npm run test    # Vitest unit suite (single run)
npm start       # serve the production build
```

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · ESLint.
`src/` directory, `@/*` → `./src/*`.
