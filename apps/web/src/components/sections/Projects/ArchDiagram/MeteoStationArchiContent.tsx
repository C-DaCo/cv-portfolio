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
  { id: "dht",    label: "DHT22",              desc: "Lecture température et humidité",                  color: "coral" as const },
  { id: "mqtt",   label: "MQTT (ESP32 → Pi)",  desc: "Publication JSON via WiFi toutes les 10 minutes", color: "coral" as const },
  { id: "broker", label: "Mosquitto",          desc: "Réception et dispatch du message MQTT",           color: "sage"  as const },
  { id: "node",   label: "Node.js Server",     desc: "Insertion SQLite + broadcast WebSocket",          color: "mauve" as const },
  { id: "ws",     label: "WebSocket",          desc: "Push instantané vers dashboard et widget",        color: "mauve" as const },
  { id: "ui",     label: "Dashboard / Widget", desc: "Affichage temps réel et historique Chart.js",     color: "sand"  as const },
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
