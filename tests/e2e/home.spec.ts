import { expect, test } from "@playwright/test";

test("home page has no horizontal overflow on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Brandul tău/ })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test("header links reach real destinations", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  const anchors = [
    ["Servicii", "servicii"],
    ["Proces", "proces"],
    ["Colecție", "colectie"],
    ["De ce Cartpaper", "de-ce-cartpaper"],
    ["Contact", "contact"],
  ] as const;

  for (const [label, id] of anchors) {
    await page.getByRole("navigation", { name: "Navigare principală" }).getByRole("link", { name: label }).click();
    await expect(page.locator(`#${id}`)).toBeVisible();
  }

  await page.getByRole("navigation", { name: "Navigare principală" }).getByRole("link", { name: "Personalizare" }).click();
  await expect(page).toHaveURL(/\/personalizeaza/);
});

test("homepage CTAs have visible results", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /^Personalizează$/ }).click();
  await page.waitForURL(/\/personalizeaza/);
  await expect(page.getByRole("heading", { name: /Încarcă logo-ul/ })).toBeVisible();

  await page.goto("/");
  await page.getByRole("button", { name: "Cere o ofertă" }).click();
  const quoteDialog = page.getByRole("dialog", { name: "Cerere de ofertă" });
  await expect(quoteDialog).toBeVisible();
  await quoteDialog.getByRole("button", { name: "Închide" }).first().click();

  await page.getByRole("button", { name: /Cere un kit de mostre/ }).click();
  const sampleDialog = page.getByRole("dialog", { name: "Cerere kit de mostre" });
  await expect(sampleDialog).toBeVisible();
  await sampleDialog.getByRole("button", { name: "Închide" }).first().click();

  await expect(page.getByRole("link", { name: "Scrie-ne pe e-mail" })).toHaveAttribute("href", /^mailto:/);
  await expect(page.getByRole("link", { name: /Sună-ne direct/ })).toHaveCount(0);
});

test("collection models open the matching personalizer preset", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });

  const cases = [
    ["Kraft clasic", "Kraft Clasic"],
    ["Alb premium", "Alb Premium"],
    ["Culoare intensă", "Culoare Intensă"],
    ["Panglică satinată", "Negru Elegant"],
  ] as const;

  for (const [tab, model] of cases) {
    await page.goto("/");
    await page.getByRole("tab", { name: tab }).click();
    await page.getByRole("link", { name: /Testează varianta/ }).click();
    await expect(page.getByText(`Model selectat din colecție: ${model}.`)).toBeVisible();
    await expect(page.getByText(`Pungă: ${model}`)).toBeVisible();
  }
});

test("in-image slider can be dragged inside the image", async ({ page }) => {
  await page.goto("/");
  const slider = page.getByRole("slider", { name: "Curățare fundal" });
  await expect(slider).toBeVisible();
  const frame = page.locator(".beforeAfterCanvas");
  await frame.scrollIntoViewIfNeeded();
  const before = await slider.inputValue();
  const box = await frame.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width * 0.25, box!.y + box!.height / 2);
  await page.mouse.down();
  await page.mouse.move(box!.x + box!.width * 0.75, box!.y + box!.height / 2);
  await page.mouse.up();
  await expect.poll(() => slider.inputValue()).not.toBe(before);
});

test("cookie choices persist", async ({ page, context }) => {
  await context.clearCookies();
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await page.getByRole("button", { name: "Refuză opționale" }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: "Refuză opționale" })).toHaveCount(0);
});
