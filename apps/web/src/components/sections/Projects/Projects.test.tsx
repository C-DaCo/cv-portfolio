import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
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
    expect(screen.getByText("Tactileo — Plateforme pédagogique")).toBeInTheDocument();
    expect(screen.getByText("Ce portfolio")).toBeInTheDocument();
  });

  it("affiche les tags technos", () => {
    render(<Projects />);
    // Les 2 projets ont "React" et "TypeScript" — on vérifie qu'il y en a au moins 1
    expect(screen.getAllByText("React").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("TypeScript").length).toBeGreaterThanOrEqual(1);
  });

  it("affiche les liens externes", () => {
    render(<Projects />);
    // On cherche par href plutôt que par aria-label (qui contient la traduction)
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
  it("les cards ont role=button et tabIndex=0", () => {
    render(<Projects />);
    const cards = screen.getAllByRole("button");
    const cardButtons = cards.filter(c => c.getAttribute("tabindex") === "0");
    expect(cardButtons.length).toBeGreaterThanOrEqual(2);
  });

  it("ouvre le drawer au clic sur Tactileo", () => {
    render(<Projects />);
    fireEvent.click(screen.getByText("Tactileo — Plateforme pédagogique"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("ouvre le bon projet dans le drawer", () => {
    render(<Projects />);
    fireEvent.click(screen.getByText("Ce portfolio"));
    expect(screen.getByRole("dialog")).toHaveTextContent("Ce portfolio");
  });

  it("ferme le drawer avec le bouton fermer", () => {
    render(<Projects />);
    fireEvent.click(screen.getByText("Tactileo — Plateforme pédagogique"));
    fireEvent.click(screen.getByRole("button", { name: "projects.close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("ferme le drawer avec Escape", () => {
    render(<Projects />);
    fireEvent.click(screen.getByText("Tactileo — Plateforme pédagogique"));
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