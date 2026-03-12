import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "jest-axe";
import { Button } from "./Button";
import { desc, TestScope, TestType } from "@tests/test-categories";

describe(desc(TestScope.UI, "Button", TestType.RENDU), () => {
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

describe(desc(TestScope.UI, "Button", TestType.A11Y), () => {
  it("n'a pas de violations (primary)", async () => {
    const { container } = render(<Button>Cliquez ici</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("n'a pas de violations (outline)", async () => {
    const { container } = render(<Button variant="outline">Outline</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("n'a pas de violations (disabled)", async () => {
    const { container } = render(<Button disabled>Désactivé</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("n'a pas de violations (as=a)", async () => {
    const { container } = render(<Button as="a" href="/test">Lien</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});