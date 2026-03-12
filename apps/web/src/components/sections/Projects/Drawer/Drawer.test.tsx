import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Drawer } from "./Drawer";
import type { Project } from "@/types/projects.types";
import { desc, TestScope, TestType } from "@tests/test-categories";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockProject: Project = {
  id: "maskott",
  company: "Maskott · EdTech",
  title: "Tactileo — Plateforme pédagogique",
  desc: "Description courte.",
  longDesc: "Description longue du projet.",
  tags: [
    { label: "React",      variant: "coral" },
    { label: "TypeScript", variant: "coral" },
  ],
  image: "/mock-image.jpg",
  year: "2023 — 2025",
  tabs: [{ id: "screenshots", label: "projects.drawer.screenshots" }],
};

const mockProjectMultiTabs: Project = {
  ...mockProject,
  id: "portfolio",
  title: "Ce portfolio",
  tabs: [
    { id: "screenshots", label: "projects.drawer.screenshots" },
    { id: "archi",       label: "projects.drawer.archi" },
    { id: "tests",       label: "projects.drawer.tests" },
  ],
};

describe(desc(TestScope.SECTION, "Drawer", TestType.RENDU), () => {
  it("n'est pas affiché quand project=null", () => {
    render(<Drawer project={null} onClose={vi.fn()} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("s'affiche quand un projet est passé", () => {
    render(<Drawer project={mockProject} onClose={vi.fn()} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("affiche le titre du projet", () => {
    render(<Drawer project={mockProject} onClose={vi.fn()} />);
    expect(screen.getByText("Tactileo — Plateforme pédagogique")).toBeInTheDocument();
  });

  it("affiche la company et l'année", () => {
    render(<Drawer project={mockProject} onClose={vi.fn()} />);
    expect(screen.getByText("Maskott · EdTech")).toBeInTheDocument();
    expect(screen.getByText("2023 — 2025")).toBeInTheDocument();
  });

  it("affiche la description longue", () => {
    render(<Drawer project={mockProject} onClose={vi.fn()} />);
    expect(screen.getByText("Description longue du projet.")).toBeInTheDocument();
  });

  it("affiche les tags", () => {
    render(<Drawer project={mockProject} onClose={vi.fn()} />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("affiche les tabs du projet", () => {
    render(<Drawer project={mockProjectMultiTabs} onClose={vi.fn()} />);
    expect(screen.getByRole("tab", { name: "projects.drawer.screenshots" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "projects.drawer.archi" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "projects.drawer.tests" })).toBeInTheDocument();
  });

  it("le premier tab est actif par défaut", () => {
    render(<Drawer project={mockProjectMultiTabs} onClose={vi.fn()} />);
    expect(screen.getByRole("tab", { name: "projects.drawer.screenshots" }))
      .toHaveAttribute("aria-selected", "true");
  });
});

describe(desc(TestScope.SECTION, "Drawer", TestType.INTERACTIONS), () => {
  it("appelle onClose au clic sur le bouton fermer", () => {
    const onClose = vi.fn();
    render(<Drawer project={mockProject} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "projects.close" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("appelle onClose avec la touche Escape", () => {
    const onClose = vi.fn();
    render(<Drawer project={mockProject} onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("appelle onClose au clic sur l'overlay", () => {
    const onClose = vi.fn();
    render(<Drawer project={mockProject} onClose={onClose} />);
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalled();
  });

  it("switch de tab au clic", () => {
    render(<Drawer project={mockProjectMultiTabs} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole("tab", { name: "projects.drawer.archi" }));
    expect(screen.getByRole("tab", { name: "projects.drawer.archi" }))
      .toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "projects.drawer.screenshots" }))
      .toHaveAttribute("aria-selected", "false");
  });

  it("un seul tab drawer est actif à la fois", () => {
    render(<Drawer project={mockProjectMultiTabs} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole("tab", { name: "projects.drawer.archi" }));
    const drawerTablist = screen.getAllByRole("tablist")[0];
    const selectedTabs = Array.from(drawerTablist.querySelectorAll("[role='tab']"))
      .filter(t => t.getAttribute("aria-selected") === "true");
    expect(selectedTabs).toHaveLength(1);
  });
});

describe(desc(TestScope.SECTION, "Drawer", TestType.A11Y), () => {
  it("le dialog a aria-modal=true", () => {
    render(<Drawer project={mockProject} onClose={vi.fn()} />);
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });

  it("le dialog a un aria-label ou aria-labelledby", () => {
    render(<Drawer project={mockProject} onClose={vi.fn()} />);
    const dialog = screen.getByRole("dialog");
    expect(
      dialog.hasAttribute("aria-label") || dialog.hasAttribute("aria-labelledby")
    ).toBe(true);
  });

  it("le bouton fermer est accessible", () => {
    render(<Drawer project={mockProject} onClose={vi.fn()} />);
    expect(screen.getByRole("button", { name: "projects.close" })).toBeInTheDocument();
  });

  it("les tabs ont un tablist parent", () => {
    render(<Drawer project={mockProjectMultiTabs} onClose={vi.fn()} />);
    expect(screen.getAllByRole("tablist").length).toBeGreaterThanOrEqual(1);
  });
});