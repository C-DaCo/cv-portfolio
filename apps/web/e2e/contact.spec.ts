import { test, expect } from "@playwright/test";

test.describe("Contact form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();
  });

  test("shows validation errors on empty submit", async ({ page }) => {
    const form = page.getByRole("form", { name: /formulaire de contact/i });
    await form.getByRole("button", { name: /envoyer le message/i }).click();

    await expect(page.getByText(/le nom doit contenir au moins 2 caractères/i)).toBeVisible();
    await expect(page.getByText(/adresse email invalide/i)).toBeVisible();
    await expect(page.getByText(/le sujet doit contenir au moins 5 caractères/i)).toBeVisible();
    await expect(page.getByText(/le message doit contenir au moins 20 caractères/i)).toBeVisible();
  });

  test("shows email error for invalid email format", async ({ page }) => {
    const form = page.getByRole("form", { name: /formulaire de contact/i });
    await form.getByLabel(/email/i).fill("pas-un-email");
    await form.getByLabel(/email/i).blur();

    await expect(page.getByText(/adresse email invalide/i)).toBeVisible();
  });

  test("shows char counter after message field touched", async ({ page }) => {
    const form = page.getByRole("form", { name: /formulaire de contact/i });

    await form.getByLabel(/message/i).fill("bonjour");
    await form.getByLabel(/message/i).blur();
    await expect(page.locator("[aria-live='polite']").filter({ hasText: /caractères minimum/ })).toBeVisible();
  });

  test("successful submission shows success message", async ({ page }) => {
    await page.route("**/api/contact", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      })
    );

    const form = page.getByRole("form", { name: /formulaire de contact/i });
    await form.getByLabel(/nom complet/i).fill("Jean Dupont");
    await form.getByLabel(/email/i).fill("jean@example.com");
    await form.getByLabel(/sujet/i).fill("Opportunité de poste");
    await form.getByLabel(/message/i).fill("Bonjour, je suis intéressé par votre profil pour un poste frontend.");
    await form.getByRole("button", { name: /envoyer le message/i }).click();

    await expect(page.getByText(/message envoyé/i)).toBeVisible();
  });

  test("'Envoyer un autre message' button resets the form", async ({ page }) => {
    await page.route("**/api/contact", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      })
    );

    const form = page.getByRole("form", { name: /formulaire de contact/i });
    await form.getByLabel(/nom complet/i).fill("Jean Dupont");
    await form.getByLabel(/email/i).fill("jean@example.com");
    await form.getByLabel(/sujet/i).fill("Opportunité de poste");
    await form.getByLabel(/message/i).fill("Bonjour, je suis intéressé par votre profil pour un poste frontend.");
    await form.getByRole("button", { name: /envoyer le message/i }).click();

    await page.getByRole("button", { name: /envoyer un autre message/i }).click();
    await expect(page.getByRole("form", { name: /formulaire de contact/i })).toBeVisible();
  });

  test("shows error message on API failure", async ({ page }) => {
    await page.route("**/api/contact", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ success: false, message: "Erreur serveur" }),
      })
    );

    const form = page.getByRole("form", { name: /formulaire de contact/i });
    await form.getByLabel(/nom complet/i).fill("Jean Dupont");
    await form.getByLabel(/email/i).fill("jean@example.com");
    await form.getByLabel(/sujet/i).fill("Opportunité de poste");
    await form.getByLabel(/message/i).fill("Bonjour, je suis intéressé par votre profil pour un poste frontend.");
    await form.getByRole("button", { name: /envoyer le message/i }).click();

    await expect(page.getByText(/une erreur est survenue/i)).toBeVisible();
  });
});
