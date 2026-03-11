import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { A11yMenu } from "./A11yMenu";
import { axe } from "jest-axe";

describe("A11yMenu", () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.className = "";
    });

    it("affiche le bouton déclencheur", () => {
        render(<A11yMenu />);
        expect(screen.getByRole("button", { name: /Ouvrir les options d'accessibilité/i })).toBeInTheDocument();
    });

    it("le panel est fermé par défaut", () => {
        render(<A11yMenu />);
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("ouvre le panel au clic", () => {
        render(<A11yMenu />);
        fireEvent.click(screen.getByRole("button", { name: /Ouvrir les options d'accessibilité/i }));
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("ferme le panel avec le bouton fermer", () => {
        render(<A11yMenu />);
        fireEvent.click(screen.getByRole("button", { name: /Ouvrir les options d'accessibilité/i }));
        fireEvent.click(screen.getByRole("button", { name: /Fermer le menu/i }));
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("ferme le panel avec Escape", () => {
        render(<A11yMenu />);
        fireEvent.click(screen.getByRole("button", { name: /Ouvrir les options d'accessibilité/i }));
        fireEvent.keyDown(document, { key: "Escape" });
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("affiche les 4 switches d'accessibilité", () => {
        render(<A11yMenu />);
        fireEvent.click(screen.getByRole("button", { name: /Ouvrir les options d'accessibilité/i }));
        const switches = screen.getAllByRole("switch");
        expect(switches.length).toBe(4);
    });

    it("toggle Police Dyslexie change aria-checked", () => {
        render(<A11yMenu />);
        fireEvent.click(screen.getByRole("button", { name: /Ouvrir les options d'accessibilité/i }));
        const switchBtn = screen.getByRole("switch", { name: /Police Dyslexie/i });
        expect(switchBtn).toHaveAttribute("aria-checked", "false");
        fireEvent.click(switchBtn);
        expect(switchBtn).toHaveAttribute("aria-checked", "true");
    });

    it("toggle Contraste élevé change aria-checked", () => {
        render(<A11yMenu />);
        fireEvent.click(screen.getByRole("button", { name: /Ouvrir les options d'accessibilité/i }));
        const switchBtn = screen.getByRole("switch", { name: /Contraste élevé/i });
        fireEvent.click(switchBtn);
        expect(switchBtn).toHaveAttribute("aria-checked", "true");
    });

    it("affiche le bouton reset quand un paramètre est modifié", () => {
        render(<A11yMenu />);
        fireEvent.click(screen.getByRole("button", { name: /Ouvrir les options d'accessibilité/i }));
        expect(screen.queryByRole("button", { name: /Réinitialiser/i })).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole("switch", { name: /Police Dyslexie/i }));
        expect(screen.getByRole("button", { name: /Réinitialiser/i })).toBeInTheDocument();
    });

    it("reset remet les switches à false", () => {
        render(<A11yMenu />);
        fireEvent.click(screen.getByRole("button", { name: /Ouvrir les options d'accessibilité/i }));
        fireEvent.click(screen.getByRole("switch", { name: /Police Dyslexie/i }));
        fireEvent.click(screen.getByRole("button", { name: /Réinitialiser/i }));
        expect(screen.getByRole("switch", { name: /Police Dyslexie/i })).toHaveAttribute("aria-checked", "false");
    });

    it("les boutons de taille de police sont accessibles", () => {
        render(<A11yMenu />);
        fireEvent.click(screen.getByRole("button", { name: /Ouvrir les options d'accessibilité/i }));
        expect(screen.getByRole("button", { name: /Taille Normale/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Taille Grande/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Taille Très grande/i })).toBeInTheDocument();
    });
});

// ── Accessibilité axe-core ────────────────────

describe("A11yMenu — accessibilité axe-core", () => {
  it("n'a pas de violations (panel fermé)", async () => {
    const { container } = render(<A11yMenu />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("n'a pas de violations (panel ouvert)", async () => {
    const { container } = render(<A11yMenu />);
    fireEvent.click(screen.getByRole("button", { name: /Ouvrir les options d'accessibilité/i }));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});