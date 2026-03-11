import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "jest-axe";
import { Contact } from "./Contact";

vi.mock("@hooks/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

vi.mock("@hooks/useIntersectionObserver", () => ({
  useIntersectionObserver: () => ({ ref: { current: null }, isVisible: true }),
}));

// ── Rendu ─────────────────────────────────────

describe("Contact — rendu", () => {
  it("affiche le titre et la description", () => {
    render(<Contact />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(screen.getByText("contact.title")).toBeInTheDocument();
  });

  it("affiche les champs du formulaire", () => {
    render(<Contact />);
    expect(screen.getByLabelText("contact.form.name")).toBeInTheDocument();
    expect(screen.getByLabelText("contact.form.email")).toBeInTheDocument();
    expect(screen.getByLabelText("contact.form.subject")).toBeInTheDocument();
    expect(screen.getByLabelText("contact.form.message")).toBeInTheDocument();
  });

  it("affiche les erreurs si soumis vide", async () => {
    render(<Contact />);
    fireEvent.click(screen.getByRole("button", { name: "contact.form.submit" }));
    await waitFor(() => {
      expect(screen.getByText("contact.validation.nameMin")).toBeInTheDocument();
    });
  });

  it("valide l'email au blur", async () => {
    render(<Contact />);
    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, "pasunemail");
    fireEvent.blur(emailInput);
    await waitFor(() => {
      expect(screen.getByText("contact.validation.emailInvalid")).toBeInTheDocument();
    });
  });

  it("le bouton submit est accessible", () => {
    render(<Contact />);
    const btn = screen.getByRole("button", { name: "contact.form.submit" });
    expect(btn).toHaveAttribute("type", "submit");
  });
});

// ── Accessibilité axe-core ────────────────────

describe("Contact — accessibilité axe-core", () => {
  it("n'a pas de violations d'accessibilité", async () => {
    const { container } = render(<Contact />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});