# Meteo Widget Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer l'image statique de la ProjectCard Station météo par un widget iframe live, supprimer le badge WIP, et ajouter un onglet Architecture dans le Drawer.

**Architecture:** Ajout d'un champ `widget?: string` dans le type `Project` — la donnée pilote le rendu, pas le composant. Le nouveau composant `MeteoStationArchiContent` reprend la structure de `BrainZupArchiContent`. L'onglet archi du Drawer est enrichi d'un cas `weather-station`.

**Tech Stack:** React 18, TypeScript, SCSS Modules, react-i18next, Vitest + RTL

---

### Task 1 : Type + données

**Files:**
- Modify: `src/types/projects.types.ts`
- Modify: `src/data/projects.data.ts`

- [ ] **Ajouter `widget?: string` dans `Project`**

Dans `src/types/projects.types.ts`, après `github?:`:
```ts
widget?: string;
```

- [ ] **Mettre à jour le projet weather-station dans `projects.data.ts`**

Remplacer l'entrée `weather-station` par :
```ts
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
  year: "2026",
  tabs: [
    { id: "screenshots", label: t("projects.drawer.screenshots") },
    { id: "archi", label: t("projects.drawer.archi") },
  ],
},
```

- [ ] **Commit**
```bash
git add src/types/projects.types.ts src/data/projects.data.ts
git commit -m "feat: add widget field to Project type, update weather-station data"
```

---

### Task 2 : Composant MeteoStationArchiContent

**Files:**
- Create: `src/components/sections/Projects/ArchDiagram/MeteoStationArchiContent.tsx`

- [ ] **Créer le fichier**

```tsx
import { useState } from "react";
import { Layers, GitBranch } from "lucide-react";
import styles from "./ArchDiagram.module.scss";

const layers = [
  {
    id: "hardware",
    label: "Hardware",
    color: "coral" as const,
    techs: [
      { name: "ESP32",        desc: "Microcontrôleur WiFi" },
      { name: "DHT22 ×2",     desc: "Température + humidité" },
      { name: "Deep Sleep",   desc: "Autonomie batterie" },
      { name: "Raspberry Pi", desc: "Serveur central" },
    ],
  },
  {
    id: "infra",
    label: "Infrastructure",
    color: "sage" as const,
    techs: [
      { name: "Mosquitto",         desc: "Broker MQTT" },
      { name: "PM2",               desc: "Process manager" },
      { name: "Cloudflare Tunnel", desc: "Accès public sécurisé" },
      { name: "SQLite",            desc: "Persistance 30 jours" },
    ],
  },
  {
    id: "server",
    label: "Serveur",
    color: "mauve" as const,
    techs: [
      { name: "Node.js",        desc: "Serveur Express" },
      { name: "WebSocket",      desc: "Push temps réel" },
      { name: "REST API",       desc: "/current, /history" },
      { name: "better-sqlite3", desc: "ORM léger" },
    ],
  },
  {
    id: "ui",
    label: "Front-End",
    color: "sand" as const,
    techs: [
      { name: "Vanilla JS", desc: "Dashboard + Widget" },
      { name: "Chart.js 4", desc: "Graphiques historique" },
      { name: "CSS vars",   desc: "Dark theme" },
      { name: "Jest",       desc: "24 tests serveur" },
    ],
  },
];

const flux = [
  { id: "dht",    label: "DHT22",             desc: "Lecture température et humidité",                  color: "coral" as const },
  { id: "mqtt",   label: "MQTT (ESP32 → Pi)", desc: "Publication JSON via WiFi toutes les 10 minutes", color: "coral" as const },
  { id: "broker", label: "Mosquitto",         desc: "Réception et dispatch du message MQTT",           color: "sage"  as const },
  { id: "node",   label: "Node.js Server",    desc: "Insertion SQLite + broadcast WebSocket",          color: "mauve" as const },
  { id: "ws",     label: "WebSocket",         desc: "Push instantané vers dashboard et widget",        color: "mauve" as const },
  { id: "ui",     label: "Dashboard / Widget",desc: "Affichage temps réel et historique Chart.js",     color: "sand"  as const },
];

export function MeteoStationArchiContent() {
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
          Flux données
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
```

- [ ] **Commit**
```bash
git add src/components/sections/Projects/ArchDiagram/MeteoStationArchiContent.tsx
git commit -m "feat: add MeteoStationArchiContent component"
```

---

### Task 3 : Drawer — cas weather-station dans ArchiTab

**Files:**
- Modify: `src/components/sections/Projects/Drawer/Drawer.tsx`

- [ ] **Importer `MeteoStationArchiContent`**

Après l'import `BrainZupArchiContent` :
```ts
import { MeteoStationArchiContent } from "../ArchDiagram/MeteoStationArchiContent";
```

- [ ] **Ajouter le cas `weather-station` dans `ArchiTab`**

Remplacer la fonction `ArchiTab` :
```tsx
function ArchiTab({ project }: { project: Project }) {
    return (
        <div className={styles.tabContent}>
            {project.id === "brainzup"
                ? <BrainZupArchiContent />
                : project.id === "weather-station"
                    ? <MeteoStationArchiContent />
                    : <ArchDiagramContent />
            }
        </div>
    );
}
```

- [ ] **Commit**
```bash
git add src/components/sections/Projects/Drawer/Drawer.tsx
git commit -m "feat: add weather-station archi tab in Drawer"
```

---

### Task 4 : ProjectCard — rendu iframe + suppression wip

**Files:**
- Modify: `src/components/sections/Projects/Projects.tsx`
- Modify: `src/components/sections/Projects/Projects.module.scss`

- [ ] **Ajouter `.widgetFrame` dans `Projects.module.scss`**

Après le bloc `.wipBadge` :
```scss
.widgetFrame {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  pointer-events: none;
}
```

- [ ] **Mettre à jour le bloc `.media` dans `ProjectCard`**

Remplacer le bloc `.media` dans `ProjectCard` :
```tsx
<div className={styles.media}>
  {project.widget ? (
    <iframe
      src={project.widget}
      className={styles.widgetFrame}
      title={`Widget météo en direct — ${project.title}`}
      loading="lazy"
    />
  ) : project.image ? (
    <img
      src={project.image}
      alt={`Capture de ${project.title}`}
      className={styles.poster}
      loading="lazy"
      width={project.imageWidth}
      height={project.imageHeight}
    />
  ) : (
    <div className={styles.portfolioMedia} aria-hidden="true">
      <div className={styles.archDiagram}>
        {["Front", "API", "Tests", "i18n", "a11y"].map((label) => (
          <span key={label} className={styles.archNode}>{label}</span>
        ))}
      </div>
    </div>
  )}
</div>
```

- [ ] **Commit**
```bash
git add src/components/sections/Projects/Projects.tsx src/components/sections/Projects/Projects.module.scss
git commit -m "feat: render iframe widget in ProjectCard, remove wip badge"
```

---

### Task 5 : i18n

**Files:**
- Modify: `src/i18n/locales/fr.json`
- Modify: `src/i18n/locales/en.json`

- [ ] **Mettre à jour `weather.longDesc` en français**

```json
"weather": {
  "desc": "Station météo connectée sur Raspberry Pi — relevés de température et humidité en temps réel.",
  "longDesc": "Architecture IoT complète : ESP32 + DHT22 → MQTT → Raspberry Pi → WebSocket. Widget embarqué live sur le portfolio. Serveur Node.js, persistance SQLite 30 jours, historique Chart.js, accès public via Cloudflare Tunnel. 24 tests Jest."
}
```

- [ ] **Mettre à jour `weather.longDesc` en anglais**

```json
"weather": {
  "desc": "Connected weather station on Raspberry Pi — real-time temperature and humidity readings.",
  "longDesc": "Full IoT stack: ESP32 + DHT22 → MQTT → Raspberry Pi → WebSocket. Live widget embedded in the portfolio. Node.js server, 30-day SQLite persistence, Chart.js history, public access via Cloudflare Tunnel. 24 Jest tests."
}
```

- [ ] **Commit**
```bash
git add src/i18n/locales/fr.json src/i18n/locales/en.json
git commit -m "content: update weather station longDesc, remove WIP mention"
```

---

### Task 6 : Tests

**Files:**
- Modify: `src/components/sections/Projects/Projects.test.tsx`

- [ ] **Lancer les tests existants pour vérifier qu'il n'y a pas de régression**

```bash
cd apps/web && yarn vitest run src/components/sections/Projects/Projects.test.tsx
```

Expected : tous les tests passent (le test "affiche les 2 projets" teste Tactileo et Ce portfolio — non impacté).

- [ ] **Vérifier que le widget iframe est rendu pour weather-station**

Aucun test supplémentaire requis : `Projects.test.tsx` utilise les vraies données via `getProjects`, et le test axe-core valide l'accessibilité globale incluant l'iframe.

- [ ] **Lancer la suite complète**

```bash
cd apps/web && yarn test
```

Expected : tous les tests passent.

- [ ] **Commit si des ajustements ont été nécessaires**
```bash
git add src/components/sections/Projects/Projects.test.tsx
git commit -m "test: verify Projects renders weather widget"
```
