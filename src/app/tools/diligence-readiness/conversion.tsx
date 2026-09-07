"use client";

import { useEffect, useId, useState } from "react";

import { Button, ButtonLink, Card, SectionLabel } from "@/components/ui";
import { track } from "@/lib/analytics";
import type { Urgency } from "@/lib/evaluate";
import type { FlagId } from "@/lib/flags";
import {
  GATE_COPY,
  gateBody,
  persistUnlock,
  validateGate,
} from "@/lib/gate";
import { submitLead } from "@/lib/leads";
import type {
  CrossLinkView,
  EmailCaptureCopy,
  PitchView,
} from "@/lib/pitch";

import { HeadlineLine } from "./segments";

/**
 * The conversion surfaces — tool-spec-v1.md §4, items 4 and 5.
 *
 * Copy lives in `src/lib/pitch.ts`; these components only lay it out and fire
 * the analytics events. Two structural rules are load-bearing:
 *
 *   - A pitch is a `<Card>` in the normal flow of the "needs a system" column.
 *     It is never fixed, never sticky, never overlaid, and never full-bleed —
 *     §4 opens with "Never a banner ad."
 *   - `ReportGate` is the one thing on the page that sits over other content,
 *     and it still is not a modal: it is an inline card inside the flow of the
 *     blurred region, with that region visible beside and below it. The whole
 *     diagnosis — the stat tiles, the three summary visuals and every finding
 *     in full — sits above it and is never blurred. What it gates is the
 *     remedy.
 *   - `EmailCapture` is the ungated twin, and now renders only in the clean
 *     state — a result with nothing to gate. Its copy promises "no wall", which
 *     is true exactly there and nowhere else.
 */

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5.5 3.5 10 8l-4.5 4.5M9.5 8h-7" />
    </svg>
  );
}

export function PitchBlock({
  pitch,
  urgency,
}: {
  pitch: PitchView;
  urgency: Urgency;
}) {
  useEffect(() => {
    track({
      name: "pitch_shown",
      variant: pitch.variant,
      destination: pitch.destination,
      urgency,
    });
  }, [pitch.variant, pitch.destination, urgency]);

  return (
    <Card
      className="border-primary/25 bg-surface/60 p-6"
      data-pitch-variant={pitch.variant}
    >
      <SectionLabel>
        {pitch.destination === "tabulate"
          ? "What a system does here"
          : "This one needs a specialist"}
      </SectionLabel>

      <div className="mt-3 grid gap-3">
        {pitch.body.map((paragraph) => (
          <p key={paragraph} className="text-body measure-copy text-foreground">
            {paragraph}
          </p>
        ))}
      </div>

      <p className="heading-sub mt-6 measure-copy text-foreground">
        {pitch.productLine}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
        <ButtonLink
          href={pitch.href}
          variant="arrow"
          onClick={() =>
            track({
              name: "pitch_clicked",
              variant: pitch.variant,
              destination: pitch.destination,
              urgency,
            })
          }
        >
          {pitch.ctaLabel}
          <ArrowRightIcon />
        </ButtonLink>
        <p className="text-body text-muted-foreground">{pitch.urgencyNote}</p>
      </div>
    </Card>
  );
}

export function CrossLinks({ links }: { links: readonly CrossLinkView[] }) {
  if (links.length === 0) {
    return null;
  }

  return (
    <div>
      <SectionLabel>Also worth a look</SectionLabel>
      <h2 className="heading-section mt-4 text-foreground">
        {links.length === 1
          ? "One other Incentiv tool speaks to what you answered"
          : "Other Incentiv tools that speak to what you answered"}
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {links.map((link, index) => (
          <Card
            key={link.id}
            interactive
            className="animate-rise-stagger p-6"
            style={{ "--stagger": index } as React.CSSProperties}
          >
            <h3 className="heading-sub text-foreground">{link.name}</h3>
            <p className="text-body mt-2 text-muted-foreground">{link.reason}</p>
            <ButtonLink
              href={link.href}
              variant="arrow"
              className="mt-4"
              onClick={() => track({ name: "crosslink_clicked", tool: link.id })}
            >
              Open it
              <ArrowRightIcon />
            </ButtonLink>
          </Card>
        ))}
      </div>
    </div>
  );
}

/** The one input style in the tool. Shared by the gate and the clean-state form. */
const FIELD_CLASS =
  "text-body min-h-11 w-full rounded-[var(--radius)] border border-input bg-card px-4 text-foreground placeholder:text-muted-foreground focus-visible:border-primary";

/**
 * The gate — an inline card over the top of the blurred region.
 *
 * Two fields and nothing else. Company, phone and role each cost conversion,
 * and none of them are needed to send a report: the name addresses it and the
 * address delivers it.
 *
 * The card holds no copy of its own — every string comes from `gate.ts`, so the
 * work-email message and the interpolated count are testable without a DOM.
 */
export function ReportGate({
  issueCount,
  gatedGuidanceCount,
  urgency,
  flagIds,
  delayWeeksMin,
  delayWeeksMax,
  onUnlock,
}: {
  issueCount: number;
  /** Remedies behind the blur. Every FINDING is free (Step 14), so this is the
   *  count of the thing the gate actually offers, and it is never zero — a gate
   *  with nothing behind it is the bug this replaced. */
  gatedGuidanceCount: number;
  urgency: Urgency;
  flagIds: readonly FlagId[];
  delayWeeksMin: number | null;
  delayWeeksMax: number | null;
  onUnlock: (email: string) => void;
}) {
  const nameId = useId();
  const emailId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    track({ name: "gate_shown", issueCount, gatedGuidanceCount, urgency });
  }, [issueCount, gatedGuidanceCount, urgency]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = validateGate(name, email);
    setNameError(result.nameError);
    setEmailError(result.emailError);

    if (!result.ok) {
      if (result.emailReason) {
        track({ name: "gate_invalid_email", reason: result.emailReason });
      }
      return;
    }

    track({ name: "gate_submitted", issueCount, urgency });

    // Fire-and-forget by design: the register opens on the founder's action,
    // not on a network round trip it has no way to wait for. `submitLead`
    // never rejects. In v1 it posts nowhere at all — see `src/lib/leads.ts`.
    void submitLead({
      name: result.name,
      email: result.email,
      issueCount,
      urgency,
      flagIds,
      delayWeeksMin,
      delayWeeksMax,
    });

    persistUnlock();
    onUnlock(result.email);
  }

  return (
    <Card elevation="raised" className="measure-card p-6 sm:p-8">
      <SectionLabel>{GATE_COPY.sectionLabel}</SectionLabel>
      <h2 className="heading-section mt-4 text-foreground">
        {GATE_COPY.heading}
      </h2>
      <p className="text-body measure-copy mt-3 text-muted-foreground">
        <HeadlineLine segments={gateBody(issueCount)} />
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-4">
        <div>
          <label htmlFor={nameId} className="mono-label">
            {GATE_COPY.nameLabel}
          </label>
          <input
            id={nameId}
            name="name"
            autoComplete="name"
            placeholder={GATE_COPY.namePlaceholder}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (nameError) setNameError(null);
            }}
            aria-invalid={nameError !== null}
            aria-describedby={nameError ? `${nameId}-error` : undefined}
            className={`${FIELD_CLASS} mt-2`}
          />
          {nameError ? (
            <p id={`${nameId}-error`} className="text-small mt-2 text-destructive-text">
              {nameError}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={emailId} className="mono-label">
            {GATE_COPY.emailLabel}
          </label>
          <input
            id={emailId}
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            placeholder={GATE_COPY.emailPlaceholder}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (emailError) setEmailError(null);
            }}
            aria-invalid={emailError !== null}
            aria-describedby={emailError ? `${emailId}-error` : undefined}
            className={`${FIELD_CLASS} mt-2`}
          />
          {emailError ? (
            <p
              id={`${emailId}-error`}
              className="text-small mt-2 text-destructive-text"
            >
              {emailError}
            </p>
          ) : null}
        </div>

        <div className="mt-2">
          <Button type="submit" fullWidth className="sm:w-auto">
            {GATE_COPY.submitLabel}
          </Button>
          <p className="text-small mt-3 text-muted-foreground">
            {GATE_COPY.trust}
          </p>
        </div>
      </form>
    </Card>
  );
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailCapture({
  copy,
  issueCount,
  urgency,
}: {
  copy: EmailCaptureCopy;
  issueCount: number;
  urgency: Urgency;
}) {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "invalid" | "submitted">("idle");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus("invalid");
      return;
    }

    // ------------------------------------------------------------------
    // LAUNCH BLOCKER — this handler posts nowhere.
    //
    // v1 has no backend by design (CLAUDE.md), so there is no endpoint to
    // send the address to and the report is never delivered. The address is
    // deliberately NOT included in the analytics event either, so right now
    // a submission is discarded entirely.
    //
    // Shipping this as-is would make the page promise something it cannot
    // do. Either wire a real endpoint (Formspree / HubSpot / Loops — see
    // LOG.md open question 4) or remove the form before launch.
    // ------------------------------------------------------------------
    track({ name: "email_submitted", issueCount, urgency });
    setStatus("submitted");
  }

  return (
    <div>
      <SectionLabel>Optional</SectionLabel>
      <h2 className="heading-section mt-4 text-foreground">{copy.heading}</h2>
      <p className="text-body mt-4 measure-copy text-muted-foreground">
        {copy.body}
      </p>

      {status === "submitted" ? (
        <div
          role="status"
          className="measure-answers mt-6 rounded-[var(--radius)] border border-border bg-surface p-6"
        >
          <p className="text-body text-foreground">
            Got it. This register is queued for {email.trim()}.
          </p>
          {process.env.NODE_ENV !== "production" ? (
            <p className="text-body mt-2 text-muted-foreground">
              Development note: no endpoint is wired up yet, so nothing was
              actually sent. The intent was logged to the console.
            </p>
          ) : null}
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="measure-answers mt-6">
          <label htmlFor={inputId} className="sr-only">
            {copy.label}
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <input
              id={inputId}
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              placeholder={copy.placeholder}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (status === "invalid") setStatus("idle");
              }}
              aria-invalid={status === "invalid"}
              aria-describedby={status === "invalid" ? `${inputId}-error` : undefined}
              className="text-body min-h-11 flex-1 rounded-[var(--radius)] border border-input bg-card px-4 text-foreground placeholder:text-muted-foreground focus-visible:border-primary"
            />
            <Button type="submit" className="whitespace-nowrap">
              {copy.submitLabel}
            </Button>
          </div>

          {status === "invalid" ? (
            <p id={`${inputId}-error`} className="text-body mt-2 text-destructive-text">
              That does not look like an email address. Check it and try again.
            </p>
          ) : (
            <p className="text-body mt-2 text-muted-foreground">
              {copy.reassurance}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
