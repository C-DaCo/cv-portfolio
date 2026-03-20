import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

import type { Page } from "@playwright/test";

/** Skip animations so axe sees elements in their final visible state, not mid-flight opacity. */
async function disableAnimations(page: Page) {
  await page.addStyleTag({
    content: `*, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-delay: 0ms !important;
      transition-duration: 0.001ms !important;
      transition-delay: 0ms !important;
    }`,
  });
}

test.describe("Accessibility — WCAG AA", () => {
  test("homepage has no axe violations", async ({ page }) => {
    await page.goto("/");
    // Wait for content to load
    await page.getByRole("navigation", { name: "Navigation principale" }).waitFor();
    await disableAnimations(page);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("contact section has no axe violations", async ({ page }) => {
    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await disableAnimations(page);

    const results = await new AxeBuilder({ page })
      .include("#contact")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("playground section has no axe violations", async ({ page }) => {
    await page.goto("/");
    await page.locator("#playground").scrollIntoViewIfNeeded();
    await disableAnimations(page);

    const results = await new AxeBuilder({ page })
      .include("#playground")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("project drawer has no axe violations when open", async ({ page }) => {
    await page.goto("/");
    await page.locator("#projects").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.getByRole("button", { name: /tactileo/i }).click();
    await page.getByRole("dialog", { name: /tactileo/i }).waitFor();
    await disableAnimations(page);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("a11y menu panel has no axe violations when open", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /ouvrir les options d'accessibilité/i }).click();
    await page.getByRole("dialog", { name: /options d'accessibilité/i }).waitFor();
    await disableAnimations(page);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
