import { test, expect } from "@playwright/test";

// Les snapshots visuels sont platform-specific (Windows local vs Linux CI).
// Ces tests sont réservés à l'exécution locale après génération des snapshots.
test.describe("Visual regression", () => {
  test.skip(!!process.env.CI, "Visual snapshots skipped in CI (platform-specific).");
  test("Hero section — light mode", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await page.waitForSelector("section#hero", { state: "visible" });
    // Wait for the photo skeleton to resolve
    await page.waitForFunction(() => {
      const img = document.querySelector<HTMLImageElement>("section#hero img");
      return !img || img.complete;
    });
    await expect(page.locator("section#hero")).toHaveScreenshot("hero-light.png");
  });

  test("Hero section — dark mode", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await page.waitForSelector("section#hero", { state: "visible" });
    await page.waitForFunction(() => {
      const img = document.querySelector<HTMLImageElement>("section#hero img");
      return !img || img.complete;
    });
    await expect(page.locator("section#hero")).toHaveScreenshot("hero-dark.png");
  });

  test("CV Drawer — open state", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    const drawerBtn = page.locator("button").filter({ hasText: /cv|résumé/i }).first();
    await drawerBtn.click();
    const drawer = page.locator("[role='dialog']");
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveScreenshot("drawer-open.png");
  });

  test("Nav bar — light vs dark snapshot", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await expect(page.locator("nav")).toHaveScreenshot("nav-light.png");

    // Toggle to dark
    const toggle = page.locator("nav button").filter({ hasText: /clair|sombre/i }).first();
    await toggle.click();
    await expect(page.locator("nav")).toHaveScreenshot("nav-dark.png");
  });
});
