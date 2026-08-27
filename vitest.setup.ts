import "@testing-library/jest-dom/vitest";
import { webcrypto } from "node:crypto";

// jsdom does not always expose the Web Crypto API. The hook under test relies
// on crypto.randomUUID() for its per-conversation session id, so ensure it exists.
if (typeof globalThis.crypto === "undefined" || typeof globalThis.crypto.randomUUID !== "function") {
  Object.defineProperty(globalThis, "crypto", {
    value: webcrypto,
    configurable: true,
  });
}
