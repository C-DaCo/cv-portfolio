import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "jest-axe";
import { MemoryRouter } from "react-router-dom";
import { TestDashboard } from "./TestDashboard";
import { desc, TestScope, TestType } from "@tests/test-categories";

vi.mock("@hooks/useTheme", () => ({
  useTheme: () => ({ theme: "light", toggleTheme: vi.fn() }),
}));

vi.mock("./TestDashboardContent", () => ({
  TestDashboardContent: () => <div data-testid="dashboard-content">content</div>,
}));

const renderDashboard = () => render(
  <MemoryRouter>
    <TestDashboard />
  </MemoryRouter>
);

describe(desc(TestScope.PAGE, "TestDashboard", TestType.RENDU), () => {
  it("affiche le titre", () => {
    renderDashboard();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("affiche le lien retour portfolio", () => {
    renderDashboard();
    expect(screen.getByRole("link", { name: /Portfolio/i })).toBeInTheDocument();
  });

  it("affiche le contenu du dashboard", () => {
    renderDashboard();
    expect(screen.getByTestId("dashboard-content")).toBeInTheDocument();
  });
});

describe(desc(TestScope.PAGE, "TestDashboard", TestType.A11Y), () => {
  it("n'a pas de violations d'accessibilité", async () => {
    const { container } = renderDashboard();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});