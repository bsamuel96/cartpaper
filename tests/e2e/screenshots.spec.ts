import { test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

test("captures mobile and desktop visual QA screenshots", async ({ page }, testInfo) => {
  const outputDir = path.join(process.cwd(), "artifacts", "visual");
  await mkdir(outputDir, { recursive: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.screenshot({ path: path.join(outputDir, `${testInfo.project.name}-home.png`), fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/personalizeaza");
  await page.screenshot({ path: path.join(outputDir, `${testInfo.project.name}-personalizer.png`), fullPage: true });
});
