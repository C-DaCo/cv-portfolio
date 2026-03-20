import { test, expect } from "@playwright/test";

test.describe("Accessibility menu (A11yMenu)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("trigger button is visible", async ({ page }) => {
    const trigger = page.getByRole("button", { name: /ouvrir les options d'accessibilité/i });
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("clicking trigger opens the menu", async ({ page }) => {
    const trigger = page.getByRole("button", { name: /ouvrir les options d'accessibilité/i });
    await trigger.click();

    const panel = page.getByRole("dialog", { name: /options d'accessibilité/i });
    await expect(panel).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  test("dyslexic font toggle is a switch", async ({ page }) => {
    await page.getByRole("button", { name: /ouvrir les options d'accessibilité/i }).click();

    const dyslexicSwitch = page.getByRole("switch", { name: /police dyslexie/i });
    await expect(dyslexicSwitch).toBeVisible();
    await expect(dyslexicSwitch).toHaveAttribute("aria-checked", "false");

    await dyslexicSwitch.click();
    await expect(dyslexicSwitch).toHaveAttribute("aria-checked", "true");
  });

  test("high contrast toggle is a switch", async ({ page }) => {
    await page.getByRole("button", { name: /ouvrir les options d'accessibilité/i }).click();

    const contrastSwitch = page.getByRole("switch", { name: /contraste élevé/i });
    await expect(contrastSwitch).toHaveAttribute("aria-checked", "false");

    await contrastSwitch.click();
    await expect(contrastSwitch).toHaveAttribute("aria-checked", "true");
  });

  test("font size buttons are present", async ({ page }) => {
    await page.getByRole("button", { name: /ouvrir les options d'accessibilité/i }).click();

    const group = page.getByRole("group", { name: /taille de police/i });
    await expect(group.getByRole("button", { name: /normale/i })).toHaveAttribute("aria-pressed", "true");
    await expect(group.getByRole("button", { name: /grande/i })).toBeVisible();
    await expect(group.getByRole("button", { name: /très grande/i })).toBeVisible();
  });

  test("Escape closes the menu and returns focus to trigger", async ({ page }) => {
    const trigger = page.getByRole("button", { name: /ouvrir les options d'accessibilité/i });
    await trigger.click();
    await expect(page.getByRole("dialog", { name: /options d'accessibilité/i })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: /options d'accessibilité/i })).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test("close button inside panel closes the menu", async ({ page }) => {
    await page.getByRole("button", { name: /ouvrir les options d'accessibilité/i }).click();
    const panel = page.getByRole("dialog", { name: /options d'accessibilité/i });

    await panel.getByRole("button", { name: /fermer le menu d'accessibilité/i }).click();
    await expect(panel).not.toBeVisible();
  });

  test("clicking outside the menu closes it", async ({ page }) => {
    await page.getByRole("button", { name: /ouvrir les options d'accessibilité/i }).click();
    await expect(page.getByRole("dialog", { name: /options d'accessibilité/i })).toBeVisible();

    // Click far outside the menu
    await page.mouse.click(200, 200);
    await expect(page.getByRole("dialog", { name: /options d'accessibilité/i })).not.toBeVisible();
  });

  test("reset button appears after modifying a setting", async ({ page }) => {
    await page.getByRole("button", { name: /ouvrir les options d'accessibilité/i }).click();

    await expect(page.getByRole("button", { name: /réinitialiser/i })).not.toBeVisible();

    await page.getByRole("switch", { name: /pause animations/i }).click();
    await expect(page.getByRole("button", { name: /réinitialiser/i })).toBeVisible();
  });
});
