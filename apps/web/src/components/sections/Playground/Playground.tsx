import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useIntersectionObserver } from "@hooks/useIntersectionObserver";
import { useReducedMotion } from "@hooks/useReducedMotion";
import { Modal } from "@components/ui/Modal/Modal";
import { ToastContainer } from "@components/ui/Toast/Toast";
import { useToast } from "@components/ui/Toast/useToast";
import { Accordion } from "@components/ui/Accordion/Accordion";
import type { AccordionItem } from "@components/ui/Accordion/Accordion";
import styles from "./Playground.module.scss";

// ── Données accordion ─────────────────────────

const accordionItems: AccordionItem[] = [
  {
    id: "a11y",
    title: "♿ Pourquoi l'accessibilité web ?",
    content: (
      <p>
        15% de la population mondiale vit avec un handicap. Une interface accessible
        bénéficie à tous — utilisateurs de lecteurs d'écran, navigation au clavier,
        personnes âgées, contextes de faible connectivité. C'est un droit, pas une option.
      </p>
    ),
  },
  {
    id: "aria",
    title: "🏷 ARIA — quand et comment l'utiliser ?",
    content: (
      <p>
        ARIA (Accessible Rich Internet Applications) enrichit le HTML sémantique.
        Règle d'or : <strong>ne pas utiliser ARIA si le HTML natif suffit</strong>.
        Un <code>&lt;button&gt;</code> est toujours préférable à un{" "}
        <code>&lt;div role="button"&gt;</code>.
      </p>
    ),
  },
  {
    id: "focus",
    title: "⌨️ Gestion du focus clavier",
    content: (
      <p>
        Tout élément interactif doit être atteignable au clavier (Tab) et avoir un
        indicateur de focus visible. Les modales nécessitent un <em>focus trap</em> —
        le focus ne doit pas s'échapper vers le contenu en arrière-plan.
      </p>
    ),
  },
  {
    id: "contrast",
    title: "🎨 Contraste et couleurs",
    content: (
      <p>
        Le WCAG 2.1 niveau AA exige un ratio de contraste de <strong>4.5:1</strong> pour
        le texte normal et <strong>3:1</strong> pour le texte large. Ne jamais transmettre
        une information uniquement par la couleur.
      </p>
    ),
  },
];

// ── Composant principal ───────────────────────

export function Playground() {
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();
  const { toasts, removeToast, success, error, info, warning } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section
      id="playground"
      className={styles.playground}
      aria-labelledby="playground-title"
    >
      {/* ── En-tête ── */}
      <div
        ref={ref}
        className={`${styles.header} ${isVisible || prefersReduced ? styles.visible : ""}`}
      >
        <p className={styles.eyebrow} aria-hidden="true">
          {t("playground.eyebrow")}
        </p>
        <h2 id="playground-title" className={styles.title}>
          {t("playground.title")}
        </h2>
        <p className={styles.subtitle}>
          {t("playground.subtitle")}
        </p>
      </div>

      {/* ── Grid des démos ── */}
      <div className={styles.grid}>

        {/* ── Card Modal ── */}
        <div className={`${styles.card} ${isVisible || prefersReduced ? styles.visible : ""}`}
          style={{ transitionDelay: "0.1s" }}
        >
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon} aria-hidden="true">◈</span>
            <div>
              <h3 className={styles.cardTitle}>{t("playground.modal.title")}</h3>
              <p className={styles.cardDesc}>{t("playground.modal.desc")}</p>
            </div>
          </div>

          <ul className={styles.featureList} aria-label="Fonctionnalités">
            <li>Focus trap — le focus reste dans la modale</li>
            <li>Fermeture via Échap ou overlay</li>
            <li>Scroll lock sur le body</li>
            <li>Retour du focus à l'élément déclencheur</li>
            <li><code>aria-modal</code>, <code>aria-labelledby</code></li>
          </ul>

          <button
            className={styles.demoBtn}
            onClick={() => setIsModalOpen(true)}
            aria-haspopup="dialog"
          >
            {t("playground.modal.cta")}
            <span aria-hidden="true">→</span>
          </button>
        </div>

        {/* ── Card Toast ── */}
        <div
          className={`${styles.card} ${isVisible || prefersReduced ? styles.visible : ""}`}
          style={{ transitionDelay: "0.2s" }}
        >
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon} aria-hidden="true">◉</span>
            <div>
              <h3 className={styles.cardTitle}>{t("playground.toast.title")}</h3>
              <p className={styles.cardDesc}>{t("playground.toast.desc")}</p>
            </div>
          </div>

          <ul className={styles.featureList} aria-label="Fonctionnalités">
            <li>File d'attente de notifications</li>
            <li>Fermeture automatique avec timer</li>
            <li>Barre de progression animée</li>
            <li><code>aria-live="polite"</code>, <code>aria-atomic</code></li>
            <li>4 variantes : succès, erreur, info, warning</li>
          </ul>

          <div className={styles.toastBtns} role="group" aria-label="Déclencher une notification">
            <button
              className={`${styles.toastBtn} ${styles.success}`}
              onClick={() => success("Enregistrement réussi !")}
            >
              ✓ Succès
            </button>
            <button
              className={`${styles.toastBtn} ${styles.error}`}
              onClick={() => error("Une erreur est survenue.")}
            >
              ✕ Erreur
            </button>
            <button
              className={`${styles.toastBtn} ${styles.info}`}
              onClick={() => info("Mise à jour disponible.")}
            >
              ℹ Info
            </button>
            <button
              className={`${styles.toastBtn} ${styles.warning}`}
              onClick={() => warning("Session bientôt expirée.")}
            >
              ⚠ Warning
            </button>
          </div>
        </div>

        {/* ── Card Accordion ── */}
        <div
          className={`${styles.card} ${styles.cardFull} ${isVisible || prefersReduced ? styles.visible : ""}`}
          style={{ transitionDelay: "0.3s" }}
        >
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon} aria-hidden="true">◎</span>
            <div>
              <h3 className={styles.cardTitle}>{t("playground.accordion.title")}</h3>
              <p className={styles.cardDesc}>{t("playground.accordion.desc")}</p>
            </div>
          </div>

          <ul className={styles.featureList} aria-label="Fonctionnalités">
            <li>Navigation clavier ↑ ↓ Home End</li>
            <li><code>aria-expanded</code>, <code>aria-controls</code></li>
            <li>Mode simple ou multi-ouverture</li>
            <li>Animation hauteur sans JS de mesure</li>
          </ul>

          <Accordion items={accordionItems} />
        </div>

      </div>

      {/* ── Modal ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Exemple de modale accessible"
      >
        <p style={{ color: "var(--clr-text-muted)", lineHeight: 1.7, marginBottom: "1rem" }}>
          Cette modale implémente toutes les bonnes pratiques d'accessibilité :
        </p>
        <ul style={{ color: "var(--clr-text-muted)", lineHeight: 2, paddingLeft: "1.25rem" }}>
          <li>Le focus est piégé à l'intérieur</li>
          <li>Fermeture via la touche Échap</li>
          <li>Clic sur l'overlay pour fermer</li>
          <li>Le scroll du body est bloqué</li>
          <li>Le focus revient au déclencheur à la fermeture</li>
        </ul>
        <button
          onClick={() => setIsModalOpen(false)}
          style={{
            marginTop: "1.5rem",
            padding: "0.75rem 1.5rem",
            borderRadius: "9999px",
            background: "#E8715A",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
          }}
        >
          Fermer
        </button>
      </Modal>

      {/* ── Toasts ── */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

    </section>
  );
}