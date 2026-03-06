import { useState, useCallback, useRef, useEffect } from "react";

export interface SpeechState {
  isSpeaking: boolean;
  isPaused: boolean;
  isSupported: boolean;
  currentText: string;
}

// Sélectionne tous les éléments lisibles
function getReadableElements(): HTMLElement[] {
  const main = document.getElementById("main");
  if (!main) return [];

  return Array.from(
    main.querySelectorAll<HTMLElement>(
      "h1, h2, h3, h4, p, li, time, blockquote, figcaption, td, th"
    )
  ).filter((el) => {
    // Ignore les éléments cachés
    if (el.closest("[aria-hidden='true']")) return false;
    if (el.closest("[data-category]")) return false; // skills — déjà dans un parent lisible

    // Ignore les éléments vides
    const text = el.getAttribute("aria-label") || el.textContent || "";
    if (text.trim().length < 2) return false;

    // Ignore les éléments dont le texte est déjà couvert par un parent dans la liste
    // (évite les doublons h2 > span par exemple)
    const parent = el.parentElement;
    if (parent && ["H1","H2","H3","LI","P"].includes(parent.tagName)) return false;

    return true;
  });
}

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [isSupported] = useState(() => "speechSynthesis" in window);

  const elementsRef = useRef<HTMLElement[]>([]);
  const currentIndexRef = useRef(0);
  const highlightedRef = useRef<HTMLElement | null>(null);
  const isSpeakingRef = useRef(false);

  useEffect(() => {
    return () => {
      stopHighlight();
      window.speechSynthesis?.cancel();
    };
  }, []);

  // ── Highlight ─────────────────────────────

  const highlight = (el: HTMLElement) => {
    stopHighlight();
    el.style.outline = "2px solid #ffd673";
    el.style.outlineOffset = "4px";
    el.style.borderRadius = "4px";
    el.style.backgroundColor = "rgba(255, 223, 120, 0.08)";
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    highlightedRef.current = el;
  };

  const stopHighlight = () => {
    if (highlightedRef.current) {
      highlightedRef.current.style.outline = "";
      highlightedRef.current.style.outlineOffset = "";
      highlightedRef.current.style.borderRadius = "";
      highlightedRef.current.style.backgroundColor = "";
      highlightedRef.current = null;
    }
  };

  // ── Lecture d'un élément ──────────────────

  const speakElement = useCallback((el: HTMLElement, onEnd?: () => void) => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();

    const text = el.getAttribute("aria-label") || el.textContent || "";
    if (!text.trim()) { onEnd?.(); return; }

    setCurrentText(text.trim());
    highlight(el);

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = "fr-FR";
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find((v) => v.lang.startsWith("fr"));
    if (frVoice) utterance.voice = frVoice;

    utterance.onend = () => { onEnd?.(); };
    utterance.onerror = () => { onEnd?.(); };

    window.speechSynthesis.speak(utterance);
  }, [isSupported]);

  // ── Lecture séquentielle ──────────────────

  const speakNext = useCallback(() => {
    const elements = elementsRef.current;
    
    // Cherche le prochain élément non vide
    while (currentIndexRef.current < elements.length) {
      const el = elements[currentIndexRef.current];
      currentIndexRef.current++;

      const text = el.getAttribute("aria-label") || el.textContent || "";
      if (text.trim().length < 2) continue; // skip les vides

      speakElement(el, () => {
        // Vérifie qu'on n'a pas stoppé manuellement
        if (isSpeakingRef.current && !window.speechSynthesis.paused) {
          speakNext();
        }
      });
      return;
    }

    // Fin de page
    setIsSpeaking(false);
    setCurrentText("");
    stopHighlight();
    currentIndexRef.current = 0;
    isSpeakingRef.current = false;
  }, [speakElement]);

  // ── Lecture de page ───────────────────────

  const speakPage = useCallback(() => {
    if (!isSupported) return;
    elementsRef.current = getReadableElements();
    currentIndexRef.current = 0;
    isSpeakingRef.current = true;
    setIsSpeaking(true);
    setIsPaused(false);
    speakNext();
  }, [isSupported, speakNext]);

  // ── Pause / Reprendre ─────────────────────

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, []);

  // ── Suivant ───────────────────────────────

  const next = useCallback(() => {
    window.speechSynthesis.cancel();
    speakNext();
  }, [speakNext]);

  // ── Précédent ─────────────────────────────

  const previous = useCallback(() => {
    window.speechSynthesis.cancel();
    currentIndexRef.current = Math.max(0, currentIndexRef.current - 2);
    speakNext();
  }, [speakNext]);

  // ── Stop ──────────────────────────────────

  const stop = useCallback(() => {
    isSpeakingRef.current = false;
    window.speechSynthesis.cancel();
    stopHighlight();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentText("");
    currentIndexRef.current = 0;
  }, []);

  return {
    isSpeaking, isPaused, isSupported, currentText,
    speakPage, speakElement: (el: HTMLElement) => speakElement(el),
    pause, resume, next, previous, stop,
  };
}