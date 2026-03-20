import { test, expect } from "@playwright/test";

test.describe("Dark / light mode toggle", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("theme toggle button is accessible", async ({ page }) => {
    const toggle = page.locator("nav button").filter({ hasText: /clair|sombre/i }).first();
    await expect(toggle).toBeVisible();
    // Has an accessible label describing the action
    const label = await toggle.getAttribute("aria-label");
    expect(label).toBeTruthy();
  });

  test("clicking theme toggle changes the button label", async ({ page }) => {
    const toggle = page.locator("nav button").filter({ hasText: /clair|sombre/i }).first();
    const initialText = await toggle.innerText();

    await toggle.click();

    const newText = await toggle.innerText();
    expect(newText).not.toBe(initialText);
  });

  test("theme preference persists after reload", async ({ page }) => {
    const toggle = page.locator("nav button").filter({ hasText: /clair|sombre/i }).first();
    const initialText = await toggle.innerText();

    await toggle.click();
    const textAfterToggle = await toggle.innerText();

    await page.reload();
    const toggleAfterReload = page.locator("nav button").filter({ hasText: /clair|sombre/i }).first();
    const textAfterReload = await toggleAfterReload.innerText();

    expect(textAfterReload).toBe(textAfterToggle);
    expect(textAfterReload).not.toBe(initialText);
  });
});
