import type { TFunction } from "i18next";
import type { Project } from "@/types/projects.types";
import tacktileo from "@assets/projects/Tactileo-mockup.webp";
import tactiloVideo from "@assets/projects/Video_Tactileo_Module.mp4";
import weather from "@assets/projects/Weather-API.webp";
import mockupBrainboost from "@assets/projects/MockupBrainboost.webp";
import brainboostDesktop from "@assets/projects/BrainBoost-desktop.webp";
import brainboostTablet from "@assets/projects/BrainBoost-tablet.webp";
import brainboostMobile from "@assets/projects/BrainBoost-mobile.webp";
import { Theme } from "@hooks/useTheme";

export const getProjects = (theme: Theme, t: TFunction): Project[] => [
  {
    id: "maskott",
    company: "Maskott · EdTech",
    title: "Tactileo — Plateforme pédagogique",
    desc: t("projects.maskott.desc"),
    longDesc: t("projects.maskott.longDesc"),
    tags: [
      { label: "React", variant: "coral" },
      { label: "TypeScript", variant: "coral" },
      { label: "GitLab", variant: "sage" },
      { label: "Docker", variant: "sage" },
      { label: "API", variant: "mauve" },
      { label: "Responsive Design", variant: "sand" },
    ],
    image: tacktileo,
    imageWidth: 2560, imageHeight: 1794,
    video: tactiloVideo,
    screenshots: [tacktileo],
    link: "https://www.maskott.com",
    linkLabel: t("projects.maskott.linkName"),
    year: "2023 — 2025",
    tabs: [
      { id: "screenshots", label: t("projects.drawer.screenshots") },
      { id: "video", label: t("projects.drawer.video") },
    ],
  },
  {
    id: "portfolio",
    company: "Projet personnel",
    title: "Ce portfolio",
    desc: t("projects.portfolio.desc"),
    longDesc: t("projects.portfolio.longDesc"),
    tags: [
      { label: "React", variant: "coral" },
      { label: "TypeScript", variant: "coral" },
      { label: "Node.js", variant: "sage" },
      { label: "Vitest", variant: "sage" },
      { label: "i18n", variant: "mauve" },
      { label: "WCAG", variant: "sand" },
    ],
    image: "/portfolio-card.jpg",
    imageWidth: 900, imageHeight: 506,
    screenshots: ["/portfolio-card.jpg"],
    github: "https://github.com/C-DaCo/cv-portfolio",
    year: "2026",
    tabs: [
      { id: "screenshots", label: t("projects.drawer.screenshots") },
      { id: "archi", label: t("projects.drawer.archi") },
      { id: "tests", label: t("projects.drawer.tests") },
    ],
  },
  {
    id: "brainboost",
    company: "Projet personnel · EdTech",
    title: "BrainBoost — Flashcards & répétition espacée",
    desc: t("projects.brainboost.desc"),
    longDesc: t("projects.brainboost.longDesc"),
    tags: [
      { label: "Next.js", variant: "coral" },
      { label: "TypeScript", variant: "coral" },
      { label: "Prisma", variant: "sage" },
      { label: "Claude API", variant: "mauve" },
      { label: "Jest · Playwright", variant: "sage" },
      { label: "WCAG", variant: "sand" },
    ],
    image: mockupBrainboost,
    imageWidth: 3333, imageHeight: 2500,
    screenshots: [brainboostDesktop, brainboostTablet, brainboostMobile],
    github: "https://github.com/C-DaCo/BrainBoost",
    year: "2026",
    link: "https://brain-boost-delta.vercel.app/",
    linkLabel: "BrainBoost",
    tabs: [
      { id: "screenshots", label: t("projects.drawer.screenshots") },
      { id: "tests", label: t("projects.drawer.tests") },
      { id: "archi", label: t("projects.drawer.archi") },
    ],
  },
  {
    id: "weather-station",
    wip: true,
    company: "Projet personnel · IoT",
    title: "Station météo Raspberry Pi",
    desc: t("projects.weather.desc"),
    longDesc: t("projects.weather.longDesc"),
    tags: [
      { label: "Raspberry Pi", variant: "coral" },
      { label: "Python", variant: "coral" },
      { label: "IoT", variant: "sage" },
      { label: "API REST", variant: "mauve" },
    ],
    image: weather,
    imageWidth: 599, imageHeight: 401,
    year: "2026",
    tabs: [
      { id: "screenshots", label: t("projects.drawer.screenshots") },
    ],
  },
];