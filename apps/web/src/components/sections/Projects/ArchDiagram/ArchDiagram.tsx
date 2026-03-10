import { useState } from "react";
import { X, Layers, FolderTree, GitBranch } from "lucide-react";
import { createPortal } from "react-dom";
import styles from "./ArchDiagram.module.scss";
import { useTranslation } from "react-i18next";
import { layers, structure, flux, getArchTabs } from "@data/arch.data";

const ARCH_ICONS = {
  layers:    <Layers size={14} />,
  structure: <FolderTree size={14} />,
  flux:      <GitBranch size={14} />,
};

// ── Composants onglets (exportés pour usage inline) ──

export function ArchLayersTab() {
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

export function ArchStructureTab() {
  return (
    <div className={styles.treeWrap}>
      {structure.map((node) => (
        <StructureNode key={node.name} node={node} />
      ))}
    </div>
  );
}

export function ArchFluxTab() {
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

// ── Contenu inline (sans modale) ──────────────

export function ArchDiagramContent() {
  const [activeTab, setActiveTab] = useState("layers");
  const { t } = useTranslation();
  const archTabs = getArchTabs(t);

  return (
    <div className={styles.inlineContent}>
      <div className={styles.tabs} role="tablist">
        {archTabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {ARCH_ICONS[tab.id]}
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.tabContent} role="tabpanel">
        {activeTab === "layers" && <ArchLayersTab />}
        {activeTab === "structure" && <ArchStructureTab />}
        {activeTab === "flux" && <ArchFluxTab />}
      </div>
    </div>
  );
}

// ── Composant bouton + modale ─────────────────

export function ArchDiagram() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("layers");
  const archTabs = getArchTabs(t);

  return (
    <>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(true)}
        aria-label={t("arch.triggerAriaLabel")}
      >
        <Layers size={14} strokeWidth={1.5} />
        {t("arch.trigger")}
      </button>

      {isOpen && createPortal(
        <div
          className={styles.overlay}
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t("arch.dialogAriaLabel")}
        >
          <div className={styles.panel}>
            <div className={styles.handle} aria-hidden="true" />
            <div className={styles.panelHeader}>
              <div>
                <p className={styles.panelEyebrow}>{t("arch.eyebrow")}</p>
                <h3 className={styles.panelTitle}>{t("arch.title")}</h3>
              </div>
              <button
                className={styles.closeBtn}
                onClick={() => setIsOpen(false)}
                aria-label={t("arch.close")}
              >
                <X size={18} />
              </button>
            </div>
            <div className={styles.tabs} role="tablist">
              {archTabs.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {ARCH_ICONS[tab.id]}
                  {tab.label}
                </button>
              ))}
            </div>
            <div className={styles.tabContent} role="tabpanel">
              {activeTab === "layers" && <ArchLayersTab />}
              {activeTab === "structure" && <ArchStructureTab />}
              {activeTab === "flux" && <ArchFluxTab />}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}