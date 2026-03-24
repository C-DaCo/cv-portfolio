import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "jest-axe";
import { Contact } from "./Contact";
import { desc, TestScope, TestType } from "@tests/test-categories";

vi.mock("@hooks/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

vi.mock("@hooks/useIntersectionObserver", () => ({
  useIntersectionObserver: () => ({ ref: { current: null }, isVisible: true }),
}));

describe(desc(TestScope.SECTION, "Contact", TestType.RENDU), () => {
  it("affiche le titre et la description", () => {
    render(<Contact />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(screen.getByText("contact.title")).toBeInTheDocument();
  });

  it("affiche les champs du formulaire", () => {
    render(<Contact />);
    expect(screen.getByLabelText(/contact\.form\.name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/contact\.form\.email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/contact\.form\.subject/)).toBeInTheDocument();
    expect(screen.getByLabelText(/contact\.form\.message/)).toBeInTheDocument();
  });

  it("le bouton submit est accessible", () => {
    render(<Contact />);
    expect(screen.getByRole("button", { name: "contact.form.submit" }))
      .toHaveAttribute("type", "submit");
  });
});

describe(desc(TestScope.SECTION, "Contact", TestType.INTERACTIONS), () => {
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
});

describe(desc(TestScope.SECTION, "Contact", TestType.A11Y), () => {
  it("n'a pas de violations d'accessibilité", async () => {
    const { container } = render(<Contact />);
    expect(await axe(container)).toHaveNoViolations();
  });
});