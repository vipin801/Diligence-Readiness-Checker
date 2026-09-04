import { SectionLabel } from "@/components/ui";

/**
 * Placeholder. The tool itself will live at /tools/diligence-readiness and has
 * not been built yet — see LOG.md. This replaces the create-next-app starter,
 * which depended on the Geist fonts that Step 2 removed.
 */
export default function Home() {
  return (
    <main className="container-full flex flex-1 items-center">
      <div className="section-padding max-w-2xl">
        <SectionLabel className="mb-3">Incentiv · Tools</SectionLabel>
        <h1 className="heading-hero mb-4 text-foreground">
          Diligence Readiness Check
        </h1>
        <p className="text-body-lg mb-8 text-muted-foreground">
          Find out what investors will flag in your data room — in 90 seconds.
          The tool is not built yet; the design foundation is.
        </p>
        <a className="cta-arrow" href="/styleguide">
          View the styleguide
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </main>
  );
}
