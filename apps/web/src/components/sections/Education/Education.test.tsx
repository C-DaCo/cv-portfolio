import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "jest-axe";
import { Education } from "./Education";
import { cvData } from "@data/cv.data";
import { desc, TestScope, TestType } from "@tests/test-categories";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@hooks/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

vi.mock("@hooks/useIntersectionObserver", () => ({
  useIntersectionObserver: () => ({ ref: { current: null }, isVisible: true }),
}));

vi.mock("@assets/index", () => ({
  assets: {
    photo: "photo.webp",
    experiences: {},
    education: {
      logoDawan:  "dawan.png",
      logoIfocop: "ifocop.png",
      logoOcr:    "ocr.png",
    },
  },
}));

describe(desc(TestScope.SECTION, "Education", TestType.RENDU), () => {
  it("affiche le titre de la section", () => {
    render(<Education />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(screen.getByText("education.title")).toBeInTheDocument();
  });

  it("affiche la liste des formations", () => {
    render(<Education />);
    expect(screen.getByRole("list", { name: "education.ariaLabel" })).toBeInTheDocument();
  });

  it("affiche autant de cartes que de formations", () => {
    render(<Education />);
    const cards = screen.getAllByRole("listitem");
    expect(cards.length).toBeGreaterThanOrEqual(cvData.formations.length);
  });

  it("chaque formation a un aria-label accessible", () => {
    render(<Education />);
    cvData.formations.forEach((f) => {
      expect(screen.getByRole("listitem", { name: new RegExp(f.school, "i") })).toBeInTheDocument();
    });
  });

  it("chaque formation affiche son année", () => {
    render(<Education />);
    cvData.formations.forEach((f) => {
      expect(screen.getByText(f.year)).toBeInTheDocument();
    });
  });

  it("affiche les diplômes via clés i18n", () => {
    render(<Education />);
    expect(screen.getByText("education.dawan.degree")).toBeInTheDocument();
    expect(screen.getByText("education.ifocop.degree")).toBeInTheDocument();
    expect(screen.getByText("education.openclassrooms.degree")).toBeInTheDocument();
  });

  it("affiche le titre Langues", () => {
    render(<Education />);
    expect(screen.getByRole("heading", { level: 3, name: "languages.title" })).toBeInTheDocument();
  });

  it("affiche les noms des langues via clés i18n", () => {
    render(<Education />);
    expect(screen.getByText("languages.french")).toBeInTheDocument();
    expect(screen.getByText("languages.english")).toBeInTheDocument();
  });

  it("affiche les niveaux via clés i18n", () => {
    render(<Education />);
    expect(screen.getByText("languages.native")).toBeInTheDocument();
    expect(screen.getByText("languages.intermediate")).toBeInTheDocument();
  });
});

describe(desc(TestScope.SECTION, "Education", TestType.A11Y), () => {
  it("n'a pas de violations d'accessibilité", async () => {
    const { container } = render(<Education />);
    expect(await axe(container)).toHaveNoViolations();
  });
});