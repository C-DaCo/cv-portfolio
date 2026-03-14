import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "jest-axe";
import { Hero } from "./Hero";
import { desc, TestScope, TestType } from "@tests/test-categories";

vi.mock("@assets/index", () => ({
  assets: { photo: "photo.webp", experiences: {}, education: {} },
}));

vi.mock("@hooks/useIntersectionObserver", () => ({
  useIntersectionObserver: () => ({ ref: { current: null }, isVisible: true }),
}));

describe(desc(TestScope.SECTION, "Hero", TestType.RENDU), () => {
  it("affiche le prénom et nom", () => {
    render(<Hero />);
    expect(screen.getByText(/Carole/i)).toBeInTheDocument();
    expect(screen.getByText(/Rotton/i)).toBeInTheDocument();
  });

  it("affiche le titre du poste", () => {
    render(<Hero />);
    expect(screen.getByText(/hero.rolePart1/i)).toBeInTheDocument();
    expect(screen.getByText(/hero.rolePart2/i)).toBeInTheDocument();
  });

  it("affiche le résumé", () => {
    render(<Hero />);
    expect(screen.getByText("hero.summary")).toBeInTheDocument();
  });

  it("affiche la photo de profil", () => {
    render(<Hero />);
    expect(document.querySelector("img[alt*='Carole']")).toBeInTheDocument();
  });

  it("contient les liens CTA", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /hero.ctaContact/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /hero.ctaProjects/i })).toBeInTheDocument();
  });

  it("affiche les stats en chiffres", () => {
    render(<Hero />);
    expect(screen.getByText("hero.statsYears")).toBeInTheDocument();
    expect(screen.getByText("hero.statsCompanies")).toBeInTheDocument();
    expect(screen.getByText("hero.statsProjects")).toBeInTheDocument();
  });
});

describe(desc(TestScope.SECTION, "Hero", TestType.A11Y), () => {
  it("n'a pas de violations d'accessibilité", async () => {
    const { container } = render(<Hero />);
    expect(await axe(container)).toHaveNoViolations();
  });
});