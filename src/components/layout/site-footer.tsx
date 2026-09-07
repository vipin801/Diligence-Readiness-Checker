import Link from "next/link";

import { FOOTER_COLUMNS, SITE_FOOTER_BLURB, SITE_NAME } from "@/lib/brand";

/**
 * The site footer — Step 15. Wordmark, one line of description, and the four
 * columns with mono headers.
 *
 * It is also the mobile fallback for the nav: the nav's four links are hidden
 * below 1024px, and every one of them is a column heading here, so nothing in
 * the site's navigation is unreachable on a phone.
 *
 * Internal routes use `next/link`; the rest are plain anchors because they are
 * still `#` placeholders and `Link` would prefetch a route that does not exist.
 */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container-tool">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Link href="/" className="site-footer__wordmark">
              {SITE_NAME}
            </Link>
            <p className="text-small measure-copy mt-4 text-muted-foreground">
              {SITE_FOOTER_BLURB}
            </p>
          </div>

          <div className="site-footer__columns">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.heading}>
                <p className="mono-label">{column.heading}</p>
                <ul className="mt-4 grid gap-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("/") ? (
                        <Link href={link.href} className="site-footer__link">
                          {link.label}
                        </Link>
                      ) : (
                        <a href={link.href} className="site-footer__link">
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p className="mono-label site-footer__legal">
          © {new Date().getFullYear()} {SITE_NAME}
        </p>
      </div>
    </footer>
  );
}
