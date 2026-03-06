import { useState, useRef, useEffect, useCallback } from "react";
import { useA11y } from "@hooks/useA11y";
import { useSpeech } from "@hooks/useSpeech";
import {
  Accessibility, Type, Contrast, ZapOff,
  Space, Volume2, VolumeX, RotateCcw, X,
  SkipBack, SkipForward, Play, Pause, Square
} from "lucide-react";
import styles from "./A11yMenu.module.scss";

export function A11yMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, toggle, setFontSize, reset } = useA11y();
  const { isSpeaking, isPaused, isSupported, currentText,
          speakPage, pause, resume, next, previous, stop } = useSpeech();
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Ferme au clic extérieur
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  // Ferme sur Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  const handleVoice = useCallback(() => {
    if (isSpeaking) stop();
    else speakPage();
  }, [isSpeaking, speakPage, stop]);

  const isModified =
    settings.dyslexicFont ||
    settings.fontSize > 1 ||
    settings.highContrast ||
    settings.pauseAnimations ||
    settings.letterSpacing;

  return (
    <div ref={menuRef} className={styles.wrapper}>

      {/* ── Panel ── */}
      {isOpen && (
        <div
          className={styles.panel}
          role="dialog"
          aria-label="Options d'accessibilité"
          aria-modal="false"
        >
          {/* Header */}
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>
              <Accessibility size={16} strokeWidth={1.5} />
              Accessibilité
            </span>
            <div className={styles.panelActions}>
              {isModified && (
                <button
                  onClick={reset}
                  className={styles.resetBtn}
                  aria-label="Réinitialiser les paramètres"
                >
                  <RotateCcw size={13} />
                  Reset
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className={styles.closeBtn}
                aria-label="Fermer le menu d'accessibilité"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Options */}
          <ul className={styles.options} role="list">

            {/* Police Dys */}
            <li>
              <button
                role="switch"
                aria-checked={settings.dyslexicFont}
                onClick={() => toggle("dyslexicFont")}
                className={`${styles.option} ${settings.dyslexicFont ? styles.active : ""}`}
              >
                <span className={styles.optionIcon} aria-hidden="true">
                  <Type size={18} strokeWidth={1.5} />
                </span>
                <span className={styles.optionLabel}>
                  <strong>Police Dyslexie</strong>
                  <small>OpenDyslexic</small>
                </span>
                <span className={`${styles.toggle} ${settings.dyslexicFont ? styles.toggleOn : ""}`} aria-hidden="true" />
              </button>
            </li>

            {/* Espacement */}
            <li>
              <button
                role="switch"
                aria-checked={settings.letterSpacing}
                onClick={() => toggle("letterSpacing")}
                className={`${styles.option} ${settings.letterSpacing ? styles.active : ""}`}
              >
                <span className={styles.optionIcon} aria-hidden="true">
                  <Space size={18} strokeWidth={1.5} />
                </span>
                <span className={styles.optionLabel}>
                  <strong>Espacement</strong>
                  <small>Lettres & mots</small>
                </span>
                <span className={`${styles.toggle} ${settings.letterSpacing ? styles.toggleOn : ""}`} aria-hidden="true" />
              </button>
            </li>

            {/* Contraste */}
            <li>
              <button
                role="switch"
                aria-checked={settings.highContrast}
                onClick={() => toggle("highContrast")}
                className={`${styles.option} ${settings.highContrast ? styles.active : ""}`}
              >
                <span className={styles.optionIcon} aria-hidden="true">
                  <Contrast size={18} strokeWidth={1.5} />
                </span>
                <span className={styles.optionLabel}>
                  <strong>Contraste élevé</strong>
                  <small>Mode très contrasté</small>
                </span>
                <span className={`${styles.toggle} ${settings.highContrast ? styles.toggleOn : ""}`} aria-hidden="true" />
              </button>
            </li>

            {/* Pause animations */}
            <li>
              <button
                role="switch"
                aria-checked={settings.pauseAnimations}
                onClick={() => toggle("pauseAnimations")}
                className={`${styles.option} ${settings.pauseAnimations ? styles.active : ""}`}
              >
                <span className={styles.optionIcon} aria-hidden="true">
                  <ZapOff size={18} strokeWidth={1.5} />
                </span>
                <span className={styles.optionLabel}>
                  <strong>Pause animations</strong>
                  <small>Stoppe les effets visuels</small>
                </span>
                <span className={`${styles.toggle} ${settings.pauseAnimations ? styles.toggleOn : ""}`} aria-hidden="true" />
              </button>
            </li>

            {/* Taille de police */}
            <li>
              <div className={styles.option} style={{ cursor: "default" }}>
                <span className={styles.optionIcon} aria-hidden="true">
                  <Type size={18} strokeWidth={1.5} />
                </span>
                <span className={styles.optionLabel}>
                  <strong>Taille du texte</strong>
                </span>
                <div
                  className={styles.fontSizeBtns}
                  role="group"
                  aria-label="Taille de police"
                >
                  {[
                    { size: 1, label: "A", aria: "Normale" },
                    { size: 2, label: "A", aria: "Grande", scale: "1.15" },
                    { size: 3, label: "A", aria: "Très grande", scale: "1.3" },
                  ].map(({ size, label, aria, scale }) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`${styles.fontSizeBtn} ${settings.fontSize === size ? styles.fontSizeBtnActive : ""}`}
                      aria-label={`Taille ${aria}`}
                      aria-pressed={settings.fontSize === size}
                      style={{ fontSize: scale ? `${scale}em` : undefined }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </li>

            {/* Assistant vocal */}
            {isSupported && (
              <li>
                {!isSpeaking ? (
                  <button
                    onClick={speakPage}
                    className={styles.option}
                  >
                    <span className={styles.optionIcon} aria-hidden="true">
                      <Volume2 size={18} strokeWidth={1.5} />
                    </span>
                    <span className={styles.optionLabel}>
                      <strong>Assistant vocal</strong>
                      <small>Lire la page</small>
                    </span>
                  </button>
                ) : (
                  <div className={styles.voiceControls}>
                    <p className={styles.voiceText} aria-live="polite">
                      {currentText.slice(0, 40)}{currentText.length > 40 ? "…" : ""}
                    </p>
                    <div className={styles.voiceBtns} role="group" aria-label="Contrôles lecture">
                      <button onClick={previous} className={styles.voiceBtn} aria-label="Élément précédent">
                        <SkipBack size={14} />
                      </button>
                      <button
                        onClick={isPaused ? resume : pause}
                        className={`${styles.voiceBtn} ${styles.voiceBtnMain}`}
                        aria-label={isPaused ? "Reprendre" : "Pause"}
                      >
                        {isPaused
                          ? <Play size={16} />
                          : <Pause size={16} />
                        }
                      </button>
                      <button onClick={next} className={styles.voiceBtn} aria-label="Élément suivant">
                        <SkipForward size={14} />
                      </button>
                      <button onClick={stop} className={styles.voiceBtn} aria-label="Arrêter">
                        <Square size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            )}

          </ul>
        </div>
      )}

      {/* ── Bouton déclencheur ── */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`${styles.trigger} ${isModified ? styles.triggerActive : ""}`}
        aria-label="Ouvrir les options d'accessibilité"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Accessibility size={22} strokeWidth={1.5} />
        {isModified && (
          <span className={styles.badge} aria-label="Paramètres modifiés" />
        )}
      </button>

    </div>
  );
}