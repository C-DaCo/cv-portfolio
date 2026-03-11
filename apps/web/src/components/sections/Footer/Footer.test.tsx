import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "jest-axe";
import { Footer } from "./Footer";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// ── Rendu ─────────────────────────────────────

describe("Footer — rendu", () => {
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

// ── Accessibilité axe-core ────────────────────

describe("Footer — accessibilité axe-core", () => {
  it("n'a pas de violations d'accessibilité", async () => {
    const { container } = render(<Footer />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});