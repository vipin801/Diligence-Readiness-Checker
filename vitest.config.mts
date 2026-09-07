import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    // The rules engine is framework-free, and the results screen is rendered
    // with react-dom/server rather than a DOM — so no browser environment is
    // needed for either.
    environment: "node",
  },
});
