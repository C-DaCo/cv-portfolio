import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Footer } from "./Footer";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("Footer", () => {
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