"use client";

/**
 * TEMPORARY — delete this whole directory before launch. See page.tsx.
 *
 * Renders every design token, type role and primitive in both light and dark,
 * side by side, so the system can be eyeballed against DESIGN.md before any
 * tool feature is built.
 */

import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  CheckboxOption,
  ProgressBar,
  RadioOption,
  SectionLabel,
} from "@/components/ui";

/* ------------------------------------------------------------------ helpers */

/** Renders its children twice — once pinned light, once pinned dark. */
function DualMode({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius)] border border-border bg-border lg:grid-cols-2">
      {(["light", "dark"] as const).map((mode) => (
        <div key={mode} className={`${mode} bg-background p-6`}>
          <p className="mb-5 font-mono text-[10px] font-light uppercase tracking-[0.15em] text-muted-foreground">
            {mode}
          </p>
          {children}
        </div>
      ))}
    </div>
  );
}

function Section({
  label,
  title,
  note,
  children,
}: {
  label: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section-padding">
      <SectionLabel className="mb-3">{label}</SectionLabel>
      <h2 className="heading-section mb-2 text-foreground">{title}</h2>
      {note && (
        <p className="text-body mb-8 max-w-2xl text-muted-foreground">{note}</p>
      )}
      {!note && <div className="mb-8" />}
      {children}
    </section>
  );
}

/** Small monospace annotation — the spec behind the specimen. */
function Spec({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 font-mono text-[11px] font-light leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}

function Swatch({
  name,
  token,
  hex,
  raw = false,
}: {
  name: string;
  token: string;
  hex: string;
  raw?: boolean;
}) {
  return (
    <div>
      <div
        className="h-14 w-full rounded-[var(--radius)] border border-border"
        style={{ backgroundColor: raw ? `var(${token})` : `hsl(var(${token}))` }}
      />
      <p className="mt-2 text-xs font-medium text-foreground">{name}</p>
      <p className="font-mono text-[11px] font-light text-muted-foreground">
        {token}
      </p>
      <p className="font-mono text-[11px] font-light text-muted-foreground">
        {hex}
      </p>
    </div>
  );
}

/* --------------------------------------------------------------------- data */

const SURFACES = [
  { name: "Background", token: "--background", hex: "#FDFCF9 / #0A0A0A" },
  { name: "Surface", token: "--surface", hex: "#F5F2ED / #1A1A1A" },
  {
    name: "Surface elevated",
    token: "--surface-elevated",
    hex: "hsl(36 20% 96%) / hsl(0 0% 14%)",
  },
  { name: "Card", token: "--card", hex: "#FFFFFF / #0D0D0D" },
  { name: "Border", token: "--border", hex: "#E5E2DC / hsl(0 0% 18%)" },
];

const CONTENT = [
  { name: "Foreground", token: "--foreground", hex: "#1A1A1A" },
  { name: "Muted foreground", token: "--muted-foreground", hex: "#666666" },
];

const BRAND = [
  { name: "Primary", token: "--primary", hex: "#3482ff" },
  { name: "Primary hover", token: "--primary-hover", hex: "hsl(214 100% 50%)" },
  { name: "Accent", token: "--accent", hex: "#3B82F6" },
  { name: "Navy", token: "--navy", hex: "#0D2D78" },
  { name: "Purple", token: "--purple", hex: "#6B5CE7" },
  { name: "Terracotta", token: "--terracotta", hex: "#D4715D", raw: true },
];

const STATUS = [
  { name: "Success", token: "--success", hex: "#22C55E" },
  { name: "Destructive", token: "--destructive", hex: "hsl(0 84% 60%)" },
];

const TYPE_ROLES = [
  {
    cls: "heading-hero",
    sample: "Find out what investors will flag",
    spec: "DM Serif Display · italic · 400 · 30→60px · 1.10 · -0.03em",
  },
  {
    cls: "heading-section",
    sample: "What we found in your data room",
    spec: "DM Serif Display · italic · 400 · 20→36px · 1.15 · -0.03em",
  },
  {
    cls: "heading-sub",
    sample: "Cap table has no single source of truth",
    spec: "Inter · 600 · 16–18px · 1.35 · -0.02em",
  },
  {
    cls: "text-body-lg",
    sample:
      "Based on how diligence typically runs for Indian companies at your stage.",
    spec: "Inter · 400 · 16–18px · 1.65",
  },
  {
    cls: "text-body",
    sample:
      "Investors will ask for post-conversion founder ownership before anything else.",
    spec: "Inter · 400 · 14–16px · 1.65",
  },
  {
    cls: "text-nav",
    sample: "Tools · Advisory · Company",
    spec: "Inter · 400 · 12px · 1.40 · 0.04em",
  },
] as const;

/* ---------------------------------------------------------------------- page */

export function StyleguideClient() {
  const [pageDark, setPageDark] = useState(false);
  const [radio, setRadio] = useState("sheets");
  const [instruments, setInstruments] = useState<string[]>(["safes"]);
  const [step, setStep] = useState(3);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", pageDark);
    return () => root.classList.remove("dark");
  }, [pageDark]);

  const toggleInstrument = (value: string) =>
    setInstruments((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );

  return (
    <main className="container-full">
      {/* ---------------------------------------------------------- header */}
      <header className="section-padding">
        <Badge tone="blocker" className="mb-6">
          Temporary route — delete before launch
        </Badge>
        <SectionLabel className="mb-3">Incentiv design system</SectionLabel>
        <h1 className="heading-hero mb-4 text-foreground">
          <span className="text-gradient">Styleguide</span>
        </h1>
        <p className="text-body-lg max-w-2xl text-muted-foreground">
          Every token, font role and primitive from DESIGN.md, rendered in both
          light and dark. No tool features live here. This route exists purely
          for visual verification and is deleted before launch.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button variant="secondary" onClick={() => setPageDark((d) => !d)}>
            Page chrome: {pageDark ? "dark" : "light"}
          </Button>
          <p className="text-body text-muted-foreground">
            The paired panels below stay pinned to their own mode.
          </p>
        </div>
      </header>

      <hr className="section-divider" />

      {/* ---------------------------------------------------------- colour */}
      <Section
        label="01 · Colour"
        title="Palette & roles"
        note="Warm neutrals carry the whole system. Brand blue is the only chromatic colour in UI chrome; terracotta exists solely as the endpoint of the display-scale text gradient."
      >
        <DualMode>
          <div className="space-y-8">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Surfaces
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                {SURFACES.map((s) => (
                  <Swatch key={s.token} {...s} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Text
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                {CONTENT.map((s) => (
                  <Swatch key={s.token} {...s} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Brand & accent
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                {BRAND.map((s) => (
                  <Swatch key={s.token} {...s} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                {STATUS.map((s) => (
                  <Swatch key={s.token} {...s} />
                ))}
              </div>
            </div>
          </div>
        </DualMode>
      </Section>

      <hr className="section-divider" />

      {/* -------------------------------------------------------- gradients */}
      <Section
        label="02 · Colour"
        title="Gradients"
        note="Text gradient is display-scale only — never on body copy."
      >
        <DualMode>
          <div className="space-y-6">
            <div>
              <p className="heading-hero">
                <span className="text-gradient">Your real number</span>
              </p>
              <Spec>.text-gradient · 135deg · primary → #D4715D</Spec>
            </div>
            <div>
              <div
                className="h-14 rounded-[var(--radius)]"
                style={{ background: "var(--gradient-primary)" }}
              />
              <Spec>--gradient-primary · #3482ff → #5A9CFF</Spec>
            </div>
            <div>
              <div className="bg-gradient-subtle h-14 rounded-[var(--radius)] border border-border" />
              <Spec>--gradient-subtle · surface → background</Spec>
            </div>
          </div>
        </DualMode>
      </Section>

      <hr className="section-divider" />

      {/* ------------------------------------------------------- typography */}
      <Section
        label="03 · Typography"
        title="Three faces, three domains"
        note="DM Serif Display is always italic with -0.03em tracking. Inter carries cv02/cv03/cv04/cv11 globally. IBM Plex Mono weight 300 takes every number."
      >
        <DualMode>
          <div className="space-y-8">
            {TYPE_ROLES.map((role) => (
              <div key={role.cls}>
                <p className={`${role.cls} text-foreground`}>{role.sample}</p>
                <Spec>
                  .{role.cls} — {role.spec}
                </Spec>
              </div>
            ))}
            <div>
              <SectionLabel>Diligence readiness</SectionLabel>
              <Spec>
                .section-label — Inter · 700 · 10px · 0.15em · uppercase ·
                primary
              </Spec>
            </div>
            <div>
              <p className="number-display text-foreground">5–9 weeks</p>
              <Spec>
                .number-display — IBM Plex Mono · 300 · 20→28px · -0.02em
              </Spec>
            </div>
            <div>
              <p className="number-large text-foreground">4</p>
              <Spec>.number-large — IBM Plex Mono · 300 · 32→48px · -0.03em</Spec>
            </div>
            <div>
              <p className="text-body text-foreground">
                Inter OpenType check — the quick 1 I l g a brown fox jumps.
              </p>
              <Spec>
                cv02 disambiguates 1/I/l · cv03+cv04 alternate g and a · cv11
                single-storey a
              </Spec>
            </div>
          </div>
        </DualMode>
      </Section>

      <hr className="section-divider" />

      {/* ---------------------------------------------------------- buttons */}
      <Section
        label="04 · Primitives"
        title="Button"
        note="Primary, secondary, ghost, and the inline arrow CTA. All 4px radius, all clearing a 44px touch target."
      >
        <DualMode>
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">See your real number</Button>
              <Button variant="secondary">Email me this report</Button>
              <Button variant="ghost">Skip</Button>
              <Button variant="arrow">
                Talk to Advisory
                <span aria-hidden="true">→</span>
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" disabled>
                Disabled
              </Button>
              <Button variant="secondary" disabled>
                Disabled
              </Button>
              <ButtonLink href="#" variant="primary">
                As a link
              </ButtonLink>
            </div>
            <div className="max-w-sm">
              <Button variant="primary" fullWidth>
                Full width (mobile CTA)
              </Button>
            </div>
            <Spec>
              .btn-primary 14px/28px · hover lifts 2px + blue glow · active
              scales 0.98
            </Spec>
          </div>
        </DualMode>
      </Section>

      <hr className="section-divider" />

      {/* ------------------------------------------------------------ cards */}
      <Section
        label="05 · Primitives"
        title="Card & elevation"
        note="Elevation steps by background lightness and warm border — cream → warm gray → white. No dramatic shadows in light mode."
      >
        <DualMode>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-5">
              <span className="icon-box mb-4">
                <span aria-hidden="true">◆</span>
              </span>
              <h3 className="heading-sub mb-2 text-foreground">Level 2 — Card</h3>
              <p className="text-body text-muted-foreground">
                White on cream with a warm border. The default raised surface.
              </p>
            </Card>
            <Card interactive className="p-5">
              <h3 className="heading-sub mb-2 text-foreground">Hover card</h3>
              <p className="text-body text-muted-foreground">
                Border tints blue and the card lifts 2px. Hover me.
              </p>
            </Card>
            <Card elevation="raised" className="p-5">
              <h3 className="heading-sub mb-2 text-foreground">
                Level 3 — Raised
              </h3>
              <p className="text-body text-muted-foreground">
                Soft shadow. Dropdowns, popovers and tooltips only.
              </p>
            </Card>
            <Card elevation="surface" className="p-5 sm:col-span-3">
              <h3 className="heading-sub mb-2 text-foreground">
                Level 1 — Surface
              </h3>
              <p className="text-body text-muted-foreground">
                Warm gray tint, no border. Alternating sections and muted panels.
              </p>
            </Card>
          </div>
        </DualMode>
      </Section>

      <hr className="section-divider" />

      {/* ----------------------------------------------------------- badges */}
      <Section
        label="06 · Primitives"
        title="Badge — flag severity"
        note="Severity rides on the 6px dot, not a coloured pill. Blocker additionally tints its border; it is the one severity meant to stop a reader."
      >
        <DualMode>
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="blocker">Blocker</Badge>
              <Badge tone="delay">Delay</Badge>
              <Badge tone="cleanup">Cleanup</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="neutral">Free · no signup</Badge>
              <Badge tone="success">All current</Badge>
              <Badge hideDot>Fixed by your CA/CS</Badge>
            </div>
            <Spec>
              8px/20px · Inter 13px · 4px radius · warm border · 6px dot
            </Spec>
          </div>
        </DualMode>
      </Section>

      <hr className="section-divider" />

      {/* --------------------------------------------------------- progress */}
      <Section
        label="07 · Primitives"
        title="ProgressBar"
        note="The 8-question track. Counter is IBM Plex Mono, because it is a number."
      >
        <DualMode>
          <div className="max-w-md space-y-6">
            <ProgressBar
              value={step}
              max={8}
              label={`Question ${step} of 8`}
            />
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={() => setStep((s) => Math.min(8, s + 1))}
              >
                Next
              </Button>
            </div>
            <Spec>6px track · surface fill · brand blue bar · 4px radius</Spec>
          </div>
        </DualMode>
      </Section>

      <hr className="section-divider" />

      {/* ---------------------------------------------------------- options */}
      <Section
        label="08 · Primitives"
        title="RadioOption & CheckboxOption"
        note="Real inputs underneath, so keyboard navigation and screen-reader grouping work. Selection promotes the warm border to brand blue with a 5% wash."
      >
        <DualMode>
          <div className="grid gap-8 md:grid-cols-2">
            <fieldset className="space-y-2.5">
              <legend className="heading-sub mb-3 text-foreground">
                Where does your cap table live today?
              </legend>
              {[
                { v: "platform", l: "On a platform" },
                { v: "sheets", l: "In Excel or Google Sheets" },
                { v: "ca", l: "My CA or CS maintains it" },
                { v: "unsure", l: "Honestly, not sure" },
              ].map((o) => (
                <RadioOption
                  key={o.v}
                  name="styleguide-captable"
                  value={o.v}
                  label={o.l}
                  checked={radio === o.v}
                  onChange={() => setRadio(o.v)}
                />
              ))}
              <RadioOption
                name="styleguide-captable-disabled"
                label="Disabled option"
                description="Shown for state coverage only."
                disabled
              />
            </fieldset>

            <fieldset className="space-y-2.5">
              <legend className="heading-sub mb-3 text-foreground">
                What&rsquo;s outstanding besides ordinary equity?
              </legend>
              {[
                { v: "safes", l: "SAFEs" },
                { v: "notes", l: "Convertible notes / CCDs" },
                {
                  v: "ccps",
                  l: "CCPS",
                  d: "Compulsorily convertible preference shares",
                },
                { v: "esop", l: "ESOP grants" },
              ].map((o) => (
                <CheckboxOption
                  key={o.v}
                  name="styleguide-instruments"
                  value={o.v}
                  label={o.l}
                  description={o.d}
                  checked={instruments.includes(o.v)}
                  onChange={() => toggleInstrument(o.v)}
                />
              ))}
            </fieldset>
          </div>
        </DualMode>
      </Section>

      <hr className="section-divider" />

      {/* ------------------------------------------------------ radius/misc */}
      <Section
        label="09 · Foundations"
        title="Radius, dividers & patterns"
        note="4px everywhere. The only exceptions are pills, circles, and the hero email row."
      >
        <DualMode>
          <div className="space-y-8">
            <div className="flex flex-wrap items-end gap-4">
              {[
                { r: "var(--radius-sm)", l: "sm · 4px" },
                { r: "var(--radius-md)", l: "md · 4px" },
                { r: "var(--radius-lg)", l: "lg · 4px" },
                { r: "9999px", l: "pill · chips only" },
              ].map((x) => (
                <div key={x.l}>
                  <div
                    className="size-16 border border-border bg-surface"
                    style={{ borderRadius: x.r }}
                  />
                  <Spec>{x.l}</Spec>
                </div>
              ))}
            </div>
            <div>
              <hr className="section-divider" />
              <Spec>.section-divider — 1px, border at 60% opacity</Spec>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="bg-grid h-28 rounded-[var(--radius)] border border-border" />
                <Spec>.bg-grid — 48px dots + rules</Spec>
              </div>
              <div>
                <div className="bg-lines h-28 rounded-[var(--radius)] border border-border" />
                <Spec>.bg-lines — 60px diagonal crosshatch</Spec>
              </div>
            </div>
          </div>
        </DualMode>
      </Section>

      <hr className="section-divider" />

      <footer className="section-padding">
        <p className="text-body text-muted-foreground">
          The animated page-edge scan lines are rendered once at the root layout
          and frame this entire page — look at the outer left and right margins.
          They hold still under{" "}
          <code className="font-mono text-xs">prefers-reduced-motion</code>.
        </p>
      </footer>
    </main>
  );
}
