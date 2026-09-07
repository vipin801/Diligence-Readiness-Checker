"use client";

import Link from "next/link";
import { useState } from "react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NAV_CTA, SITE_NAME, SITE_NAV } from "@/lib/brand";

/**
 * The marketing site's nav, carried by every page of the tool — Step 15.
 *
 * The tool used to wear a two-item `ToolHeader` (wordmark + theme toggle),
 * which made it read as a standalone microsite that happened to be on the
 * Incentiv domain. It is a page of the site, so it wears the site's chrome.
 *
 * Sticky, and above `.page-edge-lines` (z-index 30) so the scan lines pass
 * behind it rather than over it. At DESIGN.md's 768px navigation breakpoint,
 * the horizontal links collapse into an accessible menu.
 */
function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      {open ? (
        <>
          <path d="M3.5 3.5 14.5 14.5" />
          <path d="m14.5 3.5-11 11" />
        </>
      ) : (
        <>
          <path d="M2.5 4.5h13" />
          <path d="M2.5 9h13" />
          <path d="M2.5 13.5h13" />
        </>
      )}
    </svg>
  );
}

export function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="site-nav">
      <div className="container-tool site-nav__inner">
        <Link href="/" className="site-nav__brand">
          {SITE_NAME}
        </Link>

        <nav aria-label="Main" className="site-nav__links">
          {SITE_NAV.map((link) => (
            <a key={link.label} href={link.href} className="site-nav__link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="site-nav__actions">
          <ThemeToggle />
          <a href={NAV_CTA.href} className="btn btn-primary site-nav__cta">
            {NAV_CTA.label}
          </a>
          <button
            type="button"
            className="site-nav__mobile-toggle"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <nav id="mobile-navigation" aria-label="Mobile" className="site-nav__mobile">
          <div className="container-tool site-nav__mobile-inner">
            <div className="site-nav__mobile-list">
              {SITE_NAV.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-nav site-nav__mobile-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <a
              href={NAV_CTA.href}
              className="btn btn-primary site-nav__mobile-cta"
              onClick={() => setMobileOpen(false)}
            >
              {NAV_CTA.label}
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
