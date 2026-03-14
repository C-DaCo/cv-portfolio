import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "jest-axe";
import { Footer } from "./Footer";
import { desc, TestScope, TestType } from "@tests/test-categories";

describe(desc(TestScope.LAYOUT, "Footer", TestType.RENDU), () => {
  it("affiche le copyright", () => {
    render(<Footer />);
    expect(screen.getByText(/Carole Rotton/i)).toBeInTheDocument();
  });

  it("affiche le lien GitHub", () => {
    render(<Footer />);
    expect(screen.getByLabelText(/github/i)).toBeInTheDocument();
  });

  it("affiche le lien LinkedIn", () => {
    render(<Footer />);
    expect(screen.getByLabelText(/linkedin/i)).toBeInTheDocument();
  });

  it("a le role contentinfo", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});

describe(desc(TestScope.LAYOUT, "Footer", TestType.A11Y), () => {
  it("n'a pas de violations d'accessibilité", async () => {
    const { container } = render(<Footer />);
    expect(await axe(container)).toHaveNoViolations();
  });
});