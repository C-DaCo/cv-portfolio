import { useState } from "react";
import { X, Layers, FolderTree, GitBranch } from "lucide-react";
import { createPortal } from "react-dom";
import styles from "./ArchDiagram.module.scss";

// ── Données ───────────────────────────────────

const layers = [
  {
    id: "front",
    label: "Front-End",
    color: "coral",
    techs: [
      { name: "React 18",      desc: "UI components" },
      { name: "TypeScript 5",  desc: "Typage strict" },
      { name: "Vite 5",        desc: "Bundler" },
      { name: "SCSS Modules",  desc: "Styles isolés" },
      { name: "i18next",       desc: "fr / en" },
      { name: "Lucide React",  desc: "Icônes" },
    ],
  },
  {
    id: "back",
    label: "Back-End",
    color: "sage",
    techs: [
      { name: "Node.js",       desc: "Runtime" },
      { name: "Express 4",     desc: "API REST" },
      { name: "Resend",        desc: "Emails transac." },
      { name: "Zod",           desc: "Validation" },
      { name: "dotenv",        desc: "Config env" },
      { name: "CORS",          desc: "Sécurité" },
    ],
  },
  {
    id: "infra",
    label: "Infra",
    color: "mauve",
    techs: [
      { name: "Yarn Workspaces", desc: "Monorepo" },
      { name: "concurrently",    desc: "Dev multi-apps" },
      { name: "ESLint + jsx-a11y", desc: "Qualité code" },
      { name: "Prettier",        desc: "Formatage" },
      { name: "GitHub",          desc: "Source control" },
      { name: "Vercel",          desc: "Deploy front" },
      { name: "Render",          desc: "Deploy back" },
    ],
  },
  {
    id: "tests",
    label: "Tests",
    color: "sand",
    techs: [
      { name: "Vitest 1",      desc: "Test runner" },
      { name: "RTL 16",        desc: "React Testing Lib" },
      { name: "jsdom",         desc: "DOM simulation" },
      { name: "Playwright",    desc: "Tests E2E" },
      { name: "42 tests",      desc: "100% passing ✓" },
    ],
  },
];

const structure = [
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
              { name: "src/hooks/", type: "folder", desc: "useTheme, useA11y..." },
              { name: "src/i18n/", type: "folder", desc: "fr.json, en.json" },
              { name: "src/styles/", type: "folder", desc: "variables, mixins" },
              { name: "src/assets/", type: "folder", desc: "images, vidéos" },
            ],
          },
          {
            name: "api/",
            type: "folder",
            desc: "Node.js API",
            children: [
              { name: "src/routes/", type: "folder", desc: "contact.ts" },
              { name: "src/index.ts", type: "file", desc: "Express server" },
              { name: ".env", type: "file", desc: "RESEND_API_KEY..." },
            ],
          },
        ],
      },
      { name: "package.json", type: "file", desc: "Yarn Workspaces" },
      { name: ".eslintrc", type: "file", desc: "ESLint + a11y" },
      { name: ".prettierrc", type: "file", desc: "Formatage" },
    ],
  },
];

const flux = [
  { id: "user",       label: "Utilisateur",   desc: "Remplit le formulaire",        color: "coral" },
  { id: "validation", label: "Validation",     desc: "Front + Back (nom, email...)", color: "coral" },
  { id: "api",        label: "API Node",       desc: "POST /api/contact",            color: "sage" },
  { id: "resend",     label: "Resend",         desc: "Service email transactionnel", color: "mauve" },
  { id: "email",      label: "Email reçu",     desc: "Gmail de Carole",              color: "sand" },
];

// ── Composants onglets ────────────────────────

function LayersTab() {
  return (
    <div className={styles.layersGrid}>
      {layers.map((layer) => (
        <div key={layer.id} className={`${styles.layerCard} ${styles[layer.color]}`}>
          <div className={styles.layerHeader}>
            <span className={styles.layerLabel}>{layer.label}</span>
          </div>
          <div className={styles.techGrid}>
            {layer.techs.map((tech) => (
              <div key={tech.name} className={styles.techItem}>
                <span className={styles.techName}>{tech.name}</span>
                <span className={styles.techDesc}>{tech.desc}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function StructureNode({ node, depth = 0 }: { node: any; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className={styles.treeNode} style={{ paddingLeft: depth * 1.2 + "rem" }}>
      <button
        className={`${styles.treeItem} ${node.type === "root" ? styles.treeRoot : ""}`}
        onClick={() => hasChildren && setOpen(o => !o)}
        aria-expanded={hasChildren ? open : undefined}
        style={{ cursor: hasChildren ? "pointer" : "default" }}
      >
        <span className={styles.treeIcon} aria-hidden="true">
          {node.type === "file" ? "·" : open ? "▾" : "▸"}
        </span>
        <span className={`${styles.treeName} ${styles[node.type]}`}>
          {node.name}
        </span>
        {node.desc && (
          <span className={styles.treeDesc}>{node.desc}</span>
        )}
      </button>
      {hasChildren && open && (
        <div className={styles.treeChildren}>
          {node.children.map((child: any) => (
            <StructureNode key={child.name} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function StructureTab() {
  return (
    <div className={styles.treeWrap}>
      {structure.map((node) => (
        <StructureNode key={node.name} node={node} />
      ))}
    </div>
  );
}

function FluxTab() {
  return (
    <div className={styles.fluxWrap}>
      {flux.map((step, i) => (
        <div key={step.id} className={styles.fluxStep}>
          <div className={`${styles.fluxNode} ${styles[step.color]}`}>
            <span className={styles.fluxLabel}>{step.label}</span>
            <span className={styles.fluxDesc}>{step.desc}</span>
          </div>
          {i < flux.length - 1 && (
            <div className={styles.fluxArrow} aria-hidden="true">↓</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Composant principal ───────────────────────

const tabs = [
  { id: "layers",    label: "Couches",   icon: <Layers size={14} /> },
  { id: "structure", label: "Structure", icon: <FolderTree size={14} /> },
  { id: "flux",      label: "Flux",      icon: <GitBranch size={14} /> },
];

export function ArchDiagram() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("layers");

  return (
    <>
      {/* Bouton déclencheur */}
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(true)}
        aria-label="Voir l'architecture du projet"
      >
        <Layers size={14} strokeWidth={1.5} />
        Voir l'archi
      </button>

      {/* Panel */}
      {isOpen && createPortal(
        <div
          className={styles.overlay}
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Architecture du portfolio"
        >
          <div className={styles.panel}>
            {/* Handle mobile */}
            <div className={styles.handle} aria-hidden="true" />

            {/* Header */}
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.panelEyebrow}>Projet personnel · 2026</p>
                <h3 className={styles.panelTitle}>Architecture du portfolio</h3>
              </div>
              <button
                className={styles.closeBtn}
                onClick={() => setIsOpen(false)}
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className={styles.tabs} role="tablist">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Contenu */}
            <div className={styles.tabContent} role="tabpanel">
              {activeTab === "layers"    && <LayersTab />}
              {activeTab === "structure" && <StructureTab />}
              {activeTab === "flux"      && <FluxTab />}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}