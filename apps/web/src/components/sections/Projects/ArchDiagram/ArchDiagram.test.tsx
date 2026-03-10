import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ArchDiagram, ArchDiagramContent } from "./ArchDiagram";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// ── ArchDiagram (bouton + modale) ──────────────

describe("ArchDiagram — bouton déclencheur", () => {
  it("affiche le bouton déclencheur", () => {
    render(<ArchDiagram />);
    expect(screen.getByRole("button", { name: "arch.triggerAriaLabel" })).toBeInTheDocument();
  });

  it("le panel est fermé par défaut", () => {
    render(<ArchDiagram />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("ouvre le panel au clic", () => {
    render(<ArchDiagram />);
    fireEvent.click(screen.getByRole("button", { name: "arch.triggerAriaLabel" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("affiche le titre dans le panel", () => {
    render(<ArchDiagram />);
    fireEvent.click(screen.getByRole("button", { name: "arch.triggerAriaLabel" }));
    expect(screen.getByText("arch.title")).toBeInTheDocument();
  });

  it("ferme le panel avec le bouton fermer", () => {
    render(<ArchDiagram />);
    fireEvent.click(screen.getByRole("button", { name: "arch.triggerAriaLabel" }));
    fireEvent.click(screen.getByRole("button", { name: "arch.close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

// ── ArchDiagramContent (inline) ───────────────

describe("ArchDiagramContent — rendu", () => {
  it("affiche les 3 onglets", () => {
    render(<ArchDiagramContent />);
    expect(screen.getByRole("tab", { name: "arch.layers" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "arch.structure" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "arch.flux" })).toBeInTheDocument();
  });

  it("l'onglet Couches est actif par défaut", () => {
    render(<ArchDiagramContent />);
    expect(screen.getByRole("tab", { name: "arch.layers" }))
      .toHaveAttribute("aria-selected", "true");
  });

  it("affiche les 4 couches", () => {
    render(<ArchDiagramContent />);
    expect(screen.getByText("Front-End")).toBeInTheDocument();
    expect(screen.getByText("Back-End")).toBeInTheDocument();
    expect(screen.getByText("Infra")).toBeInTheDocument();
    expect(screen.getByText("Tests")).toBeInTheDocument();
  });

  it("switch vers l'onglet Structure", () => {
    render(<ArchDiagramContent />);
    fireEvent.click(screen.getByRole("tab", { name: "arch.structure" }));
    expect(screen.getByRole("tab", { name: "arch.structure" }))
      .toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("cv-portfolio/")).toBeInTheDocument();
  });

  it("switch vers l'onglet Flux", () => {
    render(<ArchDiagramContent />);
    fireEvent.click(screen.getByRole("tab", { name: "arch.flux" }));
    expect(screen.getByText("Utilisateur")).toBeInTheDocument();
    expect(screen.getByText("Resend")).toBeInTheDocument();
    expect(screen.getByText("Email reçu")).toBeInTheDocument();
  });
});

// ── Accessibilité ─────────────────────────────

describe("ArchDiagramContent — accessibilité", () => {
  it("les tabs ont un tablist parent", () => {
    render(<ArchDiagramContent />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("un seul tab est actif à la fois", () => {
    render(<ArchDiagramContent />);
    fireEvent.click(screen.getByRole("tab", { name: "arch.structure" }));
    const selectedTabs = screen.getAllByRole("tab")
      .filter(t => t.getAttribute("aria-selected") === "true");
    expect(selectedTabs).toHaveLength(1);
  });
});