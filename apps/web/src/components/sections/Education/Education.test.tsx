import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Education } from "./Education";
import { cvData } from "@data/cv.data";

describe("Education", () => {
  it("affiche le titre de la section", () => {
    render(<Education />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(screen.getByText("education.title")).toBeInTheDocument();
  });

  it("affiche la liste des formations", () => {
    render(<Education />);
    const list = screen.getByRole("list", { name: "education.ariaLabel" });
    expect(list).toBeInTheDocument();
  });

  it("affiche autant de cartes que de formations", () => {
    render(<Education />);
    const cards = screen.getAllByRole("listitem");
    expect(cards.length).toBeGreaterThanOrEqual(cvData.formations.length);
  });

  it("chaque formation a un aria-label accessible", () => {
    render(<Education />);
    cvData.formations.forEach((f) => {
      expect(
        screen.getByRole("listitem", { name: new RegExp(f.school, "i") })
      ).toBeInTheDocument();
    });
  });

  it("chaque formation affiche son année", () => {
    render(<Education />);
    cvData.formations.forEach((f) => {
      expect(screen.getByText(f.year)).toBeInTheDocument();
    });
  });
});