import type { TFunction } from "i18next";
import type { Project } from "@/types/projects.types";
import tacktileo from "@assets/projects/Tactileo-mockup.jpg";
import tacktiléoVideo from "@assets/projects/Video_Tactileo_Module.mp4";
import portfolioLight from "@assets/projects/Portfolio-Hero-Light.webp";
import portfolioDark from "@assets/projects/Portfolio-Hero-Dark.webp";
import { Theme } from "@hooks/useTheme";

export const getProjects = (theme: Theme, t: TFunction): Project[] => [
  {
    id: "maskott",
    company: "Maskott · EdTech",
    title: "Tactileo — Plateforme pédagogique",
    desc: t("projects.maskott.desc"),
    longDesc: t("projects.maskott.longDesc"),
    tags: [
      { label: "React",             variant: "coral" },
      { label: "TypeScript",        variant: "coral" },
      { label: "GitLab",            variant: "sage"  },
      { label: "Docker",            variant: "sage"  },
      { label: "API",               variant: "mauve" },
      { label: "Responsive Design", variant: "sand"  },
    ],
    image: tacktileo,
    video: tacktiléoVideo,
    screenshots: [tacktileo],
    link: "https://www.maskott.com",
    linkLabel: t("projects.maskott.linkName"),
    iframeUrl: "https://www.maskott.com",
    year: "2023 — 2025",
    tabs: [
      { id: "screenshots", label: t("projects.drawer.screenshots") },
      { id: "video",       label: t("projects.drawer.video") },
    ],
  },
  {
    id: "portfolio",
    company: "Projet personnel",
    title: "Ce portfolio",
    desc: t("projects.portfolio.desc"),
    longDesc: t("projects.portfolio.longDesc"),
    tags: [
      { label: "React",      variant: "coral" },
      { label: "TypeScript", variant: "coral" },
      { label: "Node.js",    variant: "sage"  },
      { label: "Vitest",     variant: "sage"  },
      { label: "i18n",       variant: "mauve" },
      { label: "WCAG",       variant: "sand"  },
    ],
    image: theme === "dark" ? portfolioLight : portfolioDark,
    screenshots: [theme === "dark" ? portfolioLight : portfolioDark],
    github: "https://github.com/C-DaCo/cv-portfolio",
    year: "2026",
    tabs: [
      { id: "screenshots", label: t("projects.drawer.screenshots") },
      { id: "archi",       label: t("projects.drawer.archi") },
      { id: "tests",       label: t("projects.drawer.tests") },
    ],
  },
];