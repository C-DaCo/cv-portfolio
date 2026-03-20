import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { BrainBoostArchiContent } from "./BrainBoostArchiContent";
import { desc, TestScope, TestType } from "@tests/test-categories";

describe(desc(TestScope.SECTION, "BrainBoostArchiContent", TestType.RENDU), () => {
  it("affiche les 2 onglets", () => {
    render(<BrainBoostArchiContent />);
    expect(screen.getByRole("tab", { name: /Couches/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Flux IA/i })).toBeInTheDocument();
  });

  it("l'onglet Couches est actif par défaut", () => {
    render(<BrainBoostArchiContent />);
    expect(screen.getByRole("tab", { name: /Couches/i }))
      .toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: /Flux IA/i }))
      .toHaveAttribute("aria-selected", "false");
  });

  it("affiche les 4 couches par défaut", () => {
    render(<BrainBoostArchiContent />);
    expect(screen.getByText("Front-End")).toBeInTheDocument();
    expect(screen.getByText("Auth & Data")).toBeInTheDocument();
    expect(screen.getByText("IA & Push")).toBeInTheDocument();
    expect(screen.getByText("Tests")).toBeInTheDocument();
  });

  it("n'affiche pas le flux IA par défaut", () => {
    render(<BrainBoostArchiContent />);
    expect(screen.queryByText("Photo de notes")).not.toBeInTheDocument();
  });
});

describe(desc(TestScope.SECTION, "BrainBoostArchiContent", TestType.INTERACTIONS), () => {
  it("switch vers l'onglet Flux IA", () => {
    render(<BrainBoostArchiContent />);
    fireEvent.click(screen.getByRole("tab", { name: /Flux IA/i }));
    expect(screen.getByRole("tab", { name: /Flux IA/i }))
      .toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: /Couches/i }))
      .toHaveAttribute("aria-selected", "false");
  });

  it("affiche les étapes du flux IA après switch", () => {
    render(<BrainBoostArchiContent />);
    fireEvent.click(screen.getByRole("tab", { name: /Flux IA/i }));
    expect(screen.getByText("Photo de notes")).toBeInTheDocument();
    expect(screen.getByText("Claude API")).toBeInTheDocument();
    expect(screen.getByText("Révision SM-2")).toBeInTheDocument();
  });

  it("masque les couches après switch vers Flux IA", () => {
    render(<BrainBoostArchiContent />);
    fireEvent.click(screen.getByRole("tab", { name: /Flux IA/i }));
    expect(screen.queryByText("Front-End")).not.toBeInTheDocument();
  });

  it("un seul onglet actif à la fois", () => {
    render(<BrainBoostArchiContent />);
    fireEvent.click(screen.getByRole("tab", { name: /Flux IA/i }));
    const selected = screen.getAllByRole("tab")
      .filter(t => t.getAttribute("aria-selected") === "true");
    expect(selected).toHaveLength(1);
  });
});

describe(desc(TestScope.SECTION, "BrainBoostArchiContent", TestType.A11Y), () => {
  it("les tabs ont un tablist parent", () => {
    render(<BrainBoostArchiContent />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("n'a pas de violations (vue Couches)", async () => {
    const { container } = render(<BrainBoostArchiContent />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("n'a pas de violations (vue Flux IA)", async () => {
    const { container } = render(<BrainBoostArchiContent />);
    fireEvent.click(screen.getByRole("tab", { name: /Flux IA/i }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
