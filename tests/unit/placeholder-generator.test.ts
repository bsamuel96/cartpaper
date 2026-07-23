import { execFileSync } from "node:child_process";
import { expect, it } from "vitest";

it("refuses to overwrite assets without the explicit development placeholder flag", () => {
  expect(() =>
    execFileSync("node", ["scripts/generate-placeholder-assets.mjs"], {
      cwd: process.cwd(),
      stdio: "pipe",
    }),
  ).toThrow();
});
