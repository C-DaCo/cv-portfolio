import { render, screen, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "jest-axe";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { desc, TestScope, TestType } from "@tests/test-categories";

vi.mock("@hooks/useDocumentTitle", () => ({
  useDocumentTitle: vi.fn(),
}));

vi.mock("@hooks/useTheme", () => ({
  useTheme: () => ({ theme: "light", toggleTheme: vi.fn() }),
}));

vi.mock("@hooks/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

vi.mock("@hooks/useIntersectionObserver", () => ({
  useIntersectionObserver: () => ({ ref: { current: null }, isVisible: true }),
}));

vi.mock("@assets/index", () => ({
  assets: {
    photo: "photo.webp",
    experiences: {
      maskott:    "maskott.png",
      ktmAdvance: "ktm.png",
      hippocad:   "hippocad.png",
    },
    education: {
      logoDawan:  "dawan.png",
      logoIfocop: "ifocop.png",
      logoOcr:    "ocr.png",
    },
  },
  assetMeta: {
    experiences: {
      maskott:    { w: 494, h: 102 },
      ktmAdvance: { w: 318, h: 158 },
      hippocad:   { w: 200, h: 56  },
    },
    education: {
      logoDawan:  { w: 418, h: 120 },
      logoIfocop: { w: 290, h: 138 },
      logoOcr:    { w: 192, h: 73  },
    },
  },
}));

const renderApp = () => render(
  <MemoryRouter>
    <App />
  </MemoryRouter>
);

describe(desc(TestScope.PAGE, "App", TestType.RENDU), () => {
  it("affiche le skip link", () => {
    renderApp();
    expect(screen.getByText("skipLink")).toBeInTheDocument();
  });

  it("affiche la navigation", () => {
    renderApp();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("affiche le main", () => {
    renderApp();
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("affiche toutes les sections principales", async () => {
    renderApp();
    expect(document.getElementById("hero")).toBeInTheDocument();
    expect(document.getElementById("experiences")).toBeInTheDocument();
    await waitFor(() => expect(document.getElementById("projects")).toBeInTheDocument(), { timeout: 5000 });
    expect(document.getElementById("skills")).toBeInTheDocument();
    expect(document.getElementById("education")).toBeInTheDocument();
    expect(document.getElementById("contact")).toBeInTheDocument();
  });

  it("affiche le footer", () => {
    renderApp();
    expect(screen.getAllByRole("contentinfo").length).toBeGreaterThanOrEqual(1);
  });

  it("affiche le menu accessibilité", () => {
    renderApp();
    expect(
      screen.getByRole("button", { name: /Ouvrir les options d'accessibilité/i })
    ).toBeInTheDocument();
  });
});

describe(desc(TestScope.PAGE, "App", TestType.A11Y), () => {
  it("n'a pas de violations d'accessibilité", async () => {
    let container: HTMLElement;
    await act(async () => {
      const result = renderApp();
      container = result.container;
    });
    const results = await axe(container!, { iframes: false });
    expect(results).toHaveNoViolations();
  }, 30_000);
});