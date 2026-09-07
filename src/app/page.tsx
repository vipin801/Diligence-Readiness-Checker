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
        <section className="section-padding relative z-10 flex flex-1 items-center">
          <div className="container-tool">
            <div className="animate-rise">
              <SectionLabel className="mb-4">{SITE_NAME} · Tools</SectionLabel>
              <h1 className="heading-hero text-foreground">{TOOL_NAME}</h1>
              <p className="text-body-lg measure-copy mt-6 text-muted-foreground">
                {TOOL_SUBHEAD}
              </p>

              {/* Spans the column above a hairline, so the measure reads as
                  occupied rather than as a block adrift in the upper left. */}
              <div className="mt-10 flex flex-col gap-6 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="mono-label">{TOOL_STAT_LINE}</p>
                <ButtonLink className="w-full sm:w-auto" href={TOOL_PATH}>
                  Start the check
                </ButtonLink>
              </div>

              {/* The same scope strip the tool's own intro carries. One tool
                  lives here, so the index has the same empty lower half to
                  fill, and the same true thing to fill it with. */}
              <div className="mt-16">
                <p className="mono-label">{CHECK_AREAS_LABEL}</p>
                <ul className="check-grid mt-4">
                  {CHECK_AREAS.map((area, index) => (
                    <li key={area.label} className="check-item">
                      <span
                        aria-hidden="true"
                        className="mono-label check-item__index"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="mono-label check-item__label">
                        {area.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
