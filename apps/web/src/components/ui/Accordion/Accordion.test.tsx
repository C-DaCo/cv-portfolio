import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Accordion } from "./Accordion";
import type { AccordionItem } from "./Accordion";

const items: AccordionItem[] = [
  { id: "1", title: "Question 1", content: <p>Réponse 1</p> },
  { id: "2", title: "Question 2", content: <p>Réponse 2</p> },
  { id: "3", title: "Question 3", content: <p>Réponse 3</p> },
];

describe("Accordion", () => {
  it("affiche tous les titres", () => {
    render(<Accordion items={items} />);
    expect(screen.getByText("Question 1")).toBeInTheDocument();
    expect(screen.getByText("Question 2")).toBeInTheDocument();
    expect(screen.getByText("Question 3")).toBeInTheDocument();
  });

  it("les panneaux sont fermés par défaut", () => {
    render(<Accordion items={items} />);
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      expect(btn).toHaveAttribute("aria-expanded", "false");
    });
  });

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
    const firstBtn = screen.getByText("Question 1").closest("button")!;
    firstBtn.focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByText("Question 2").closest("button")).toHaveFocus();
  });

  it("navigation clavier avec ArrowUp", async () => {
    render(<Accordion items={items} />);
    const secondBtn = screen.getByText("Question 2").closest("button")!;
    secondBtn.focus();
    await userEvent.keyboard("{ArrowUp}");
    expect(screen.getByText("Question 1").closest("button")).toHaveFocus();
  });
});