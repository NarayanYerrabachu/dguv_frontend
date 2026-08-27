import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    globals: true,
    // Vitest owns unit/component tests under src/; Playwright owns e2e/ (see playwright.config.ts)
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
