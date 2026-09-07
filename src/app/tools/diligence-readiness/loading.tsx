import { SiteNav } from "@/components/layout/site-nav";

/**
 * Shown while the route's JavaScript arrives. The tool is client-side, so on a
 * slow Indian mobile connection this is a real state, not a formality — it
 * draws the shape of the split that is coming rather than a spinner, so nothing
 * jumps when the real thing lands.
 *
 * Step 15 moved the first question above the fold, so this skeleton is the
 * split itself: the rail on the left, the step tabs and the question card on
 * the right. It stacks below 1024px exactly as the tool does.
 */
export default function Loading() {
  return (
    <>
      <SiteNav />
      <main className="relative flex flex-1 flex-col" aria-busy="true">
        <div
          aria-hidden="true"
          className="bg-grid bg-grid-fade pointer-events-none absolute inset-x-0 top-0 h-48 opacity-25 md:h-64"
        />
        <div className="relative z-10 flex flex-1 flex-col pb-12 pt-10 md:pb-16 md:pt-[4.75rem]">
          <div className="container-tool">
            <div className="tool-split" aria-hidden="true">
              {/* The rail: breadcrumb, the display heading, the lede. */}
              <div className="tool-rail">
                <div className="skeleton h-3 w-56" />
                <div className="skeleton mt-6 h-9 w-full lg:h-10" />
                <div className="skeleton mt-3 h-9 w-4/5 lg:h-10" />
                <div className="skeleton mt-6 h-5 w-full" />
              </div>

              {/* The tool column: three tabs, the meta row, the card. */}
              <div className="tool-column">
                <div className="step-tabs">
                  <div className="skeleton h-10 w-full" />
                  <div className="skeleton h-10 w-full" />
                  <div className="skeleton h-10 w-full" />
                </div>
                <div className="tool-meta">
                  <div className="skeleton h-3 w-48" />
                  <div className="skeleton h-3 w-40" />
                </div>
                <div className="card-elevated tool-card">
                  <div className="skeleton h-6 w-3/4" />
                  <div className="option-grid mt-5">
                    <div className="skeleton h-14 w-full" />
                    <div className="skeleton h-14 w-full" />
                    <div className="skeleton h-14 w-full" />
                    <div className="skeleton h-14 w-full" />
                  </div>
                  <div className="tool-card__footer">
                    <div className="skeleton h-11 w-24" />
                    <div className="skeleton h-11 w-32" />
                  </div>
                </div>
              </div>
            </div>

            <p role="status" className="sr-only">
              Loading the Diligence Readiness Check.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
