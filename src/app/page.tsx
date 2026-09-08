import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNav } from "@/components/layout/site-nav";
import { ButtonLink, SectionLabel } from "@/components/ui";
import {
  CHECK_AREAS,
  CHECK_AREAS_LABEL,
  SITE_NAME,
  TOOL_NAME,
  TOOL_PATH,
  TOOL_STAT_LINE,
  TOOL_SUBHEAD,
} from "@/lib/brand";

/**
 * The index for `incentiv.finance/tools/`. One tool lives here today, so this
 * page's job is to hand the visitor straight to it — not to be a landing page
 * the tool has to compete with.
 */
export default function Home() {
  return (
    <>
      <SiteNav />
      <main className="relative flex flex-1 flex-col">
        <div
          aria-hidden="true"
          className="bg-grid bg-grid-fade pointer-events-none absolute inset-x-0 top-0 h-64 opacity-35 md:h-80"
        />
        <section className="section-padding relative z-10">
          <div className="container-tool">
            <div className="home-grid animate-rise">
              <div className="home-intro">
                <SectionLabel className="mb-4">{SITE_NAME} · Tools</SectionLabel>
                <h1 className="heading-hero max-w-[14ch] text-foreground">
                  {TOOL_NAME}
                </h1>
                <p className="text-body-lg measure-copy mt-6 text-muted-foreground">
                  {TOOL_SUBHEAD}
                </p>

                <div className="mt-8 flex flex-col items-start gap-6 border-t border-border pt-6">
                  <p className="mono-label">{TOOL_STAT_LINE}</p>
                  <ButtonLink className="w-full sm:w-auto" href={TOOL_PATH}>
                    Start the check <span aria-hidden="true">→</span>
                  </ButtonLink>
                </div>
              </div>

              <aside className="home-scope" aria-labelledby="scope-heading">
                <SectionLabel>The scope</SectionLabel>
                <h2
                  id="scope-heading"
                  className="heading-section mt-4 text-foreground"
                >
                  {CHECK_AREAS_LABEL}
                </h2>
                <ul className="mt-6 grid">
                  {CHECK_AREAS.map((area, index) => (
                    <li key={area.label} className="check-item">
                      <span
                        aria-hidden="true"
                        className="mono-label check-item__index"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-body text-foreground">
                        {area.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
