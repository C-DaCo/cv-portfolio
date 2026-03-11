import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "jest-axe";
import { Skills } from "./Skills";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@hooks/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

vi.mock("@hooks/useIntersectionObserver", () => ({
  useIntersectionObserver: () => ({ ref: { current: null }, isVisible: true }),
}));

// ── Rendu ─────────────────────────────────────

describe("Skills — rendu", () => {
  it("affiche le titre", () => {
    render(<Skills />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("affiche le nuage de compétences", () => {
    render(<Skills />);
    expect(screen.getByRole("list", { name: /skills.cloudAriaLabel/i })).toBeInTheDocument();
  });

  it("affiche la légende des catégories", () => {
    render(<Skills />);
    expect(screen.getByLabelText(/légende/i)).toBeInTheDocument();
  });
});

// ── Accessibilité axe-core ────────────────────

describe("Skills — accessibilité axe-core", () => {
  it("n'a pas de violations d'accessibilité", async () => {
    const { container } = render(<Skills />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});