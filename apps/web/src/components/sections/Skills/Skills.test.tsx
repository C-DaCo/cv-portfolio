import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Skills } from "./Skills";

// Mock i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("Skills", () => {
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