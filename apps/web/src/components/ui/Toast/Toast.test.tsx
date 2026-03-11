import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ToastContainer } from "./Toast";
import type { ToastItem } from "./Toast";
import { axe } from "jest-axe";

const mockToasts: ToastItem[] = [
  { id: "1", message: "Opération réussie", type: "success" },
  { id: "2", message: "Une erreur est survenue", type: "error" },
];

describe("ToastContainer", () => {
  it("n'affiche rien si la liste est vide", () => {
    render(<ToastContainer toasts={[]} onRemove={vi.fn()} />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("affiche les toasts correctement", () => {
    render(<ToastContainer toasts={mockToasts} onRemove={vi.fn()} />);
    expect(screen.getAllByRole("alert")).toHaveLength(2);
    expect(screen.getByText("Opération réussie")).toBeInTheDocument();
  });

  it("appelle onRemove au clic sur fermer", async () => {
    const onRemove = vi.fn();
    render(<ToastContainer toasts={[mockToasts[0]]} onRemove={onRemove} />);
    await userEvent.click(screen.getByLabelText("Fermer la notification"));
    expect(onRemove).toHaveBeenCalledWith("1");
  });

  it("se ferme automatiquement après la durée", async () => {
    vi.useFakeTimers();
    const onRemove = vi.fn();
    render(
      <ToastContainer
        toasts={[{ id: "1", message: "Auto close", type: "info", duration: 1000 }]}
        onRemove={onRemove}
      />
    );
    act(() => vi.advanceTimersByTime(1000));
    expect(onRemove).toHaveBeenCalledWith("1");
    vi.useRealTimers();
  });

  it("a les attributs aria corrects", () => {
    render(<ToastContainer toasts={mockToasts} onRemove={vi.fn()} />);
    const alerts = screen.getAllByRole("alert");
    alerts.forEach(alert => {
      expect(alert).toHaveAttribute("aria-live", "polite");
      expect(alert).toHaveAttribute("aria-atomic", "true");
    });
  });
});

// ── Accessibilité axe-core ────────────────────

describe("ToastContainer — accessibilité axe-core", () => {
  it("n'a pas de violations", async () => {
    const { container } = render(
      <ToastContainer toasts={mockToasts} onRemove={vi.fn()} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});