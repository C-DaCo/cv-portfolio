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

export function Playground() {
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();
  const { toasts, removeToast, success, error, info, warning } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce: true,
  });

  const accordionItems: AccordionItem[] = [
    {
      id: "a11y",
      title: t("playground.accordion.items.a11y.title"),
      content: <p>{t("playground.accordion.items.a11y.content")}</p>,
    },
    {
      id: "aria",
      title: t("playground.accordion.items.aria.title"),
      content: (
        <p>
          {t("playground.accordion.items.aria.content").split(t("playground.accordion.items.aria.rule")).map((part, i, arr) =>
            i < arr.length - 1 ? (
              <span key={i}>{part}<strong>{t("playground.accordion.items.aria.rule")}</strong></span>
            ) : <span key={i}>{part}</span>
          )}
        </p>
      ),
    },
    {
      id: "focus",
      title: t("playground.accordion.items.focus.title"),
      content: <p>{t("playground.accordion.items.focus.content")}</p>,
    },
    {
      id: "contrast",
      title: t("playground.accordion.items.contrast.title"),
      content: <p>{t("playground.accordion.items.contrast.content")}</p>,
    },
  ];

  const visible = isVisible || prefersReduced;

  return (
    <section
      id="playground"
      className={styles.playground}
      aria-labelledby="playground-title"
    >
      {/* ── En-tête ── */}
      <div ref={ref} className={`${styles.header} ${visible ? styles.visible : ""}`}>
        <p className={styles.eyebrow} aria-hidden="true">{t("playground.eyebrow")}</p>
        <h2 id="playground-title" className={styles.title}>{t("playground.title")}</h2>
        <p className={styles.subtitle}>{t("playground.subtitle")}</p>
      </div>

      {/* ── Grid ── */}
      <div className={styles.grid}>

        {/* Card Modal */}
        <div className={`${styles.card} ${visible ? styles.visible : ""}`} style={{ transitionDelay: "0.1s" }}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon} aria-hidden="true">◈</span>
            <div>
              <h3 className={styles.cardTitle}>{t("playground.modal.title")}</h3>
              <p className={styles.cardDesc}>{t("playground.modal.desc")}</p>
            </div>
          </div>
          <ul className={styles.featureList} aria-label={t("playground.modal.title")}>
            <li>{t("playground.modal.featureList.focusTrap")}</li>
            <li>{t("playground.modal.featureList.escape")}</li>
            <li>{t("playground.modal.featureList.scrollLock")}</li>
            <li>{t("playground.modal.featureList.focusReturn")}</li>
            <li><code>{t("playground.modal.featureList.aria")}</code></li>
          </ul>
          <button className={styles.demoBtn} onClick={() => setIsModalOpen(true)} aria-haspopup="dialog">
            {t("playground.modal.cta")} <span aria-hidden="true">→</span>
          </button>
        </div>

        {/* Card Toast */}
        <div className={`${styles.card} ${visible ? styles.visible : ""}`} style={{ transitionDelay: "0.2s" }}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon} aria-hidden="true">◉</span>
            <div>
              <h3 className={styles.cardTitle}>{t("playground.toast.title")}</h3>
              <p className={styles.cardDesc}>{t("playground.toast.desc")}</p>
            </div>
          </div>
          <ul className={styles.featureList} aria-label={t("playground.toast.title")}>
            <li>{t("playground.toast.featureList.queue")}</li>
            <li>{t("playground.toast.featureList.timer")}</li>
            <li>{t("playground.toast.featureList.progress")}</li>
            <li><code>{t("playground.toast.featureList.aria")}</code></li>
            <li>{t("playground.toast.featureList.variants")}</li>
          </ul>
          <div className={styles.toastBtns} role="group" aria-label={t("playground.toast.ariaLabel")}>
            <button className={`${styles.toastBtn} ${styles.success}`} onClick={() => success(t("playground.toast.msgSuccess"))}>
              ✓ {t("playground.toast.success")}
            </button>
            <button className={`${styles.toastBtn} ${styles.error}`} onClick={() => error(t("playground.toast.msgError"))}>
              ✕ {t("playground.toast.error")}
            </button>
            <button className={`${styles.toastBtn} ${styles.info}`} onClick={() => info(t("playground.toast.msgInfo"))}>
              ℹ {t("playground.toast.info")}
            </button>
            <button className={`${styles.toastBtn} ${styles.warning}`} onClick={() => warning(t("playground.toast.msgWarning"))}>
              ⚠ {t("playground.toast.warning")}
            </button>
          </div>
        </div>

        {/* Card Accordion */}
        <div className={`${styles.card} ${styles.cardFull} ${visible ? styles.visible : ""}`} style={{ transitionDelay: "0.3s" }}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon} aria-hidden="true">◎</span>
            <div>
              <h3 className={styles.cardTitle}>{t("playground.accordion.title")}</h3>
              <p className={styles.cardDesc}>{t("playground.accordion.desc")}</p>
            </div>
          </div>
          <ul className={styles.featureList} aria-label={t("playground.accordion.title")}>
            <li>{t("playground.accordion.featureList.keyboard")}</li>
            <li><code>{t("playground.accordion.featureList.aria")}</code></li>
            <li>{t("playground.accordion.featureList.mode")}</li>
            <li>{t("playground.accordion.featureList.animation")}</li>
          </ul>
          <Accordion items={accordionItems} />
        </div>

      </div>

      {/* ── Modal ── */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t("playground.modal.demoTitle")}>
        <p className={styles.modalDesc}>{t("playground.modal.demoDesc")}</p>
        <ul className={styles.modalList}>
          <li>{t("playground.modal.features.focusTrap")}</li>
          <li>{t("playground.modal.features.escape")}</li>
          <li>{t("playground.modal.features.overlay")}</li>
          <li>{t("playground.modal.features.scrollLock")}</li>
          <li>{t("playground.modal.features.focusReturn")}</li>
        </ul>
        <button onClick={() => setIsModalOpen(false)} className={styles.modalCloseBtn}>
          {t("playground.modal.demoClose")}
        </button>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </section>
  );
}