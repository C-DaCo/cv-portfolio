import { test, expect } from "@playwright/test";

test.describe("Project Drawer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Scroll projects section into view so IntersectionObserver fires
    await page.locator("#projects").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
  });

  test("opens when clicking a project card title", async ({ page }) => {
    await page.getByRole("button", { name: /tactileo/i }).click();

    const drawer = page.getByRole("dialog", { name: /tactileo/i });
    await expect(drawer).toBeVisible();
  });

  test("drawer has correct aria attributes", async ({ page }) => {
    await page.getByRole("button", { name: /tactileo/i }).click();

    const dialog = page.getByRole("dialog", { name: /tactileo/i });
    await expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  test("displays project tags", async ({ page }) => {
    await page.getByRole("button", { name: /tactileo/i }).click();

    const drawer = page.getByRole("dialog", { name: /tactileo/i });
    await expect(drawer.getByText("React")).toBeVisible();
    await expect(drawer.getByText("TypeScript")).toBeVisible();
  });

  test("tabs are rendered and switchable", async ({ page }) => {
    await page.getByRole("button", { name: /tactileo/i }).click();

    const drawer = page.getByRole("dialog", { name: /tactileo/i });
    const screenshotsTab = drawer.getByRole("tab", { name: /screenshots/i });
    const videoTab = drawer.getByRole("tab", { name: /vidéo/i });

    await expect(screenshotsTab).toHaveAttribute("aria-selected", "true");

    await videoTab.click();
    await expect(videoTab).toHaveAttribute("aria-selected", "true");
    await expect(screenshotsTab).toHaveAttribute("aria-selected", "false");
  });

  test("closes on Escape key", async ({ page }) => {
    await page.getByRole("button", { name: /tactileo/i }).click();
    await expect(page.getByRole("dialog", { name: /tactileo/i })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: /tactileo/i })).not.toBeVisible();
  });

  test("closes on close button click", async ({ page }) => {
    await page.getByRole("button", { name: /tactileo/i }).click();
    const dialog = page.getByRole("dialog", { name: /tactileo/i });
    await expect(dialog).toBeVisible();

    await dialog.getByRole("button", { name: /fermer/i }).click();
    await expect(dialog).not.toBeVisible();
  });

  test("closes on overlay click", async ({ page }) => {
    await page.getByRole("button", { name: /tactileo/i }).click();
    await expect(page.getByRole("dialog", { name: /tactileo/i })).toBeVisible();

    // Click on the overlay (the element with role=dialog, outside the drawer panel)
    await page.mouse.click(10, 300);
    await expect(page.getByRole("dialog", { name: /tactileo/i })).not.toBeVisible();
  });
});
