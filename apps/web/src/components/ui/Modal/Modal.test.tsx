import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("ne s'affiche pas si isOpen=false", () => {
    render(<Modal isOpen={false} onClose={vi.fn()} title="Test"><p>Contenu</p></Modal>);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("s'affiche si isOpen=true", () => {
    render(<Modal isOpen={true} onClose={vi.fn()} title="Test"><p>Contenu</p></Modal>);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("affiche le titre correctement", () => {
    render(<Modal isOpen={true} onClose={vi.fn()} title="Ma modale"><p>Contenu</p></Modal>);
    expect(screen.getByText("Ma modale")).toBeInTheDocument();
  });

  it("appelle onClose au clic sur le bouton fermer", async () => {
    const onClose = vi.fn();
    render(<Modal isOpen={true} onClose={onClose} title="Test"><p>Contenu</p></Modal>);
    await userEvent.click(screen.getByLabelText("Fermer la modale"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("appelle onClose sur la touche Escape", async () => {
    const onClose = vi.fn();
    render(<Modal isOpen={true} onClose={onClose} title="Test"><p>Contenu</p></Modal>);
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("a les attributs ARIA corrects", () => {
    render(<Modal isOpen={true} onClose={vi.fn()} title="Test"><p>Contenu</p></Modal>);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "modal-title");
  });
});