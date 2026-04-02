import { useState } from "react";
import { Layers, GitBranch } from "lucide-react";
import styles from "./ArchDiagram.module.scss";

// ── Data ──────────────────────────────────────

const layers = [
  {
    id: "front",
    label: "Front-End",
    color: "coral" as const,
    techs: [
      { name: "Next.js 15",   desc: "App Router" },
      { name: "TypeScript",   desc: "Typage strict" },
      { name: "Tailwind v4",  desc: "Styles utilitaires" },
      { name: "SCSS",         desc: "Styles personnalisés" },
      { name: "next-intl",    desc: "fr / en" },
    ],
  },
  {
    id: "auth",
    label: "Auth & Data",
    color: "sage" as const,
    techs: [
      { name: "Clerk",        desc: "Authentification" },
      { name: "UploadThing",  desc: "Upload photos" },
      { name: "Prisma ORM",   desc: "Accès base de données" },
      { name: "SQLite",       desc: "Stockage local" },
    ],
  },
  {
    id: "ai",
    label: "IA & Push",
    color: "mauve" as const,
    techs: [
      { name: "Claude API",   desc: "Génération flashcards" },
      { name: "Anthropic SDK",desc: "Client IA" },
      { name: "Web Push API", desc: "Notifications push" },
      { name: "VAPID",        desc: "Clés push" },
    ],
  },
  {
    id: "tests",
    label: "Tests",
    color: "sand" as const,
    techs: [
      { name: "Jest",              desc: "233 tests unitaires" },
      { name: "React Testing Lib", desc: "Composants" },
      { name: "Playwright",        desc: "20 tests E2E" },
      { name: "axe-core",          desc: "WCAG AA" },
    ],
  },
];

const flux = [
  { id: "photo",   label: "Photo de notes",      desc: "L'élève prend une photo de son cours",           color: "coral" as const },
  { id: "upload",  label: "UploadThing",          desc: "Upload sécurisé de l'image",                    color: "coral" as const },
  { id: "route",   label: "API Route Next.js",    desc: "Traitement serveur, validation Zod",             color: "sage"  as const },
  { id: "claude",  label: "Claude API",           desc: "Analyse du contenu, génération des flashcards",  color: "mauve" as const },
  { id: "prisma",  label: "Prisma + SQLite",      desc: "Sauvegarde des flashcards en base de données",   color: "sage"  as const },
  { id: "sm2",     label: "Révision SM-2",        desc: "Apprentissage adaptatif avec intervalles calculés", color: "sand" as const },
];

// ── Composant ─────────────────────────────────

export function BrainZupArchiContent() {
  const [activeTab, setActiveTab] = useState<"layers" | "flux">("layers");

  return (
    <div className={styles.inlineContent}>
      <div className={styles.tabs} role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === "layers"}
          className={`${styles.tab} ${activeTab === "layers" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("layers")}
        >
          <Layers size={14} />
          Couches
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "flux"}
          className={`${styles.tab} ${activeTab === "flux" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("flux")}
        >
          <GitBranch size={14} />
          Flux IA
        </button>
      </div>

      <div className={styles.tabContent} role="tabpanel">
        {activeTab === "layers" && (
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
        )}

        {activeTab === "flux" && (
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
        )}
      </div>
    </div>
  );
}
