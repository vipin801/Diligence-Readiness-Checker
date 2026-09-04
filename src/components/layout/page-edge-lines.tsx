/**
 * The signature animated scan lines running down the outer edges of the
 * 1312px container. DESIGN.md calls this the site's infrastructural
 * fingerprint — it belongs in the root layout exactly once, never on an
 * individual page, and must not be removed.
 *
 * Motion is suppressed under `prefers-reduced-motion` (see globals.css).
 * Purely decorative, so it is hidden from assistive technology.
 */
export function PageEdgeLines() {
  return (
    <div className="page-edge-lines" aria-hidden="true">
      <div className="page-edge-lines__line page-edge-lines__line--left">
        <span className="page-edge-lines__scan" />
      </div>
      <div className="page-edge-lines__line page-edge-lines__line--right">
        <span className="page-edge-lines__scan" />
      </div>
    </div>
  );
}
