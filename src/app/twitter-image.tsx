/**
 * X/Twitter renders its own card, and Next resolves `twitter-image` separately
 * from `opengraph-image` — so the same card is re-exported here rather than
 * left to fall back to a generic preview.
 */
export { alt, size, contentType, default } from "./opengraph-image";
