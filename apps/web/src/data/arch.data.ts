import type { TFunction } from "i18next";
import { Layers, FolderTree, GitBranch } from "lucide-react";

// ── Types ─────────────────────────────────────

export interface ArchTech {
  name: string;
  desc: string;
}

export interface ArchLayer {
  id: string;
  label: string;
  color: "coral" | "sage" | "mauve" | "sand";
  techs: ArchTech[];
}

export interface ArchNode {
  name: string;
  type: "root" | "folder" | "file";
  desc?: string;
  children?: ArchNode[];
}

export interface ArchFluxStep {
  id: string;
  label: string;
  desc: string;
  color: "coral" | "sage" | "mauve" | "sand";
}

export interface ArchTab {
  id: "layers" | "structure" | "flux";
  label: string;
}

// ── Layers ────────────────────────────────────

export const layers: ArchLayer[] = [
  {
    id: "front",
    label: "Front-End",
    color: "coral",
    techs: [
      { name: "React 18",        desc: "UI components" },
      { name: "TypeScript 5",    desc: "Typage strict" },
      { name: "Vite 7",          desc: "Bundler" },
      { name: "SCSS Modules",    desc: "Styles isolés" },
      { name: "i18next",         desc: "fr / en" },
      { name: "React Router 7",  desc: "Routing SPA" },
      { name: "Lucide React",    desc: "Icônes" },
    ],
  },
  {
    id: "back",
    label: "Back-End",
    color: "sage",
    techs: [
      { name: "Node.js",         desc: "Runtime" },
      { name: "Express 4",       desc: "API REST" },
      { name: "Resend",          desc: "Emails transac." },
      { name: "Zod",             desc: "Validation" },
      { name: "dotenv",          desc: "Config env" },
      { name: "CORS",            desc: "Sécurité" },
    ],
  },
  {
    id: "infra",
    label: "Infra",
    color: "mauve",
    techs: [
      { name: "Yarn Workspaces",   desc: "Monorepo" },
      { name: "ESLint + jsx-a11y", desc: "Qualité code" },
      { name: "Prettier",          desc: "Formatage" },
      { name: "Sharp",             desc: "Optimisation images" },
      { name: "GitHub",            desc: "Source control" },
      { name: "Vercel",            desc: "Deploy front" },
      { name: "Render",            desc: "Deploy back" },
    ],
  },
  {
    id: "tests",
    label: "Tests",
    color: "sand",
    techs: [
      { name: "Vitest 4",  desc: "Test runner" },
      { name: "RTL 16",    desc: "React Testing Lib" },
      { name: "jsdom",     desc: "DOM simulation" },
      { name: "Playwright", desc: "Tests E2E" },
    ],
  },
];

// ── Structure ─────────────────────────────────

export const structure: ArchNode[] = [
  {
    name: "cv-portfolio/",
    type: "root",
    children: [
      {
        name: "apps/",
        type: "folder",
        children: [
          {
            name: "web/",
            type: "folder",
            desc: "React app",
            children: [
              { name: "src/components/", type: "folder", desc: "UI + sections" },
              { name: "src/hooks/",      type: "folder", desc: "useTheme, useA11y..." },
              { name: "src/pages/",      type: "folder", desc: "TestDashboard" },
              { name: "src/i18n/",       type: "folder", desc: "fr.json, en.json" },
              { name: "src/styles/",     type: "folder", desc: "variables, mixins" },
              { name: "src/assets/",     type: "folder", desc: "images, vidéos" },
              { name: "src/data/",       type: "folder", desc: "cv.data.ts" },
              { name: "src/types/",      type: "folder", desc: "cv.types.ts" },
            ],
          },
          {
            name: "api/",
            type: "folder",
            desc: "Node.js API",
            children: [
              { name: "src/routes/", type: "folder", desc: "contact.ts, cv.ts" },
              { name: "src/index.ts", type: "file",  desc: "Express server" },
              { name: ".env",         type: "file",  desc: "RESEND_API_KEY..." },
            ],
          },
        ],
      },
      { name: "scripts/",     type: "folder", desc: "optimize-images, merge-tests..." },
      { name: "package.json", type: "file",   desc: "Yarn Workspaces" },
      { name: ".eslintrc",    type: "file",   desc: "ESLint + a11y" },
      { name: ".prettierrc",  type: "file",   desc: "Formatage" },
    ],
  },
];

// ── Flux ──────────────────────────────────────

export const flux: ArchFluxStep[] = [
  { id: "user",       label: "Utilisateur", desc: "Remplit le formulaire",          color: "coral" },
  { id: "validation", label: "Validation",  desc: "Front + Back (nom, email...)",   color: "coral" },
  { id: "api",        label: "API Node",    desc: "POST /api/contact",              color: "sage"  },
  { id: "resend",     label: "Resend",      desc: "Service email transactionnel",   color: "mauve" },
  { id: "email",      label: "Email reçu",  desc: "Gmail de Carole",                color: "sand"  },
];

// ── Tabs ──────────────────────────────────────

export const getArchTabs = (t: TFunction): ArchTab[] => [
  { id: "layers",    label: t("arch.layers")    },
  { id: "structure", label: t("arch.structure") },
  { id: "flux",      label: t("arch.flux")      },
];