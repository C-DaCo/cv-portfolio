import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./Toast.module.scss";

// ── Types ─────────────────────────────────────

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

// ── Icônes ────────────────────────────────────

const icons: Record<ToastType, string> = {
  success: "✓",
  error:   "✕",
  info:    "ℹ",
  warning: "⚠",
};

const labels: Record<ToastType, string> = {
  success: "Succès",
  error:   "Erreur",
  info:    "Information",
  warning: "Avertissement",
};

// ── Toast individuel ──────────────────────────

function ToastMessage({ toast, onRemove }: { toast: ToastItem; onRemove: (id: string) => void }) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timerRef.current = setTimeout(
      () => onRemove(toast.id),
      toast.duration ?? 4000
    );
    return () => clearTimeout(timerRef.current);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div
      className={`${styles.toast} ${styles[toast.type]}`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`${labels[toast.type]} : ${toast.message}`}
    >
      {/* Barre de progression */}
      <div
        className={styles.progress}
        style={{ animationDuration: `${toast.duration ?? 4000}ms` }}
        aria-hidden="true"
      />

      {/* Icône */}
      <span className={styles.icon} aria-hidden="true">
        {icons[toast.type]}
      </span>

      {/* Message */}
      <p className={styles.message}>{toast.message}</p>

      {/* Fermer */}
      <button
        onClick={() => onRemove(toast.id)}
        className={styles.closeBtn}
        aria-label="Fermer la notification"
      >
        ✕
      </button>
    </div>
  );
}

// ── Conteneur Toast ───────────────────────────

export function ToastContainer({ toasts, onRemove }: ToastProps) {
  if (toasts.length === 0) return null;

  return createPortal(
    <div
      className={styles.container}
      aria-label="Notifications"
      aria-live="polite"
      aria-relevant="additions removals"
    >
      {toasts.map((toast) => (
        <ToastMessage key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>,
    document.body
  );
}