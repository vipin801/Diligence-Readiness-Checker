# Incentiv Design System

## 1. Visual Theme & Atmosphere

Incentiv's website is a light-first, editorial design built on warmth and institutional authority — a warm cream canvas (`#FDFCF9`) where India's private markets infrastructure feels both approachable and credible. The overall impression is one of considered precision: typography-led, with DM Serif Display's italic serifs at display sizes creating editorial gravitas that separates serious financial infrastructure from commodity fintech. This is not a SaaS template applied to finance — it is warmth as the native medium, where trust and depth coexist through typographic contrast, a restrained color palette, and meticulous structural detail.

The typography system uses three typefaces in deliberate roles: DM Serif Display for display and section headings (always italic, always with tight negative tracking), Inter with OpenType features `"cv02", "cv03", "cv04", "cv11"` for all UI text and body copy (clean, readable, functional), and IBM Plex Mono for statistics, financial figures, and code (monospaced precision for data-dense contexts). The combination creates a voice that is simultaneously editorial and precise — DM Serif for narrative authority, Plex Mono for numbers, Inter for everything in between.

The color system is anchored by a warm neutral base — cream backgrounds and warm gray surfaces — with a single chromatic brand accent: Incentiv blue (`#3482ff`). This blue appears on CTAs, primary interactive elements, section labels, and key brand moments. A gradient text treatment (primary blue → terracotta `#D4715D`) is reserved for high-impact display moments. Financial data uses semantic green (`#22C55E`) for positive values and semantic red for errors. The border system uses warm, slightly tinted borders (`#E5E2DC`) that feel organic rather than mechanical. The signature `page-edge-lines` effect — animated blue scan lines along the outer container edges — gives the site a distinctive infrastructural identity.

**Key Characteristics:**
- Light-mode-primary: `#FDFCF9` page background, `#F5F2ED` surface, `#FFFFFF` card
- Dark mode: `#0A0A0A` page background, `#0D0D0D` card, `#1A1A1A` surface
- DM Serif Display italic for all display/section headings — always italic, always tight tracking (-0.03em)
- Inter with `"cv02", "cv03", "cv04", "cv11"` for all UI text — these OpenType features are essential to Incentiv's Inter variant
- IBM Plex Mono weight 300 for stats and financial figures
- Brand blue: `#3482ff` / `hsl(214 100% 60%)` — the only chromatic color in UI chrome
- Gradient text: primary blue → terracotta `#D4715D` — reserved for high-impact headlines
- Warm borders: `#E5E2DC` — never cool gray, always temperature-matched to the cream base
- Radius: uniformly 4px — intentionally flat, signalling precision over friendliness
- Animated page-edge scan lines as the site's infrastructural signature
- Products: Equity · Transact · Folio · Advisory

## 2. Color Palette & Roles

### Background Surfaces (Light Mode)
- **Warm Cream** (`#FDFCF9` / `hsl(40 33% 98%)`): The page background — a barely-warm off-white that prevents the harshness of pure white while reading as clean and premium.
- **Warm Gray** (`#F5F2ED` / `hsl(36 26% 94%)`): Surface and secondary background — used for section alternation, muted card backgrounds, input fields, and hover states. (`--surface`)
- **Surface Elevated** (`hsl(36 20% 96%)`): Slightly lighter surface — for layered panels within surface sections. (`--surface-elevated`)
- **Pure White** (`#FFFFFF`): Card surfaces, dialog backgrounds, the "raised" layer above cream. (`--card`)
- **Warm Border** (`#E5E2DC` / `hsl(36 15% 88%)`): Default border — warm-tinted to match the cream base. (`--border`)

### Background Surfaces (Dark Mode)
- **Near Black** (`#0A0A0A` / `hsl(0 0% 4%)`): Page background in dark mode. (`--background`)
- **Dark Card** (`hsl(0 0% 7%)`): Card and primary panel background. (`--card`)
- **Dark Surface** (`hsl(0 0% 10%)`): Muted surface layer. (`--surface`)
- **Dark Elevated** (`hsl(0 0% 14%)`): Elevated panels, popovers. (`--surface-elevated`)
- **Dark Border** (`hsl(0 0% 18%)`): Default dark mode border. (`--border`)

### Text & Content
- **Primary Text** (`#1A1A1A` / `hsl(0 0% 10%)`): Near-black for maximum readability. Default heading and body text color. (`--foreground`)
- **Secondary Text** (`#666666` / `hsl(0 0% 40%)`): Mid-gray for body descriptions, supporting copy, and secondary labels. (`--muted-foreground`)
- **Muted Surface Text**: Used on `--surface` backgrounds — same as muted-foreground.
- **Inverted Text** (`hsl(40 20% 95%)`): Near-white text on dark backgrounds.

### Brand & Accent
- **Brand Blue** (`#3482ff` / `hsl(214 100% 60%)`): Primary brand color — CTAs, focus rings, active states, section labels, icon boxes, badge dots. (`--primary`)
- **Brand Blue Hover** (`hsl(214 100% 50%)`): Darker blue for button hover states. (`--primary-hover`)
- **Accent Blue** (`#3B82F6` / `hsl(217 91% 60%)`): Secondary accent — informational callouts, links. (`--accent`)
- **Navy** (`#0D2D78` / `hsl(222 72% 26%)`): Deep navy for high-contrast dark contexts. (`--navy`)
- **Purple** (`#6B5CE7` / `hsl(249 76% 63%)`): Extended palette accent — used sparingly for visual variety. (`--purple`)
- **Terracotta** (`#D4715D`): Gradient endpoint — pairs with brand blue in `.text-gradient`.

### Status & Financial
- **Success Green** (`#22C55E` / `hsl(142 71% 45%)`): Positive financial values, completion states, green indicators. (`--success`)
- **Destructive Red** (`hsl(0 84% 60%)`): Negative values, errors, warnings. (`--destructive`)

### Gradient
- **Primary Gradient** (`linear-gradient(135deg, #3482ff 0%, #5A9CFF 100%)`): Used for gradient backgrounds. (`--gradient-primary`)
- **Text Gradient** (`linear-gradient(135deg, hsl(var(--primary)) 0%, #D4715D 100%)`): Used with `.text-gradient` for high-impact display text. Blue to terracotta.
- **Subtle Gradient** (`linear-gradient(180deg, #F5F2ED 0%, #FDFCF9 100%)`): Section fade-ins from surface to background. (`--gradient-subtle`)

## 3. Typography Rules

### Font Family
- **Display / Headings**: `DM Serif Display`, with fallbacks: `Georgia, Times New Roman, serif` — always italic at display and section sizes
- **UI / Body**: `Inter`, with fallbacks: `system-ui, sans-serif` — OpenType features `"cv02", "cv03", "cv04", "cv11"` applied globally
- **Numbers / Statistics**: `IBM Plex Mono`, with fallbacks: `ui-monospace, SF Mono, Menlo, monospace`

### OpenType Features for Inter
`"cv02"` — disambiguates similar characters (e.g. `1`, `I`, `l`). `"cv03"` and `"cv04"` provide alternate lowercase `g` and `a` variants. `"cv11"` offers a single-storey `a`. Together these features give Incentiv's Inter a cleaner, more geometric character than default Inter — non-negotiable for the brand identity.

### Hierarchy

| Role | Class | Font | Size | Weight | Style | Line Height | Letter Spacing | Notes |
|------|-------|------|------|--------|-------|-------------|----------------|-------|
| Hero | `.heading-hero` | DM Serif Display | 36→60px (responsive) | 400 | italic | 1.10 | -0.03em | Hero headlines — editorial authority |
| Section | `.heading-section` | DM Serif Display | 20→36px (responsive) | 400 | italic | 1.15 | -0.03em | Section headings — `heading-section` class |
| Subsection | `.heading-sub` | Inter | 16–18px | 600 | normal | 1.35 | -0.02em | Card headings, feature titles |
| Body Large | `.text-body-lg` | Inter | 16–18px | 400 | normal | 1.65 | normal | Introduction paragraphs, feature descriptions |
| Body | `.text-body` | Inter | 14–16px | 400 | normal | 1.65 | normal | Standard reading text — `text-body` class |
| Nav | `.text-nav` | Inter | 12px | 400 | normal | 1.40 | 0.04em | Navigation links, metadata |
| Section Label | `.section-label` | Inter | 10px | 700 | normal | 1.40 | 0.15em | **Uppercase section labels** — brand fingerprint, primary color |
| Number Display | `.number-display` | IBM Plex Mono | 20–28px (responsive) | 300 | normal | 1.20 | -0.02em | Statistics, metrics — `number-display` class |
| Number Large | — | IBM Plex Mono | 40–48px | 300–600 | normal | 1.00 | -0.03em | Hero metrics, large financial figures |
| Button | — | Inter | 14px | 500–600 | normal | 1.00 | 0.02em | Button text — weight 500 primary, 500 secondary |
| Badge | — | Inter | 13px | 400 | normal | 1.00 | normal | Inline badge text |
| Mono Code | — | IBM Plex Mono | 13–14px | 400 | normal | 1.50 | normal | Code blocks, technical labels |

### Responsive Typography Scaling (`.heading-hero`)
| Breakpoint | Font Size |
|------------|-----------|
| Mobile (`<640px`) | 30px |
| SM (`640px`) | 36px |
| MD (`768px`) | 48px |
| LG (`1024px`) | 60px |

### Responsive Typography Scaling (`.heading-section`)
| Breakpoint | Font Size |
|------------|-----------|
| Mobile | 20px |
| SM | 24px |
| MD | 30px |
| LG | 36px |

### Principles
- **DM Serif italic is the editorial voice**: All DM Serif Display usage at display and section sizes is italic. The italic form is not stylistic variation — it is the brand's default expression. Never use DM Serif upright.
- **-0.03em tracking at every display size**: DM Serif headings always carry `letter-spacing: -0.03em`. This compression is part of the visual identity — it creates density and authority at large sizes.
- **OpenType as identity**: `"cv02", "cv03", "cv04", "cv11"` on Inter aren't decorative — they transform Inter into Incentiv's distinctive UI typeface. Without them it is generic Inter.
- **Monospace for financial truth**: IBM Plex Mono weight 300 signals data precision. Any statistic, financial value, or calculated output uses Plex Mono. The light weight is intentional — it prevents visual heaviness while maintaining the monospace rhythm.
- **Section labels are the rhythm**: 10px / Inter 700 / uppercase / 0.15em tracking / primary blue — this label appears above every major section as a category signal and is the most distinctive repeated element in the system.
- **Inter covers everything in between**: Navigation, body copy, button text, tooltips, captions — all Inter with OpenType features. The three-font system works because Inter handles the full range of UI text cleanly.

## 4. Component Stylings

### Buttons

**Primary Button (`.btn-primary`)**
- Background: `hsl(var(--primary))` — brand blue `#3482ff`
- Text: `#FFFFFF`
- Padding: `14px 28px` (`py-3.5 px-7`)
- Radius: `var(--radius)` — 4px
- Font: Inter 14px weight 500, letter-spacing 0.02em
- Hover: `hsl(var(--primary-hover))` + `translateY(-2px)` + `box-shadow: 0 4px 12px hsl(var(--primary) / 0.2)`
- Active: `translateY(0) scale(0.98)`
- Use: Primary CTAs ("Request Access", "Get Started", "Calculate Now")

**Secondary Button (`.btn-secondary`)**
- Background: transparent
- Text: `hsl(var(--foreground))` — `#1A1A1A`
- Padding: `14px 28px`
- Border: `1px solid hsl(var(--border))`
- Radius: `var(--radius)` — 4px
- Font: Inter 14px weight 500
- Hover: `border-color: hsl(var(--foreground))` + `bg-surface` + `translateY(-2px)`
- Use: Secondary CTAs, alternative actions

**Ghost Button (`.btn-ghost`)**
- Background: transparent
- Text: `hsl(var(--muted-foreground))` — `#666666`
- No border
- Font: Inter 14px weight 500
- Hover: text darkens to `hsl(var(--foreground))` + `translateX(2px)`
- Use: Tertiary actions, navigation text links

**Arrow CTA (`.cta-arrow`)**
- Background: transparent
- Text: `hsl(var(--primary))` — brand blue
- Font: Inter 14px weight 500
- Hover: gap between text and arrow widens + opacity 0.8
- Use: "Learn more", "See all features" — inline directional links

**Hero Lead Form Button (`.hero-cta-btn`)**
- Background: `hsl(var(--primary))`
- Text: white
- Padding: `10px 24px`
- Radius: 6px (slightly more rounded for the inline form context)
- Font: Inter 14px weight 600
- Use: Inline hero email capture CTAs

**Persona Chip (`.persona-chip`)**
- Background: transparent
- Text: `hsl(var(--muted-foreground))`
- Border: `1px solid hsl(var(--border))`
- Radius: 100px (pill)
- Font: Inter 12px weight 500
- Active: `background: hsl(var(--primary))`, white text, matching border
- Use: Audience persona selectors in hero section

### Cards & Containers

**Standard Card (`.card-elevated`)**
- Background: `hsl(var(--card))` — `#FFFFFF`
- Border: `1px solid hsl(var(--border))` — warm border
- Radius: `var(--radius)` — 4px
- Hover (`.card-hover`): `border-color: hsl(var(--primary) / 0.3)` + `translateY(-2px)`
- Use: Feature cards, content panels, info blocks, product cards

**Surface Section**
- Background: `hsl(var(--surface))` — `#F5F2ED`
- No border (background tint provides separation)
- Use: Alternating page sections, muted backgrounds, `.bg-gradient-subtle` fade sections

**Section Divider (`.section-divider`)**
- `border-top: 1px solid hsl(var(--border) / 0.6)`
- Zero height, no background — purely a hairline separator
- Use: Between every major page section

**Badge (`.badge`)**
- Display: inline-flex with 6px dot + text
- Border: `1px solid hsl(var(--border))`
- Padding: `8px 20px`
- Font: Inter 13px
- Dot: 6px circle, `hsl(var(--primary))`
- Radius: `var(--radius)` — 4px
- Use: Trust indicators, feature callouts, category tags in headers

**Icon Box (`.icon-box`)**
- Size: 48×48px
- Background: `hsl(var(--primary))` — brand blue
- Icon: white
- Radius: `var(--radius)` — 4px
- Use: Feature card icons, value proposition icons

### Inputs & Forms

**Text Input**
- Background: `hsl(var(--background))` or `hsl(var(--card))`
- Border: `1px solid hsl(var(--border))`
- Radius: `var(--radius-sm)` — 4px
- Focus: `border-color: hsl(var(--ring))` + `box-shadow: 0 0 0 3px hsl(var(--ring) / 0.1)`
- Font: Inter 14px
- Label: 10–11px Inter weight 500, muted-foreground color

**Hero Email Input (`.hero-email-input`)**
- Background: transparent inside the `.hero-lead-row` wrapper
- Padding: `10px 14px`
- Font: Inter 14px, foreground color
- No border — border is on the wrapper row
- Placeholder: muted-foreground color

**Hero Lead Row (`.hero-lead-row`)**
- Background: `hsl(var(--background))`
- Border: `1px solid hsl(var(--border))`
- Radius: 8px
- Padding: 4px (creates inner padding around input + button)
- Focus-within: `border-color: hsl(var(--primary) / 0.5)` + `0 0 0 3px hsl(var(--primary) / 0.1)`
- Use: Hero section email capture — the primary conversion component

### Background Patterns

**Grid (`.bg-grid`)**
- Radial gradient dots at 48×48px with connecting grid lines
- Dot: `hsl(var(--foreground) / 0.15)`, 1.5px
- Lines: `hsl(var(--border) / 0.7)`
- Use: Feature section backgrounds, hero backgrounds

**Grid Fade (`.bg-grid-fade`)**
- Same as `.bg-grid` but with a radial mask that fades the grid toward the edges
- Use: Sections that need a subtle grid without hard edges

**Lines (`.bg-lines`)**
- Diagonal crosshatch pattern via `::before` pseudo-element
- Lines: `hsl(var(--border) / 0.08)` at 60×60px
- Use: Light sections needing subtle texture

**Lines Dark (`.bg-lines-dark`)**
- Same crosshatch on `#0A0A0A` background
- Lines: `rgba(255,255,255,0.03)` at 80×80px
- Use: Dark full-bleed sections

### Page Edge Lines (`.page-edge-lines`)
The signature animated scan-line effect — two vertical 1px lines aligned with the outer edges of the `container-full` (1312px), each carrying an animated primary-blue light that scans downward on a 5s loop.
- Line: 1px solid
- Color: gradient from transparent → `hsl(var(--primary) / 0.8)` at center → transparent
- Animation: `scanLine 5s ease-in-out infinite`
- Position: `left: max(16px, calc((100vw - 1312px) / 2))` / `right: max(16px, calc((100vw - 1312px) / 2))`
- Use: Applied once at the `<Layout>` level — wraps the entire site

### Navigation
- Light sticky header on warm cream / white background
- Incentiv logomark left-aligned
- Links: `.text-nav` — Inter 12px weight 400, 0.04em tracking, `#666666`
- Active/hover: text darkens to `hsl(var(--foreground))`
- CTA: Brand blue `.btn-primary` right-aligned, 4px radius
- Bottom separator: `.section-divider` or `1px solid hsl(var(--border))`
- Mobile: hamburger collapse at 768px

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px, 128px
- Section vertical padding: 80px on desktop (`section-padding`), 40px on mobile
- Section rhythm: every major section separated by `.section-divider`

### Grid & Container
- Max content width: 1312px (`container-full`) with 64px horizontal padding on desktop, 24px on mobile
- Narrow content: `container-narrow` — `max-w-4xl` with `px-6`
- Wide content: `container-wide` — `max-w-7xl` with `px-6 lg:px-8`
- Hero: centered single-column with generous vertical padding
- Feature sections: 2–4 column grids for product/feature cards
- Persona cards: 5-column grid at desktop (one per audience type), stacked on mobile
- Full-width tinted surface sections with internal `container-full` constraints

### Whitespace Philosophy
- **Cream as canvas**: The warm cream background is the breathing room of the layout. Section separation uses `.section-divider` hairlines and surface-to-background alternation — not visible rule-heavy borders.
- **Typography does the structural work**: DM Serif Display at 48–60px section headings declare themselves. The display text is the primary section anchor — the `.section-label` above it provides categorization without visual noise.
- **Edge lines as frame**: The animated `page-edge-lines` create a subtle structural frame for the entire page — like the printed margins of a financial document. Content lives between these lines.
- **Financial data needs room**: Stats use `.number-display` (Plex Mono, large) with generous surrounding whitespace so figures read as significant.

### Border Radius Scale
All interactive and card-like elements use the same 4px radius system — this flat consistency is intentional.

| Token | Value | Use |
|-------|-------|-----|
| `--radius-sm` | 4px | Inputs, small buttons, compact elements |
| `--radius-md` | 4px | Cards, dropdowns |
| `--radius-lg` | 4px | Panels, featured cards |
| `--radius` | 4px | Default (same as all above) |
| 6px | (hero form context only) | Hero lead row inner button |
| 8px | (hero lead row wrapper) | Hero email capture row |
| 100px | Pill | Persona chips, status tags |
| 50% | Circle | Avatar images, status dots, badge dot indicator |

The uniformly flat 4px radius is a deliberate design decision — it signals precision and infrastructure, not consumer softness. Resist adding larger radii to cards or buttons.

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | `#FDFCF9` background, no shadow | Page canvas — the default neutral ground |
| Surface (Level 1) | `#F5F2ED` bg, no border | Muted section backgrounds, secondary surfaces |
| Card (Level 2) | `#FFFFFF` bg + `1px solid #E5E2DC` | Cards, inputs — primary raised surface |
| Hover Card | Card + `translateY(-2px)` + blue border tint | Interactive card hover state |
| Elevated (Level 3) | White bg + `0 4px 24px rgba(0,0,0,0.08)` shadow + `1px solid #E5E2DC` | Dropdowns, popovers, tooltips |
| Modal (Level 4) | White bg + 16px radius + `0 24px 48px rgba(0,0,0,0.15)` + `rgba(0,0,0,0.45)` backdrop | Modals, sheets, overlays |
| Focus | Brand blue ring + 3px offset + 0.1 opacity ring | Keyboard focus on all interactive elements |

**Shadow Philosophy**: On the warm cream canvas, elevation is communicated through background lightness stepping and warm border tints — not dramatic drop shadows. The cream-to-white step from page to card is legible without shadows. Elevated layers (dropdowns, popovers) use soft shadows: `0 4px 16px rgba(0,0,0,0.08)`. Modal backdrops use a 45% opacity dark overlay with `backdrop-filter: blur(4px)` for focus isolation.

**Dark mode elevation** uses luminance stepping: `#0A0A0A` → `hsl(0 0% 7%)` → `hsl(0 0% 10%)` → `hsl(0 0% 14%)` — each elevated layer is slightly lighter, using the same logic as Linear's dark mode system.

## 7. Do's and Don'ts

### Do
- Use DM Serif Display italic for ALL display and section headings — the italic form is non-negotiable
- Apply `letter-spacing: -0.03em` to all DM Serif Display — at all sizes, at all times
- Apply `font-feature-settings: "cv02", "cv03", "cv04", "cv11"` to all Inter usage — this is what makes it Incentiv's Inter, not generic Inter
- Use `.section-label` (10px / Inter 700 / uppercase / 0.15em tracking / primary blue) before every major section heading
- Build on warm cream (`#FDFCF9`) — the warmth is intentional and sets the brand apart from cold, clinical fintech
- Use warm borders (`#E5E2DC`) — never cool gray borders; the temperature consistency is essential
- Keep radius at 4px across all card-like and interactive elements — the flat aesthetic is a deliberate signal
- Reserve brand blue for primary CTAs, section labels, icon boxes, and focus rings — it is the only chromatic color in UI chrome
- Use IBM Plex Mono weight 300 for statistics and financial figures — the light weight is intentional
- Use `.section-divider` between every major section — it provides rhythm without visual heaviness
- Include `.page-edge-lines` at the layout level — the animated scan lines are the site's infrastructural signature

### Don't
- Don't use DM Serif Display upright (non-italic) — the brand requires the italic form at all display and section sizes
- Don't omit `letter-spacing: -0.03em` on DM Serif headings — it is part of the visual identity
- Don't skip the Inter OpenType features — without them it reads as generic, not Incentiv
- Don't use pure white (`#FFFFFF`) as the page background — `#FDFCF9` is the warm cream foundation
- Don't introduce warm orange or yellow into the UI chrome — the accent palette is blue only (terracotta appears only in gradient text contexts)
- Don't display financial figures in Inter or DM Serif — always IBM Plex Mono for numbers
- Don't add radius beyond 4px on buttons, cards, or inputs — the flat aesthetic is intentional
- Don't use dramatic drop shadows on light mode cards — warm borders and translateY lift communicate elevation here
- Don't apply brand blue decoratively — it appears only on interactive elements, labels, and brand moments
- Don't use `.text-gradient` on small or body text — the blue-to-terracotta gradient is reserved for hero or display-scale moments only
- Don't remove `.page-edge-lines` from the layout — it is part of the brand identity, not a decoration

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <640px | Single column, 24px container padding, 40px section padding, stacked forms |
| SM | 640px | Two-column grids begin, hero form row layout |
| MD (`768px`) | 768px | Navigation expands, persona card grid |
| LG (`1024px`) | 1024px | Full card grids, 5-column persona grid, expanded typography |
| XL (`1280px`) | 1280px | Full layout, generous margins |
| 2XL (`1400px`) | 1400px | Tailwind container max screen |
| Container Max | 1312px | `container-full` max-width, 64px padding |

### Touch Targets
- Buttons: minimum 44px height; `.btn-primary` and `.btn-secondary` achieve this via `py-3.5`
- Navigation links: adequate spacing with 12px font and 0.04em tracking
- Persona chips: `6px 12px` padding, 100px radius, minimum 32px height
- Hero form: full-width stacked column on mobile with large tap targets
- Badge elements: `8px 20px` padding ensures comfortable tap area

### Collapsing Strategy
- Hero headline: 60px (LG) → 48px (MD) → 36px (SM) → 30px (mobile); `-0.03em` tracking maintained at all sizes
- Section headings: 36px (LG) → 30px (MD) → 24px (SM) → 20px (mobile)
- Navigation: horizontal links + CTA → hamburger menu at 768px
- Persona cards: 5-column → 3-column → 2-column → single-column (scroll-activated grayscale on mobile)
- Feature cards: 3-column → 2-column → single-column stack
- Hero lead form: side-by-side input + button row → stacked column (transparent borders, each element full-width)
- Section padding: 80px → 40px on mobile
- Container padding: 64px → 24px on mobile
- Page edge lines: `max(16px, calc(...))` formula ensures they stay visible even on narrow viewports (min 16px from edge)

### Number Display on Mobile
- `.number-display` uses responsive `text-xl sm:text-2xl md:text-3xl` — Plex Mono scales gracefully
- Large hero metrics should reduce from 48px to 32–36px on mobile
- Never break financial figures across lines — use `whitespace-nowrap` or ensure adequate container width

## 9. Agent Prompt Guide

### Quick Color Reference
- Page Background: Warm Cream (`#FDFCF9` / `hsl(40 33% 98%)`)
- Card: White (`#FFFFFF`)
- Surface: Warm Gray (`#F5F2ED` / `hsl(36 26% 94%)`)
- Primary Text: Near Black (`#1A1A1A`)
- Secondary Text: Mid Gray (`#666666` / `hsl(0 0% 40%)`)
- Brand Blue (CTA): `#3482ff` / `hsl(214 100% 60%)`
- Brand Blue Hover: `hsl(214 100% 50%)`
- Success Green: `#22C55E`
- Warm Border: `#E5E2DC` / `hsl(36 15% 88%)`
- Focus Ring: Brand Blue
- Gradient: `linear-gradient(135deg, #3482ff 0%, #D4715D 100%)`
- Dark Background: `#0A0A0A` / `hsl(0 0% 4%)`

### Example Component Prompts
- "Create a hero section on `#FDFCF9` background. Section label above: `PRIVATE MARKETS INFRASTRUCTURE` in `.section-label` style (10px Inter bold uppercase 0.15em tracking, `#3482ff`). Headline in DM Serif Display italic, 60px, weight 400, letter-spacing -0.03em, color `#1A1A1A`. Below: 18px Inter weight 400, line-height 1.65, color `#666666`. Hero lead form with warm-border wrapper (8px radius), email input (transparent bg), and `.hero-cta-btn` (brand blue, 6px radius, `10px 24px` padding, Inter 14px weight 600)."
- "Design a feature card: white `#FFFFFF` background, `1px solid #E5E2DC` border, 4px radius. Section label at top: 10px Inter bold uppercase 0.15em tracking in brand blue. Icon box 48×48px: brand blue background, white icon, 4px radius. Heading: Inter 18px weight 600 letter-spacing -0.02em, `#1A1A1A`. Body: Inter 15px weight 400 color `#666666` line-height 1.65."
- "Build a statistics section on `#F5F2ED` surface. Section label: 10px Inter bold uppercase in brand blue. Stat value: IBM Plex Mono weight 300, 28–36px, letter-spacing -0.02em, color `#1A1A1A`. Stat description: Inter 14px weight 400, color `#666666`."
- "Create navigation: sticky header on `#FFFFFF` with `1px solid hsl(36 15% 88%)` bottom border. Inter 12px weight 400 0.04em tracking links in `#666666`. Brand blue `.btn-primary` right-aligned, `12px 20px` padding, 4px radius. Include `.page-edge-lines` animated scan lines at layout level."
- "Design a persona audience card: white bg, `1px solid #E5E2DC` border, 4px radius. Top: `.section-label` in primary blue. Image block with `lg:grayscale lg:group-hover:grayscale-0` transition. Description: Inter 14px weight 400, `#666666`. Arrow icon right-aligned in primary blue."

### Iteration Guide
1. `.section-label` is mandatory above every major heading — always 10px / Inter 700 / uppercase / 0.15em tracking / primary blue
2. DM Serif Display is always italic with `-0.03em` letter-spacing — both rules apply at every size, every context
3. Three typefaces, three domains: DM Serif Display (narrative headings), Inter with OT features (all UI), IBM Plex Mono (all numbers/stats)
4. Border radius is 4px everywhere — resist the urge to round anything further
5. Brand blue (`#3482ff`) is the only chromatic accent in UI chrome — all other colors are warm neutrals
6. Borders use warm tints (`#E5E2DC`) not cool grays — temperature consistency is foundational
7. `.page-edge-lines` is a layout-level component — it belongs in `<Layout>`, not on individual pages
8. Surface elevation: cream → warm gray → white — no dramatic shadows except on elevated overlays
9. IBM Plex Mono weight 300 for statistics — the light weight signals data precision without visual heaviness
10. `.section-divider` between every major section — use it consistently for page rhythm
11. The text gradient (blue → terracotta `#D4715D`) is a display-scale accent only — never on body text
12. Dark mode background is `#0A0A0A`, not `#000000` — preserve the warm undertone at every level

