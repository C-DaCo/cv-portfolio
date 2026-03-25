import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { axe } from "jest-axe";
import { AgentCard } from "./AgentCard";
import { desc, TestScope, TestType } from "@tests/test-categories";

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const mockSuccessResponse = (reply: string) =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true, reply }),
  });

const mockErrorResponse = (message: string) =>
  Promise.resolve({
    json: () => Promise.resolve({ success: false, message }),
  });

beforeEach(() => {
  mockFetch.mockReset();
});

// ── Rendu ─────────────────────────────────────────────────────────────────────

describe(desc(TestScope.UI, "AgentCard", TestType.RENDU), () => {
  it("affiche le titre et la description", () => {
    render(<AgentCard visible={true} />);
    expect(screen.getByText("playground.agent.title")).toBeInTheDocument();
    expect(screen.getByText("playground.agent.desc")).toBeInTheDocument();
  });

  it("affiche le message vide en mode chat", () => {
    render(<AgentCard visible={true} />);
    expect(screen.getByText("playground.agent.emptyChat")).toBeInTheDocument();
  });

  it("affiche le bouton toggle technique", () => {
    render(<AgentCard visible={true} />);
    expect(screen.getByRole("button", { name: /playground.agent.tech.toggle/i })).toBeInTheDocument();
  });

  it("applique la classe visible quand visible=true", () => {
    const { container } = render(<AgentCard visible={true} />);
    expect((container.firstChild as HTMLElement).className).toMatch(/visible/);
  });

  it("n'applique pas la classe visible quand visible=false", () => {
    const { container } = render(<AgentCard visible={false} />);
    expect((container.firstChild as HTMLElement).className).not.toMatch(/visible/);
  });
});

// ── Interactions ──────────────────────────────────────────────────────────────

describe(desc(TestScope.UI, "AgentCard", TestType.INTERACTIONS), () => {
  it("envoie un message et affiche la réponse", async () => {
    mockFetch.mockImplementation(() => mockSuccessResponse("Je suis développeuse React."));
    render(<AgentCard visible={true} />);

    fireEvent.change(screen.getByRole("textbox", { name: /playground.agent.inputLabel/i }), {
      target: { value: "Quel est ton stack ?" },
    });
    fireEvent.click(screen.getByRole("button", { name: /playground.agent.send/i }));

    await waitFor(() => {
      expect(screen.getByText("Quel est ton stack ?")).toBeInTheDocument();
      expect(screen.getByText("Je suis développeuse React.")).toBeInTheDocument();
    });
  });

  it("envoie le message avec la touche Entrée", async () => {
    mockFetch.mockImplementation(() => mockSuccessResponse("Réponse clavier"));
    render(<AgentCard visible={true} />);

    const textarea = screen.getByRole("textbox", { name: /playground.agent.inputLabel/i });
    fireEvent.change(textarea, { target: { value: "Message clavier" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    await waitFor(() => {
      expect(screen.getByText("Réponse clavier")).toBeInTheDocument();
    });
  });

  it("ne soumet pas avec Shift+Entrée", () => {
    render(<AgentCard visible={true} />);
    const textarea = screen.getByRole("textbox", { name: /playground.agent.inputLabel/i });
    fireEvent.change(textarea, { target: { value: "Message" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("désactive le bouton envoyer quand l'input est vide", () => {
    render(<AgentCard visible={true} />);
    expect(screen.getByRole("button", { name: /playground.agent.send/i })).toBeDisabled();
  });

  it("affiche une erreur si l'API échoue", async () => {
    mockFetch.mockImplementation(() => mockErrorResponse("Erreur lors de la génération."));
    render(<AgentCard visible={true} />);

    fireEvent.change(screen.getByRole("textbox", { name: /playground.agent.inputLabel/i }), {
      target: { value: "Question" },
    });
    fireEvent.click(screen.getByRole("button", { name: /playground.agent.send/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Erreur lors de la génération.");
    });
  });

  it("affiche une erreur réseau si fetch échoue", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    render(<AgentCard visible={true} />);

    fireEvent.change(screen.getByRole("textbox", { name: /playground.agent.inputLabel/i }), {
      target: { value: "Question" },
    });
    fireEvent.click(screen.getByRole("button", { name: /playground.agent.send/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("playground.agent.errorNetwork");
    });
  });

  it("affiche et masque le panel technique au toggle", () => {
    render(<AgentCard visible={true} />);
    const toggleBtn = screen.getByRole("button", { name: /playground.agent.tech.toggle/i });

    expect(screen.queryByText("playground.agent.tech.systemLabel")).not.toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.getByText("playground.agent.tech.systemLabel")).toBeInTheDocument();
    expect(toggleBtn).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(toggleBtn);
    expect(screen.queryByText("playground.agent.tech.systemLabel")).not.toBeInTheDocument();
    expect(toggleBtn).toHaveAttribute("aria-expanded", "false");
  });
});

// ── A11y ──────────────────────────────────────────────────────────────────────

describe(desc(TestScope.UI, "AgentCard", TestType.A11Y), () => {
  it("n'a pas de violations d'accessibilité — état initial", async () => {
    const { container } = render(<AgentCard visible={true} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("n'a pas de violations d'accessibilité — panel technique ouvert", async () => {
    const { container } = render(<AgentCard visible={true} />);
    fireEvent.click(screen.getByRole("button", { name: /playground.agent.tech.toggle/i }));
    expect(await axe(container)).toHaveNoViolations();
  });

  it("n'a pas de violations après réception d'une réponse", async () => {
    mockFetch.mockImplementation(() => mockSuccessResponse("Réponse accessible."));
    const { container } = render(<AgentCard visible={true} />);

    fireEvent.change(screen.getByRole("textbox", { name: /playground.agent.inputLabel/i }), {
      target: { value: "Test a11y" },
    });
    fireEvent.click(screen.getByRole("button", { name: /playground.agent.send/i }));

    await waitFor(() => {
      expect(screen.getByText("Réponse accessible.")).toBeInTheDocument();
    });

    expect(await axe(container)).toHaveNoViolations();
  });
});
