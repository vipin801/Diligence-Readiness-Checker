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

**Colors**
- Page background: warm cream `#FDFCF9` — never pure white.
- Surface: warm gray `#F5F2ED`. Card: white `#FFFFFF`.
- Text: `#1A1A1A` primary, `#666666` secondary.
- Borders: warm `#E5E2DC` — never cool gray.
- Brand blue `#3482ff` is the **only** chromatic color in UI chrome. Never decorative.
- Success `#22C55E`. Text gradient blue → terracotta `#D4715D`, display scale only.
- Dark mode base `#0A0A0A` (not `#000000`).

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

`/styleguide` renders every token and primitive in both modes. **It is temporary
and must be deleted before launch** — remove `src/app/styleguide/`; nothing else
imports from it.

## Commands

```bash
npm run dev     # dev server → http://localhost:3000
npm run build   # production build — must pass before any commit
npm run lint    # eslint
npm start       # serve the production build
```

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · ESLint.
`src/` directory, `@/*` → `./src/*`.
