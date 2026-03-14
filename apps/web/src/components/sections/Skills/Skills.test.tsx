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

  it("affiche le nuage de compétences", () => {
    render(<Skills />);
    expect(screen.getByRole("list", { name: /skills.cloudAriaLabel/i })).toBeInTheDocument();
  });

  it("affiche la légende des catégories", () => {
    render(<Skills />);
    expect(screen.getByLabelText(/légende/i)).toBeInTheDocument();
  });
});

describe(desc(TestScope.SECTION, "Skills", TestType.A11Y), () => {
  it("n'a pas de violations d'accessibilité", async () => {
    const { container } = render(<Skills />);
    expect(await axe(container)).toHaveNoViolations();
  });
});