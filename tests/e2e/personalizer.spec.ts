import { expect, test } from "@playwright/test";
import sharp from "sharp";

async function logoFixture() {
  const svg = Buffer.from(
    `<svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="160" fill="#ffffff"/>
      <rect x="36" y="36" width="88" height="88" rx="18" fill="#11120e"/>
      <circle cx="80" cy="80" r="24" fill="#bded15"/>
    </svg>`,
  );
  return sharp(svg).png().toBuffer();
}

test("personalizer upload, local removal, placement actions, export and quote work", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/personalizeaza?model=black-luxury");

  await expect(page.getByText("Model selectat din colecție: Negru Elegant.")).toBeVisible();
  await page.locator('input[type="file"]').setInputFiles({
    name: "logo-flat.png",
    mimeType: "image/png",
    buffer: await logoFixture(),
  });
  await expect(page.getByText(/Logo încărcat/)).toBeVisible();
  await expect(page.getByRole("button", { name: /Procesare avansată/ })).toHaveCount(0);

  await page.getByRole("button", { name: /Elimină fundalul/ }).click();
  await expect(page.getByText("Fundal eliminat local. Verifică marginile înainte de export.")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole("button", { name: "Revino la original" })).toBeEnabled();

  await page.getByRole("button", { name: "Continuă" }).click();
  await expect(page.getByRole("heading", { name: /Alege punga/ })).toBeVisible();
  await page.getByRole("button", { name: /Alb Premium/ }).click();
  await expect(page.getByText("Alb Premium este selectată.")).toBeVisible();

  const before = await page.getByText(/Dimensiune:/).first().textContent();
  await page.getByRole("button", { name: "Centrează" }).click();
  await expect(page.getByText("Logo centrat în zona de tipar.")).toBeVisible();
  await page.getByRole("button", { name: "Potrivește în zona de tipar" }).click();
  await expect(page.getByText("Logo potrivit în zona de tipar.")).toBeVisible();
  await expect.poll(() => page.getByText(/Dimensiune:/).first().textContent()).not.toBe(before);
  await page.getByRole("button", { name: /Resetează/ }).click();
  await expect(page.getByText("Poziționarea a fost resetată.")).toBeVisible();

  await page.getByRole("button", { name: "Continuă" }).click();
  await expect(page.getByRole("heading", { name: /Verifică simularea/ })).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: /Descarcă simularea/ }).first().click();
  expect((await download).suggestedFilename()).toMatch(/cartpaper-simulare-.*\.png/);

  await page.getByRole("button", { name: "Cere ofertă" }).click();
  await expect(page.getByRole("dialog", { name: "Cerere de ofertă" })).toBeVisible();
  await expect(page.getByLabel("Tip pungă")).toHaveValue("Alb Premium");
  await expect(page.getByLabel("Finisaj")).toHaveValue("mat");
});

test("last-step sticky primary action opens quote", async ({ page }) => {
  await page.goto("/personalizeaza");
  await page.locator('input[type="file"]').setInputFiles({
    name: "logo-flat.png",
    mimeType: "image/png",
    buffer: await logoFixture(),
  });
  await page.getByRole("button", { name: "Continuă" }).click();
  await page.getByRole("button", { name: "Continuă" }).click();
  await page.locator(".stickyStepActions").getByRole("button", { name: "Cere ofertă" }).click();
  await expect(page.getByRole("dialog", { name: "Cerere de ofertă" })).toBeVisible();
});
