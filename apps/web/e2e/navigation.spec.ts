import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("skip link is present and points to #main", async ({ page }) => {
    const skipLink = page.locator("a.skip-link");
    await expect(skipLink).toHaveAttribute("href", "#main");
  });

  test("skip link becomes visible on focus", async ({ page }) => {
    await page.keyboard.press("Tab");
    const skipLink = page.locator("a.skip-link");
    await expect(skipLink).toBeFocused();
  });

  test("nav contains all section links", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Navigation principale" });
    await expect(nav).toBeVisible();
    for (const href of ["#experiences", "#projects", "#skills", "#playground", "#education", "#contact"]) {
      await expect(nav.locator(`a[href="${href}"]`)).toBeVisible();
    }
  });

  test("clicking a nav link scrolls to the section", async ({ page }) => {
    await page.getByRole("navigation").getByRole("link", { name: /projets/i }).click();
    const section = page.locator("#projects");
    await expect(section).toBeInViewport({ ratio: 0.1 });
  });

  test("theme toggle button is present", async ({ page }) => {
    // The button label changes depending on current theme
    const toggle = page.locator("button").filter({ hasText: /clair|sombre/i }).first();
    await expect(toggle).toBeVisible();
  });

  test("language toggle button is present", async ({ page }) => {
    const toggle = page.locator("button").filter({ hasText: /^EN$|^FR$/ }).first();
    await expect(toggle).toBeVisible();
  });

  test("main landmark exists", async ({ page }) => {
    await expect(page.getByRole("main")).toBeVisible();
  });
});
