import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "jest-axe";
import { Nav } from "./Nav";
import { desc, TestScope, TestType } from "@tests/test-categories";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "fr", changeLanguage: vi.fn() },
  }),
}));

vi.mock("@hooks/useTheme", () => ({
  useTheme: () => ({ theme: "light", toggleTheme: vi.fn() }),
}));

describe(desc(TestScope.LAYOUT, "Nav", TestType.RENDU), () => {
  it("affiche le logo", () => {
    render(<Nav />);
    expect(screen.getByText("Rotton")).toBeInTheDocument();
  });

  it("affiche les liens de navigation", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: "nav.experiences" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "nav.projects" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "nav.skills" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "nav.playground" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "nav.education" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "nav.contact" })).toBeInTheDocument();
  });

  it("affiche le bouton de langue", () => {
    render(<Nav />);
    expect(screen.getByRole("button", { name: "nav.toggleLang" })).toBeInTheDocument();
  });

  it("affiche le bouton de thème", () => {
    render(<Nav />);
    expect(screen.getByRole("button", { name: "theme.toggle.light" })).toBeInTheDocument();
  });

  it("affiche le bouton hamburger", () => {
    render(<Nav />);
    expect(screen.getByRole("button", { name: "nav.open" })).toBeInTheDocument();
  });
});

describe(desc(TestScope.LAYOUT, "Nav", TestType.INTERACTIONS), () => {
  it("ouvre le menu au clic sur hamburger", () => {
    render(<Nav />);
    fireEvent.click(screen.getByRole("button", { name: "nav.open" }));
    expect(screen.getByRole("button", { name: "nav.close" })).toBeInTheDocument();
  });

  it("ferme le menu avec Escape", () => {
    render(<Nav />);
    fireEvent.click(screen.getByRole("button", { name: "nav.open" }));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByRole("button", { name: "nav.open" })).toBeInTheDocument();
  });

  it("ferme le menu au clic sur un lien", () => {
    render(<Nav />);
    fireEvent.click(screen.getByRole("button", { name: "nav.open" }));
    fireEvent.click(screen.getByRole("link", { name: "nav.experiences" }));
    expect(screen.getByRole("button", { name: "nav.open" })).toBeInTheDocument();
  });
});

describe(desc(TestScope.LAYOUT, "Nav", TestType.A11Y), () => {
  it("n'a pas de violations (menu fermé)", async () => {
    const { container } = render(<Nav />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("n'a pas de violations (menu ouvert)", async () => {
    const { container } = render(<Nav />);
    fireEvent.click(screen.getByRole("button", { name: "nav.open" }));
    expect(await axe(container)).toHaveNoViolations();
  });
});