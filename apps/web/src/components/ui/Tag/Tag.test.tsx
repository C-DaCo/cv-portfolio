import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Tag } from "./Tag";
import { axe } from "jest-axe";

describe("Tag", () => {
  it("affiche le label correctement", () => {
    render(<Tag label="React" />);
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("a le role listitem pour l'accessibilité", () => {
    render(<Tag label="TypeScript" />);
    expect(screen.getByRole("listitem")).toBeInTheDocument();
  });

  it("applique la variante par défaut coral", () => {
    const { container } = render(<Tag label="React" />);
    expect(container.firstChild).toHaveAttribute("class", expect.stringContaining("coral"));
  });

  it("applique la variante sage", () => {
    const { container } = render(<Tag label="Node.js" variant="sage" />);
    expect(container.firstChild).toHaveAttribute("class", expect.stringContaining("sage"));
  });
});


// ── Accessibilité axe-core ────────────────────

describe("Tag — accessibilité axe-core", () => {
  it("n'a pas de violations", async () => {
    // Tag a role=listitem — besoin d'un parent role=list pour axe
    const { container } = render(
      <ul>
        <Tag label="React" />
      </ul>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});