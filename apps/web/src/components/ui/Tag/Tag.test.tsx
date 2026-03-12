import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { Tag } from "./Tag";
import { desc, TestScope, TestType } from "@tests/test-categories";

describe(desc(TestScope.UI, "Tag", TestType.RENDU), () => {
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

describe(desc(TestScope.UI, "Tag", TestType.A11Y), () => {
  it("n'a pas de violations", async () => {
    // Tag a role=listitem — besoin d'un parent role=list pour axe
    const { container } = render(<ul><Tag label="React" /></ul>);
    expect(await axe(container)).toHaveNoViolations();
  });
});