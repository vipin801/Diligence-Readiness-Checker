import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNav } from "@/components/layout/site-nav";
import { SectionLabel } from "@/components/ui";
import { TOOL_NAME, TOOL_PATH } from "@/lib/brand";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main className="relative flex flex-1 flex-col">
        <section className="section-padding relative z-10 flex flex-1 items-center">
          <div className="container-tool">
            <div>
              <div className="animate-rise">
                <SectionLabel className="mb-4">Not found</SectionLabel>
                <h1 className="heading-h1 text-foreground">
                  There is nothing at this address
                </h1>
                <p className="text-body measure-copy mt-6 text-muted-foreground">
                  The link may be out of date, or the page may have moved.
                </p>
                <p className="text-body mt-8">
                  <Link className="cta-arrow" href={TOOL_PATH}>
                    Go to the {TOOL_NAME}
                    <span aria-hidden="true">→</span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
