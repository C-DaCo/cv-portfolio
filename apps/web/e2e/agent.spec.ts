import { test, expect } from "@playwright/test";

test.describe("AI Assistant (AgentCard)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("#playground").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
  });

  test("agent card is visible with tabs", async ({ page }) => {
    const card = page.locator('[role="tablist"][aria-label]').filter({
      has: page.getByRole("tab", { name: /Q&A CV/i }),
    });
    await expect(card).toBeVisible();
    await expect(page.getByRole("tab", { name: /Q&A CV/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /poème/i })).toBeVisible();
  });

  test("chat tab is selected by default", async ({ page }) => {
    const chatTab = page.getByRole("tab", { name: /Q&A CV/i });
    await expect(chatTab).toHaveAttribute("aria-selected", "true");
  });

  test("input field is present", async ({ page }) => {
    const input = page.locator("#agent-input");
    await expect(input).toBeVisible();
  });

  test("send button is disabled when input is empty", async ({ page }) => {
    const sendBtn = page.getByRole("button", { name: /envoyer/i }).last();
    await expect(sendBtn).toBeDisabled();
  });

  test("chat mode — mocked response appears in conversation", async ({ page }) => {
    await page.route("**/api/agent", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          reply: "Carole a 9 ans d'expérience en développement frontend React.",
          usage: { input_tokens: 10, output_tokens: 20 },
        }),
      })
    );

    const input = page.locator("#agent-input");
    await input.fill("Quelles sont les expériences de Carole ?");
    await page.getByRole("button", { name: /envoyer/i }).last().click();

    // User message appears
    await expect(page.getByText("Quelles sont les expériences de Carole ?")).toBeVisible();
    // Assistant response appears
    await expect(page.getByText("Carole a 9 ans d'expérience en développement frontend React.")).toBeVisible();
  });

  test("Enter key submits the message", async ({ page }) => {
    await page.route("**/api/agent", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          reply: "Réponse de l'assistant.",
          usage: { input_tokens: 5, output_tokens: 10 },
        }),
      })
    );

    const input = page.locator("#agent-input");
    await input.fill("Question test");
    await input.press("Enter");

    await expect(page.getByText("Réponse de l'assistant.")).toBeVisible();
  });

  test("switching to poem tab changes the placeholder", async ({ page }) => {
    const input = page.locator("#agent-input");
    const initialPlaceholder = await input.getAttribute("placeholder");

    await page.getByRole("tab", { name: /poème/i }).click();
    const poemPlaceholder = await input.getAttribute("placeholder");

    expect(poemPlaceholder).not.toBe(initialPlaceholder);
    expect(poemPlaceholder).toMatch(/mer|automne|code/i);
  });

  test("poem mode — mocked response renders illustration", async ({ page }) => {
    await page.route("**/api/agent", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          poem: {
            poem: "La mer murmure\nSes secrets au vent\nDoux et bienveillant",
            keywords: ["mer", "vent", "calme"],
            mood: "calm",
            palette: "ocean",
          },
        }),
      })
    );

    await page.getByRole("tab", { name: /poème/i }).click();
    const input = page.locator("#agent-input");
    await input.fill("la mer");
    await page.getByRole("button", { name: /envoyer/i }).last().click();

    // Poem text appears
    await expect(page.getByText(/la mer murmure/i)).toBeVisible();
  });

  test("error message displayed on API failure", async ({ page }) => {
    await page.route("**/api/agent", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ success: false, message: "Erreur serveur" }),
      })
    );

    const input = page.locator("#agent-input");
    await input.fill("Question qui échoue");
    await page.getByRole("button", { name: /envoyer/i }).last().click();

    await expect(page.getByRole("alert")).toBeVisible();
  });

  test("technical details panel toggles", async ({ page }) => {
    const toggleBtn = page.getByRole("button", { name: /voir les détails techniques/i });
    await expect(toggleBtn).toBeVisible();
    await expect(toggleBtn).toHaveAttribute("aria-expanded", "false");

    await toggleBtn.click();
    await expect(page.locator("#agent-tech-panel")).toBeVisible();
    await expect(toggleBtn).toHaveAttribute("aria-expanded", "true");

    await toggleBtn.click();
    await expect(page.locator("#agent-tech-panel")).not.toBeVisible();
  });
});
