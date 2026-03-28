import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "jest-axe";
import { Skills } from "./Skills";
import { desc, TestScope, TestType } from "@tests/test-categories";

vi.mock("@hooks/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

vi.mock("@hooks/useIntersectionObserver", () => ({
  useIntersectionObserver: () => ({ ref: { current: null }, isVisible: true }),
}));

describe(desc(TestScope.SECTION, "Skills", TestType.RENDU), () => {
  it("affiche le titre", () => {
    render(<Skills />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("affiche la grille de compétences", () => {
    render(<Skills />);
    expect(screen.getByLabelText(/skills.cloudAriaLabel/i)).toBeInTheDocument();
  });

  it("affiche les titres de catégories", () => {
    render(<Skills />);
    const groupTitles = screen.getAllByRole("heading", { level: 3 });
    expect(groupTitles.length).toBeGreaterThanOrEqual(4);
  });

  it("affiche les chips de compétences", () => {
    render(<Skills />);
    const items = screen.getAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
  });
});

describe(desc(TestScope.SECTION, "Skills", TestType.A11Y), () => {
  it("n'a pas de violations d'accessibilité", async () => {
    const { container } = render(<Skills />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
