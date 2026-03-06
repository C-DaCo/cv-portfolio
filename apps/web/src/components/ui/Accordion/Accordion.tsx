import { useState, useId, useRef, useCallback } from "react";
import styles from "./Accordion.module.scss";

// ── Types ─────────────────────────────────────

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean; // plusieurs panneaux ouverts simultanément
}

// ── Item individuel ───────────────────────────

interface AccordionItemProps {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: (id: string) => void;
  buttonId: string;
  panelId: string;
}

function AccordionItemComponent({
  item,
  isOpen,
  onToggle,
  buttonId,
  panelId,
}: AccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`${styles.item} ${isOpen ? styles.open : ""}`}>
      {/* Bouton */}
      <h3 className={styles.heading}>
        <button
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className={styles.trigger}
          onClick={() => onToggle(item.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onToggle(item.id);
            }
          }}
        >
          <span className={styles.triggerLabel}>{item.title}</span>
          <span
            className={`${styles.icon} ${isOpen ? styles.iconOpen : ""}`}
            aria-hidden="true"
          >
            ↓
          </span>
        </button>
      </h3>

      {/* Panneau */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        ref={contentRef}
        className={styles.panel}
        style={{
          maxHeight: isOpen ? contentRef.current?.scrollHeight : 0,
        }}
      >
        <div className={styles.panelInner}>
          {item.content}
        </div>
      </div>
    </div>
  );
}

// ── Composant principal ───────────────────────

export function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const uid = useId();
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const handleToggle = useCallback(
    (id: string) => {
      setOpenIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (!allowMultiple) next.clear();
          next.add(id);
        }
        return next;
      });
    },
    [allowMultiple]
  );

  // Navigation clavier entre les items (flèches haut/bas)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      const buttons = document.querySelectorAll<HTMLButtonElement>(
        `[id^="${uid}-btn-"]`
      );
      if (e.key === "ArrowDown") {
        e.preventDefault();
        buttons[Math.min(index + 1, buttons.length - 1)]?.focus();
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        buttons[Math.max(index - 1, 0)]?.focus();
      }
      if (e.key === "Home") {
        e.preventDefault();
        buttons[0]?.focus();
      }
      if (e.key === "End") {
        e.preventDefault();
        buttons[buttons.length - 1]?.focus();
      }
    },
    [uid]
  );

  return (
    <div
      className={styles.accordion}
      role="list"
      aria-label="Accordion"
    >
      {items.map((item, index) => (
        <div
          key={item.id}
          role="listitem"
          onKeyDown={(e) => handleKeyDown(e, index)}
        >
          <AccordionItemComponent
            item={item}
            isOpen={openIds.has(item.id)}
            onToggle={handleToggle}
            buttonId={`${uid}-btn-${item.id}`}
            panelId={`${uid}-panel-${item.id}`}
          />
        </div>
      ))}
    </div>
  );
}