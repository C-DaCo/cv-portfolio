import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "jest-axe";
import { Projects } from "./Projects";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@hooks/useTheme", () => ({
  useTheme: () => ({ theme: "light", toggleTheme: vi.fn() }),
}));

// ── Rendu ─────────────────────────────────────

describe("Projects — rendu", () => {
  it("affiche l'eyebrow", () => {
    render(<Projects />);
    expect(screen.getByText("projects.eyebrow")).toBeInTheDocument();
  });

  it("affiche le titre de section", () => {
    render(<Projects />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(screen.getByText("projects.title")).toBeInTheDocument();
  });

  it("affiche le sous-titre", () => {
    render(<Projects />);
    expect(screen.getByText("projects.subtitle")).toBeInTheDocument();
  });

  it("affiche les 2 projets", () => {
    render(<Projects />);
    expect(screen.getByRole("button", { name: "Tactileo — Plateforme pédagogique" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ce portfolio" })).toBeInTheDocument();
  });

  it("affiche les tags technos", () => {
    render(<Projects />);
    expect(screen.getAllByText("React").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("TypeScript").length).toBeGreaterThanOrEqual(1);
  });

  it("affiche les liens externes", () => {
    render(<Projects />);
    expect(document.querySelector('a[href="https://www.maskott.com"]')).toBeInTheDocument();
    expect(document.querySelector('a[href="https://github.com/C-DaCo/cv-portfolio"]')).toBeInTheDocument();
  });

  it("affiche les badges voir le détail", () => {
    render(<Projects />);
    expect(screen.getAllByText("projects.seeDetail").length).toBeGreaterThanOrEqual(1);
  });
});

// ── Cards cliquables ──────────────────────────

describe("Projects — cards cliquables", () => {
  it("les titres de cards sont des boutons", () => {
    render(<Projects />);
    expect(screen.getByRole("button", { name: "Tactileo — Plateforme pédagogique" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ce portfolio" })).toBeInTheDocument();
  });

  it("ouvre le drawer au clic sur Tactileo", () => {
    render(<Projects />);
    fireEvent.click(screen.getByRole("button", { name: "Tactileo — Plateforme pédagogique" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("ouvre le bon projet dans le drawer", () => {
    render(<Projects />);
    fireEvent.click(screen.getByRole("button", { name: "Ce portfolio" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("Ce portfolio");
  });

  it("ferme le drawer avec le bouton fermer", () => {
    render(<Projects />);
    fireEvent.click(screen.getByRole("button", { name: "Tactileo — Plateforme pédagogique" }));
    fireEvent.click(screen.getByRole("button", { name: "projects.close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("ferme le drawer avec Escape", () => {
    render(<Projects />);
    fireEvent.click(screen.getByRole("button", { name: "Tactileo — Plateforme pédagogique" }));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

// ── Accessibilité ─────────────────────────────

describe("Projects — accessibilité", () => {
  it("la section a un aria-labelledby", () => {
    render(<Projects />);
    expect(document.querySelector("section")).toHaveAttribute("aria-labelledby");
  });

  it("les liens externes ont rel=noopener noreferrer", () => {
    render(<Projects />);
    screen.getAllByRole("link").forEach(link => {
      if (link.getAttribute("target") === "_blank") {
        expect(link.getAttribute("rel")).toContain("noopener");
        expect(link.getAttribute("rel")).toContain("noreferrer");
      }
    });
  });
});

// ── Accessibilité axe-core ────────────────────

describe("Projects — accessibilité axe-core", () => {
  it("n'a pas de violations d'accessibilité", async () => {
    const { container } = render(<Projects />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});