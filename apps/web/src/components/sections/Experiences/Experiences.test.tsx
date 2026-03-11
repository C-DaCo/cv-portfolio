import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "jest-axe";
import { Experiences } from "./Experiences";

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
}));

vi.mock("@hooks/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

vi.mock("@hooks/useIntersectionObserver", () => ({
  useIntersectionObserver: () => ({ ref: { current: null }, isVisible: true }),
}));

// ── Rendu ─────────────────────────────────────

describe("Experiences — rendu", () => {
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

  it("affiche le badge remote pour les postes remote", () => {
    render(<Experiences />);
    const badges = screen.getAllByText("experiences.remote");
    expect(badges.length).toBeGreaterThanOrEqual(2);
  });
});

// ── Accessibilité axe-core ────────────────────

describe("Experiences — accessibilité", () => {
  it("n'a pas de violations d'accessibilité", async () => {
    const { container } = render(<Experiences />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});