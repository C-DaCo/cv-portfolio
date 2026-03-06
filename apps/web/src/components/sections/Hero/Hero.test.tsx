import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Hero } from "./Hero";

// Mock de l'image pour Vitest
vi.mock("@assets/photo.jpg", () => ({ default: "photo.jpg" }));

describe("Hero", () => {
  it("affiche le nom complet", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("affiche le badge de disponibilité", () => {
    render(<Hero />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("affiche la photo avec un alt text accessible", () => {
    render(<Hero />);
    const img = document.querySelector("img");
    expect(img).toHaveAttribute("alt", expect.stringContaining("Carole Rotton"));
  });

  it("contient les liens CTA", () => {
    render(<Hero />);
    expect(screen.getByText(/hero\.ctaContact/i)).toBeInTheDocument();
    expect(screen.getByText(/hero\.ctaProjects/i)).toBeInTheDocument();
  });

  it("affiche les stats en chiffres", () => {
    render(<Hero />);
    expect(screen.getByText("hero.statsYears")).toBeInTheDocument();
  });
});
