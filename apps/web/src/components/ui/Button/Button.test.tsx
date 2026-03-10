import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("affiche le contenu enfant", () => {
    render(<Button>Cliquez ici</Button>);
    expect(screen.getByRole("button", { name: /Cliquez ici/i })).toBeInTheDocument();
  });

  it("applique la variante primary par défaut", () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole("button").className).toMatch(/primary/);
  });

  it("applique la variante outline", () => {
    render(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button").className).toMatch(/outline/);
  });

  it("est désactivé avec disabled", () => {
    render(<Button disabled>Désactivé</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("déclenche onClick au clic", () => {
    const handler = vi.fn();
    render(<Button onClick={handler}>Clic</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handler).toHaveBeenCalledOnce();
  });

  it("ne déclenche pas onClick si disabled", () => {
    const handler = vi.fn();
    render(<Button disabled onClick={handler}>Clic</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handler).not.toHaveBeenCalled();
  });

  // ── Variante <a> ──────────────────────────

  it("rend un <a> quand as='a'", () => {
    render(<Button as="a" href="/test">Lien</Button>);
    const link = screen.getByRole("link", { name: /Lien/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
  });

  it("applique la variante outline sur <a>", () => {
    render(<Button as="a" href="#" variant="outline">Lien outline</Button>);
    expect(screen.getByRole("link").className).toMatch(/outline/);
  });
});