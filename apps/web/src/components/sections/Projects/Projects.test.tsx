import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "jest-axe";
import { Projects } from "./Projects";
import { desc, TestScope, TestType } from "@tests/test-categories";

vi.mock("@hooks/useTheme", () => ({
  useTheme: () => ({ theme: "light", toggleTheme: vi.fn() }),
}));

describe(desc(TestScope.SECTION, "Projects", TestType.RENDU), () => {
  it("affiche l'eyebrow", () => {
    render(<Projects />);
    expect(screen.getByText("projects.eyebrow")).toBeInTheDocument();
  });

  it("affiche le titre de section", () => {
    render(<Projects />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(screen.getByText("projects.title")).toBeInTheDocument();
  });

  it("affiche le sous-titre", () => {
    render(<Projects />);
    expect(screen.getByText("projects.subtitle")).toBeInTheDocument();
  });

  it("affiche les 2 projets", () => {
    render(<Projects />);
    expect(screen.getByRole("button", { name: "Tactileo — Plateforme pédagogique" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ce portfolio" })).toBeInTheDocument();
  });

  it("affiche les tags technos", () => {
    render(<Projects />);
    expect(screen.getAllByText("React").length).toBeGreaterThanOrEqual(1);
  });

  it("affiche les liens externes", () => {
    render(<Projects />);
    expect(document.querySelector('a[href="https://www.maskott.com"]')).toBeInTheDocument();
    expect(document.querySelector('a[href="https://github.com/C-DaCo/cv-portfolio"]')).toBeInTheDocument();
  });
});

describe(desc(TestScope.SECTION, "Projects", TestType.INTERACTIONS), () => {
  it("ouvre le drawer au clic sur Tactileo", () => {
    render(<Projects />);
    fireEvent.click(screen.getByRole("button", { name: "Tactileo — Plateforme pédagogique" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("ouvre le bon projet dans le drawer", () => {
    render(<Projects />);
    fireEvent.click(screen.getByRole("button", { name: "Ce portfolio" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("Ce portfolio");
  });

  it("ferme le drawer avec le bouton fermer", () => {
    render(<Projects />);
    fireEvent.click(screen.getByRole("button", { name: "Tactileo — Plateforme pédagogique" }));
    fireEvent.click(screen.getByRole("button", { name: "projects.close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("ferme le drawer avec Escape", () => {
    render(<Projects />);
    fireEvent.click(screen.getByRole("button", { name: "Tactileo — Plateforme pédagogique" }));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe(desc(TestScope.SECTION, "Projects", TestType.A11Y), () => {
  it("la section a un aria-labelledby", () => {
    render(<Projects />);
    expect(document.querySelector("section")).toHaveAttribute("aria-labelledby");
  });

  it("les liens externes ont rel=noopener noreferrer", () => {
    render(<Projects />);
    screen.getAllByRole("link").forEach(link => {
      if (link.getAttribute("target") === "_blank") {
        expect(link.getAttribute("rel")).toContain("noopener");
        expect(link.getAttribute("rel")).toContain("noreferrer");
      }
    });
  });

  it("n'a pas de violations axe-core", async () => {
    const { container } = render(<Projects />);
    expect(await axe(container)).toHaveNoViolations();
  });
});