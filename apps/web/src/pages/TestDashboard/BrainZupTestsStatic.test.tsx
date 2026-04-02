import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { BrainZupTestsStatic } from "./BrainZupTestsStatic";
import { desc, TestScope, TestType } from "@tests/test-categories";

describe(desc(TestScope.PAGE, "BrainZupTestsStatic", TestType.RENDU), () => {
  it("affiche le nombre de tests Jest", () => {
    render(<BrainZupTestsStatic />);
    expect(screen.getByText("282")).toBeInTheDocument();
    expect(screen.getByText("Tests Jest")).toBeInTheDocument();
  });

  it("affiche la couverture globale", () => {
    render(<BrainZupTestsStatic />);
    expect(screen.getAllByText("91.7%").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Couverture")).toBeInTheDocument();
  });

  it("affiche le nombre de tests E2E", () => {
    render(<BrainZupTestsStatic />);
    expect(screen.getByText("29")).toBeInTheDocument();
    expect(screen.getByText("Tests E2E")).toBeInTheDocument();
  });

  it("affiche le niveau WCAG", () => {
    render(<BrainZupTestsStatic />);
    expect(screen.getByText("AA")).toBeInTheDocument();
    expect(screen.getByText("WCAG axe-core")).toBeInTheDocument();
  });

  it("affiche les 4 métriques de couverture", () => {
    render(<BrainZupTestsStatic />);
    expect(screen.getByText("lines")).toBeInTheDocument();
    expect(screen.getByText("statements")).toBeInTheDocument();
    expect(screen.getByText("functions")).toBeInTheDocument();
    expect(screen.getByText("branches")).toBeInTheDocument();
  });

  it("affiche les barres de progression avec les bons aria", () => {
    render(<BrainZupTestsStatic />);
    const bars = screen.getAllByRole("progressbar");
    expect(bars).toHaveLength(4);
    bars.forEach(bar => {
      expect(bar).toHaveAttribute("aria-valuenow");
      expect(bar).toHaveAttribute("aria-valuemin", "0");
      expect(bar).toHaveAttribute("aria-valuemax", "100");
    });
  });

  it("affiche les 4 suites de tests", () => {
    render(<BrainZupTestsStatic />);
    expect(screen.getByText("Unit · Libs & algorithme")).toBeInTheDocument();
    expect(screen.getByText("Unit · API Routes")).toBeInTheDocument();
    expect(screen.getByText("Unit · Composants")).toBeInTheDocument();
    expect(screen.getByText("E2E · Playwright")).toBeInTheDocument();
  });
});

describe(desc(TestScope.PAGE, "BrainZupTestsStatic", TestType.A11Y), () => {
  it("n'a pas de violations d'accessibilité", async () => {
    const { container } = render(<BrainZupTestsStatic />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
