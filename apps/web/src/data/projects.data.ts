import type { TFunction } from "i18next";
import type { Project } from "@/types/projects.types";
import tacktileo from "@assets/projects/Tactileo-mockup.webp";
import tactiloVideo from "@assets/projects/Video_Tactileo_Module.mp4";
import brainzup from "@assets/projects/BrainZup.webp";
import brainzupDesktop from "@assets/projects/BrainZup-desktop.webp";
import brainzupMobile from "@assets/projects/BrainZup-mobile.webp";
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
    id: "brainzup",
    company: "Projet personnel · EdTech",
    title: t("projects.brainzup.title"),
    desc: t("projects.brainzup.desc"),
    longDesc: t("projects.brainzup.longDesc"),
    tags: [
      { label: "Next.js", variant: "coral" },
      { label: "TypeScript", variant: "coral" },
      { label: "Prisma", variant: "sage" },
      { label: "Claude API", variant: "mauve" },
      { label: "Jest · Playwright", variant: "sage" },
      { label: "WCAG", variant: "sand" },
    ],
    image: brainzup,
    imageWidth: 3333, imageHeight: 2500,
    screenshots: [brainzupDesktop, brainzupMobile],
    year: "2026",
    link: "https://brainzup.carolerotton.dev",
    linkLabel: "BrainZup",
    tabs: [
      { id: "screenshots", label: t("projects.drawer.screenshots") },
      { id: "tests", label: t("projects.drawer.tests") },
      { id: "archi", label: t("projects.drawer.archi") },
    ],
  },
  {
    id: "weather-station",
    company: "Projet personnel · IoT",
    title: "Station météo Raspberry Pi",
    desc: t("projects.weather.desc"),
    longDesc: t("projects.weather.longDesc"),
    tags: [
      { label: "Raspberry Pi", variant: "coral" },
      { label: "ESP32", variant: "coral" },
      { label: "MQTT", variant: "sage" },
      { label: "Node.js", variant: "mauve" },
      { label: "WebSocket", variant: "mauve" },
      { label: "IoT", variant: "sand" },
    ],
    widget: "https://meteo.lejardindecarole.dev/widget",
    github: "https://github.com/C-DaCo/weather-station",
    year: "2026",
    tabs: [
      { id: "screenshots", label: t("projects.drawer.screenshots") },
      { id: "archi", label: t("projects.drawer.archi") },
    ],
  },
];