import { test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

test("captures mobile and desktop visual QA screenshots", async ({ page }, testInfo) => {
  const outputDir = path.join(process.cwd(), "artifacts", "visual");
  await mkdir(outputDir, { recursive: true });

  for (const viewport of [
    { width: 360, height: 800, name: "360x800" },
    { width: 390, height: 844, name: "390x844" },
    { width: 768, height: 1024, name: "768x1024" },
    { width: 1440, height: 1000, name: "1440x1000" },
  ]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");
    await page.screenshot({ path: path.join(outputDir, `${testInfo.project.name}-home-${viewport.name}.png`), fullPage: true });
    await page.goto("/personalizeaza");
    await page.screenshot({
      path: path.join(outputDir, `${testInfo.project.name}-personalizer-${viewport.name}.png`),
      fullPage: true,
    });
  }

  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/typografie-proba");
  await page.screenshot({ path: path.join(outputDir, `${testInfo.project.name}-typografie-proba.png`), fullPage: true });
});
