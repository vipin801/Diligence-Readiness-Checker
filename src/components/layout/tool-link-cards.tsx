import Link from "next/link";

import { TOOL_LINK_CARDS } from "@/lib/brand";

/**
 * The two bordered cards under the tool — Step 15. They are the way out of the
 * page for someone who is not going to finish the check, which is most of the
 * people who open it.
 *
 * "How this check works" has no destination yet; it is a `#` placeholder like
 * the five outbound URLs, and it is the one on this page a launch check has to
 * catch. See LOG.md open question 12.
 */
export function ToolLinkCards() {
  return (
    <section className="link-cards-section">
      <div className="container-tool">
        <div className="link-cards">
          {TOOL_LINK_CARDS.map((card) =>
            card.href.startsWith("/") ? (
              <Link key={card.title} href={card.href} className="link-card">
                <span className="link-card__title">{card.title}</span>
                <span className="text-small link-card__body">{card.body}</span>
                <span aria-hidden="true" className="link-card__arrow">
                  →
                </span>
              </Link>
            ) : (
              <a key={card.title} href={card.href} className="link-card">
                <span className="link-card__title">{card.title}</span>
                <span className="text-small link-card__body">{card.body}</span>
                <span aria-hidden="true" className="link-card__arrow">
                  →
                </span>
              </a>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
