import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "jest-axe";
import { Experiences } from "./Experiences";
import { desc, TestScope, TestType } from "@tests/test-categories";

vi.mock("@assets/photo.jpg", () => ({ default: "photo.jpg" }));

vi.mock("@assets/index", () => ({
  assets: {
    photo: "photo.webp",
    experiences: {
      maskott:    "maskott.png",
      ktmAdvance: "ktm.png",
      hippocad:   "hippocad.png",
    },
    education: {},
  },
  assetMeta: {
    experiences: {
      maskott:    { w: 494, h: 102 },
      ktmAdvance: { w: 318, h: 158 },
      hippocad:   { w: 200, h: 56  },
    },
    education: {},
  },
}));

vi.mock("@hooks/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

vi.mock("@hooks/useIntersectionObserver", () => ({
  useIntersectionObserver: () => ({ ref: { current: null }, isVisible: true }),
}));

describe(desc(TestScope.SECTION, "Experiences", TestType.RENDU), () => {
  it("affiche le titre de la section", () => {
    render(<Experiences />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("affiche la liste des expériences", () => {
    render(<Experiences />);
    expect(screen.getByRole("list", { name: "experiences.ariaLabel" })).toBeInTheDocument();
  });

  it("affiche les 3 expériences", () => {
    render(<Experiences />);
    expect(screen.getByAltText("Maskott")).toBeInTheDocument();
    expect(screen.getByAltText("KTM Advance")).toBeInTheDocument();
    expect(screen.getByAltText("Hippocad")).toBeInTheDocument();
  });

  it("affiche les rôles via clés i18n", () => {
    render(<Experiences />);
    expect(screen.getByText("experiences.maskott.role")).toBeInTheDocument();
    expect(screen.getByText("experiences.ktm.role")).toBeInTheDocument();
    expect(screen.getByText("experiences.hippocad.role")).toBeInTheDocument();
  });

  it("affiche les descriptions via clés i18n", () => {
    render(<Experiences />);
    expect(screen.getByText("experiences.maskott.desc1")).toBeInTheDocument();
    expect(screen.getByText("experiences.ktm.desc1")).toBeInTheDocument();
    expect(screen.getByText("experiences.hippocad.desc1")).toBeInTheDocument();
  });

});

describe(desc(TestScope.SECTION, "Experiences", TestType.A11Y), () => {
  it("n'a pas de violations d'accessibilité", async () => {
    const { container } = render(<Experiences />);
    expect(await axe(container)).toHaveNoViolations();
  });
});