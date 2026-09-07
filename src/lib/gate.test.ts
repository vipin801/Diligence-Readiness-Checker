import { afterEach, describe, expect, it, vi } from "vitest";

import {
  GATE_COPY,
  GATE_ERRORS,
  GATE_STORAGE_KEY,
  emailDomain,
  gateBody,
  gateConfirmation,
  isFreeEmailDomain,
  persistUnlock,
  readStoredUnlock,
  validateGate,
} from "./gate";

/**
 * The gate is the one place the tool asks for something before it gives, so the
 * two rules that decide whether a founder gets in — is this a work address, and
 * were they let in before — are tested here rather than through the DOM.
 */

describe("work-email validation", () => {
  const FREE = [
    "founder@gmail.com",
    "founder@googlemail.com",
    "founder@yahoo.com",
    "founder@yahoo.co.in",
    "founder@yahoo.in",
    "founder@ymail.com",
    "founder@outlook.com",
    "founder@outlook.in",
    "founder@hotmail.com",
    "founder@hotmail.co.uk",
    "founder@live.com",
    "founder@live.in",
    "founder@msn.com",
    "founder@icloud.com",
    "founder@me.com",
    "founder@aol.com",
    "founder@proton.me",
    "founder@protonmail.com",
    "founder@zoho.com",
    "founder@zoho.in",
    "founder@rediffmail.com",
    "founder@yandex.ru",
    "founder@mail.com",
  ];

  it.each(FREE)("rejects %s", (address) => {
    expect(isFreeEmailDomain(address)).toBe(true);
  });

  const WORK = [
    "founder@incentiv.in",
    "founder@acme.com",
    "founder@acme.co.in",
    // The trap: an ordinary word as a provider name. "mail.com" is free, a
    // company's own mail host is not.
    "founder@mail.acme.com",
    "founder@me.acme.com",
    "founder@livemint.com",
    "founder@golive.io",
    "founder@zohocorp-partner.com",
  ];

  it.each(WORK)("accepts %s", (address) => {
    expect(isFreeEmailDomain(address)).toBe(false);
  });

  it("ignores case and a trailing dot on the domain", () => {
    expect(isFreeEmailDomain("Founder@GMAIL.com")).toBe(true);
    expect(isFreeEmailDomain("founder@gmail.com.")).toBe(true);
  });

  it("reads the domain after the last @", () => {
    expect(emailDomain("odd\"name\"@acme.com")).toBe("acme.com");
    expect(emailDomain("no-at-sign")).toBe("");
  });
});

describe("validateGate", () => {
  it("passes a name and a work address, trimmed", () => {
    const result = validateGate("  Asha  ", "  asha@acme.in ");

    expect(result.ok).toBe(true);
    expect(result.name).toBe("Asha");
    expect(result.email).toBe("asha@acme.in");
    expect(result.nameError).toBeNull();
    expect(result.emailError).toBeNull();
    expect(result.emailReason).toBeNull();
  });

  it("asks for a name without scolding", () => {
    const result = validateGate("   ", "asha@acme.in");

    expect(result.ok).toBe(false);
    expect(result.nameError).toBe(GATE_ERRORS.nameMissing);
    expect(result.emailError).toBeNull();
  });

  it("names the free-provider case with the spec's message", () => {
    const result = validateGate("Asha", "asha@gmail.com");

    expect(result.ok).toBe(false);
    expect(result.emailReason).toBe("free-provider");
    expect(result.emailError).toBe(
      "Please use your work email — that's where the report goes.",
    );
  });

  it("separates a malformed address from a free one", () => {
    expect(validateGate("Asha", "asha@acme").emailReason).toBe("malformed");
    expect(validateGate("Asha", "").emailReason).toBe("missing");
  });

  it("reports both fields at once", () => {
    const result = validateGate("", "asha@gmail.com");

    expect(result.nameError).not.toBeNull();
    expect(result.emailError).not.toBeNull();
  });

  it("never accuses the visitor of anything", () => {
    for (const message of Object.values(GATE_ERRORS)) {
      expect(message.toLowerCase()).not.toMatch(
        /invalid|error|forbidden|not allowed|must not|wrong/,
      );
    }
  });
});

describe("gate copy", () => {
  it("uses the Step 14 heading, button and trust line", () => {
    expect(GATE_COPY.heading).toBe("Get the fixes");
    expect(GATE_COPY.submitLabel).toBe("Send me the fixes");
    expect(GATE_COPY.trust).toBe("One email with your report. Nothing else.");
  });

  it("interpolates the real count as a number segment", () => {
    const body = gateBody(7);
    const text = body.map((segment) => segment.value).join("");

    expect(text).toBe(
      "Step-by-step for the 7 issues above — what to do yourself this week, and what needs help.",
    );
    expect(body.filter((segment) => segment.kind === "number")).toEqual([
      { kind: "number", value: "7" },
    ]);
  });

  it("takes the singular when a single finding fired", () => {
    const text = gateBody(1)
      .map((segment) => segment.value)
      .join("");

    expect(text).toBe(
      "Step-by-step for the 1 issue above — what to do yourself this week, and what needs help.",
    );
    expect(text).not.toContain("1 issues");
  });

  it("offers the remedy, never the findings the page has already given away", () => {
    for (const count of [1, 2, 3, 7]) {
      const text = gateBody(count)
        .map((segment) => segment.value)
        .join("")
        .toLowerCase();

      // The old copy sold "all {n} issues" — which are now above the gate.
      expect(text).not.toContain("all ");
      expect(text).not.toContain("in full");
      expect(text).toContain("step-by-step");
      expect(text).toContain("above");
    }
  });

  it("asks for exactly two things", () => {
    expect(GATE_COPY.nameLabel).toBe("Name");
    expect(GATE_COPY.emailLabel).toBe("Work email");
  });

  it("names the address the report is queued for", () => {
    expect(gateConfirmation("asha@acme.in")).toContain("asha@acme.in");
    expect(gateConfirmation("asha@acme.in")).toContain("fixes");
  });
});

describe("unlock persistence", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function stubStorage(store: Record<string, string>, throws = false) {
    vi.stubGlobal("window", {
      localStorage: {
        getItem(key: string) {
          if (throws) throw new Error("storage is blocked");
          return store[key] ?? null;
        },
        setItem(key: string, value: string) {
          if (throws) throw new Error("storage is blocked");
          store[key] = value;
        },
      },
    });
  }

  it("round-trips the unlock flag and nothing else", () => {
    const store: Record<string, string> = {};
    stubStorage(store);

    expect(readStoredUnlock()).toBe(false);
    persistUnlock();
    expect(store).toEqual({ [GATE_STORAGE_KEY]: "1" });
    expect(readStoredUnlock()).toBe(true);
  });

  it("reads as locked, and never throws, when storage is blocked", () => {
    stubStorage({}, true);

    expect(() => persistUnlock()).not.toThrow();
    expect(readStoredUnlock()).toBe(false);
  });

  it("reads as locked with no window at all", () => {
    expect(readStoredUnlock()).toBe(false);
  });
});
