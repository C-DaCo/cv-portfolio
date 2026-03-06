import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Experiences } from "./Experiences";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@assets/photo.jpg", () => ({ default: "photo.jpg" }));

describe("Experiences", () => {
  it("affiche le titre de la section", () => {
    render(<Experiences />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("affiche la liste des expériences", () => {
    render(<Experiences />);
    expect(screen.getByRole("list", { name: "experiences.ariaLabel" })).toBeInTheDocument();
  });
});