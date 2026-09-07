"use client";

import { useEffect } from "react";

import { Button, SectionLabel } from "@/components/ui";
import { TOOL_NAME } from "@/lib/brand";

/**
 * Route-level error boundary.
 *
 * The tool holds every answer in memory and posts nothing anywhere, so a crash
 * loses the run — the honest thing is to say so plainly and offer the one
 * action that helps. No stack trace, no blame, no "unexpected error occurred".
 *
 * Next 16 passes `retry`, not `reset`.
 */
export default function ToolError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    // No error-reporting service is wired up in v1 (LOG.md open question 8),
    // so the console is the only place this can go.
    console.error(`[${TOOL_NAME}]`, error);
  }, [error]);

  return (
    <main className="relative flex flex-1 flex-col">
      <section className="section-padding relative z-10 flex flex-1 items-center">
        <div className="container-tool">
          <div>
            <div className="animate-rise">
              <SectionLabel className="mb-4">Something went wrong</SectionLabel>
              <h1 className="heading-h1 text-foreground">
                The check stopped before it could finish
              </h1>
              <p className="text-body measure-copy mt-6 text-muted-foreground">
                Nothing was sent anywhere and nothing was saved — this tool runs
                entirely in your browser, so there is nothing to clean up. Trying
                again usually works.
              </p>
              {error.digest ? (
                <p className="mono-label mt-6">
                  Reference: {error.digest}
                </p>
              ) : null}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button onClick={retry}>Try again</Button>
                <Button
                  variant="secondary"
                  onClick={() => window.location.reload()}
                >
                  Reload the page
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
