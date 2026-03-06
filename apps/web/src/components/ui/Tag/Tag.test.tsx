import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Tag } from "./Tag";

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
