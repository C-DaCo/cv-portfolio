import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { Accordion } from "./Accordion";
import type { AccordionItem } from "./Accordion";
import { desc, TestScope, TestType } from "@tests/test-categories";

const items: AccordionItem[] = [
  { id: "1", title: "Question 1", content: <p>Réponse 1</p> },
  { id: "2", title: "Question 2", content: <p>Réponse 2</p> },
  { id: "3", title: "Question 3", content: <p>Réponse 3</p> },
];

describe(desc(TestScope.UI, "Accordion", TestType.RENDU), () => {
  it("affiche tous les titres", () => {
    render(<Accordion items={items} />);
    expect(screen.getByText("Question 1")).toBeInTheDocument();
    expect(screen.getByText("Question 2")).toBeInTheDocument();
    expect(screen.getByText("Question 3")).toBeInTheDocument();
  });

  it("les panneaux sont fermés par défaut", () => {
    render(<Accordion items={items} />);
    screen.getAllByRole("button").forEach((btn) => {
      expect(btn).toHaveAttribute("aria-expanded", "false");
    });
  });
});

describe(desc(TestScope.UI, "Accordion", TestType.INTERACTIONS), () => {
  it("ouvre un panneau au clic", async () => {
    render(<Accordion items={items} />);
    await userEvent.click(screen.getByText("Question 1"));
    expect(screen.getByText("Question 1").closest("button"))
      .toHaveAttribute("aria-expanded", "true");
  });

  it("ferme un panneau ouvert au second clic", async () => {
    render(<Accordion items={items} />);
    const btn = screen.getByText("Question 1");
    await userEvent.click(btn);
    await userEvent.click(btn);
    expect(btn.closest("button")).toHaveAttribute("aria-expanded", "false");
  });

  it("ferme le précédent quand allowMultiple=false", async () => {
    render(<Accordion items={items} />);
    await userEvent.click(screen.getByText("Question 1"));
    await userEvent.click(screen.getByText("Question 2"));
    expect(screen.getByText("Question 1").closest("button"))
      .toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Question 2").closest("button"))
      .toHaveAttribute("aria-expanded", "true");
  });

  it("garde plusieurs ouverts si allowMultiple=true", async () => {
    render(<Accordion items={items} allowMultiple />);
    await userEvent.click(screen.getByText("Question 1"));
    await userEvent.click(screen.getByText("Question 2"));
    expect(screen.getByText("Question 1").closest("button"))
      .toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Question 2").closest("button"))
      .toHaveAttribute("aria-expanded", "true");
  });

  it("navigation clavier avec ArrowDown", async () => {
    render(<Accordion items={items} />);
    screen.getByText("Question 1").closest("button")!.focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByText("Question 2").closest("button")).toHaveFocus();
  });

  it("navigation clavier avec ArrowUp", async () => {
    render(<Accordion items={items} />);
    screen.getByText("Question 2").closest("button")!.focus();
    await userEvent.keyboard("{ArrowUp}");
    expect(screen.getByText("Question 1").closest("button")).toHaveFocus();
  });
});

describe(desc(TestScope.UI, "Accordion", TestType.A11Y), () => {
  it("n'a pas de violations (fermé)", async () => {
    const { container } = render(<Accordion items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("n'a pas de violations (ouvert)", async () => {
    const { container } = render(<Accordion items={items} />);
    await userEvent.click(screen.getByText("Question 1"));
    expect(await axe(container)).toHaveNoViolations();
  });
});