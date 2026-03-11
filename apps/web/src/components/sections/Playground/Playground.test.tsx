import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "jest-axe";
import { Playground } from "./Playground";

vi.mock("@hooks/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

vi.mock("@hooks/useIntersectionObserver", () => ({
  useIntersectionObserver: () => ({ ref: { current: null }, isVisible: true }),
}));

// ── Rendu ─────────────────────────────────────

describe("Playground — rendu", () => {
  it("affiche le titre de la section", () => {
    render(<Playground />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(screen.getByText("playground.title")).toBeInTheDocument();
  });

  it("affiche les 3 cards", () => {
    render(<Playground />);
    expect(screen.getByText("playground.modal.title")).toBeInTheDocument();
    expect(screen.getByText("playground.toast.title")).toBeInTheDocument();
    expect(screen.getByText("playground.accordion.title")).toBeInTheDocument();
  });

  it("ouvre la modal au clic sur le bouton démo", () => {
    render(<Playground />);
    fireEvent.click(screen.getByRole("button", { name: /playground.modal.cta/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("ferme la modal avec le bouton de fermeture", () => {
    render(<Playground />);
    fireEvent.click(screen.getByRole("button", { name: /playground.modal.cta/i }));
    fireEvent.click(screen.getByRole("button", { name: /playground.modal.demoClose/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("affiche les boutons toast", () => {
    render(<Playground />);
    expect(screen.getByRole("button", { name: /playground.toast.success/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /playground.toast.error/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /playground.toast.info/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /playground.toast.warning/i })).toBeInTheDocument();
  });

  it("affiche les items de l'accordion", () => {
    render(<Playground />);
    expect(screen.getByText("playground.accordion.items.a11y.title")).toBeInTheDocument();
    expect(screen.getByText("playground.accordion.items.aria.title")).toBeInTheDocument();
    expect(screen.getByText("playground.accordion.items.focus.title")).toBeInTheDocument();
    expect(screen.getByText("playground.accordion.items.contrast.title")).toBeInTheDocument();
  });

  it("un clic sur un toast success crée une notification", () => {
    render(<Playground />);
    fireEvent.click(screen.getByRole("button", { name: /playground.toast.success/i }));
    expect(screen.getByText("playground.toast.msgSuccess")).toBeInTheDocument();
  });
});

// ── Accessibilité axe-core ────────────────────

describe("Playground — accessibilité axe-core", () => {
  it("n'a pas de violations d'accessibilité", async () => {
    const { container } = render(<Playground />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});