import { useState, useCallback, useRef, useEffect } from "react";

export type SpeechMode = "page" | "click";

export interface SpeechState {
  isSpeaking: boolean;
  isPaused: boolean;
  isSupported: boolean;
  currentText: string;
  mode: SpeechMode;
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
    if (el.closest("[aria-hidden='true']")) return false;
    if (el.closest("[data-category]")) return false;

    const text = el.getAttribute("aria-label") || el.textContent || "";
    if (text.trim().length < 2) return false;

    const parent = el.parentElement;
    if (parent && ["H1", "H2", "H3", "LI", "P"].includes(parent.tagName)) return false;

    return true;
  });
}

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [mode, setMode] = useState<SpeechMode>("page");
  const [isSupported] = useState(() => "speechSynthesis" in window);

  const elementsRef = useRef<HTMLElement[]>([]);
  const currentIndexRef = useRef(0);
  const highlightedRef = useRef<HTMLElement | null>(null);
  const isSpeakingRef = useRef(false);
  const isSkippingRef = useRef(false); // empêche la cascade onEnd au skip
  const clickHandlersRef = useRef<Map<HTMLElement, () => void>>(new Map());

  useEffect(() => {
    return () => {
      stopHighlight();
      removeClickListeners();
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

  // ── Mode click : listeners ─────────────────

  const addClickListeners = useCallback(() => {
    const elements = getReadableElements();
    elements.forEach((el) => {
      el.style.cursor = "pointer";
      const handler = () => speakElementFn(el);
      el.addEventListener("click", handler);
      clickHandlersRef.current.set(el, handler);
    });
  }, []); // eslint-disable-line

  const removeClickListeners = useCallback(() => {
    clickHandlersRef.current.forEach((handler, el) => {
      el.removeEventListener("click", handler);
      el.style.cursor = "";
    });
    clickHandlersRef.current.clear();
  }, []);

  // ── Lecture d'un élément ──────────────────

  const speakElementFn = useCallback((el: HTMLElement, onEnd?: () => void) => {
    if (!isSupported) return;
    isSkippingRef.current = true;
    window.speechSynthesis.cancel();
    setTimeout(() => { isSkippingRef.current = false; }, 0);

    const text = el.getAttribute("aria-label") || el.textContent || "";
    if (!text.trim()) { onEnd?.(); return; }

    setCurrentText(text.trim());
    setIsSpeaking(true);
    highlight(el);

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = "fr-FR";
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find((v) => v.lang.startsWith("fr"));
    if (frVoice) utterance.voice = frVoice;

    utterance.onend = () => { if (!isSkippingRef.current) onEnd?.(); };
    utterance.onerror = () => { if (!isSkippingRef.current) onEnd?.(); };

    window.speechSynthesis.speak(utterance);
  }, [isSupported]);

  // ── Lecture séquentielle ──────────────────

  const speakNext = useCallback(() => {
    const elements = elementsRef.current;

    while (currentIndexRef.current < elements.length) {
      const el = elements[currentIndexRef.current];
      currentIndexRef.current++;

      const text = el.getAttribute("aria-label") || el.textContent || "";
      if (text.trim().length < 2) continue;

      speakElementFn(el, () => {
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
  }, [speakElementFn]);

  // ── Démarrer selon le mode ────────────────

  const speakPage = useCallback(() => {
    if (!isSupported) return;
    elementsRef.current = getReadableElements();
    currentIndexRef.current = 0;
    isSpeakingRef.current = true;
    setIsSpeaking(true);
    setIsPaused(false);
    speakNext();
  }, [isSupported, speakNext]);

  const startClickMode = useCallback(() => {
    if (!isSupported) return;
    setIsSpeaking(true);
    setIsPaused(false);
    addClickListeners();
  }, [isSupported, addClickListeners]);

  const start = useCallback(() => {
    if (mode === "page") speakPage();
    else startClickMode();
  }, [mode, speakPage, startClickMode]);

  // ── Pause / Reprendre ─────────────────────

  const pause = useCallback(() => {
    if (mode === "click") return; // pas de pause en mode click
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, [mode]);

  const resume = useCallback(() => {
    if (mode === "click") return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, [mode]);

  // ── Suivant ───────────────────────────────

  const next = useCallback(() => {
    if (mode === "click") return;
    isSkippingRef.current = true;
    window.speechSynthesis.cancel();
    setTimeout(() => {
      isSkippingRef.current = false;
      speakNext();
    }, 0);
  }, [mode, speakNext]);

  // ── Précédent ─────────────────────────────

  const previous = useCallback(() => {
    if (mode === "click") return;
    isSkippingRef.current = true;
    window.speechSynthesis.cancel();
    currentIndexRef.current = Math.max(0, currentIndexRef.current - 2);
    setTimeout(() => {
      isSkippingRef.current = false;
      speakNext();
    }, 0);
  }, [mode, speakNext]);

  // ── Stop ──────────────────────────────────

  const stop = useCallback(() => {
    isSpeakingRef.current = false;
    isSkippingRef.current = true;
    window.speechSynthesis.cancel();
    isSkippingRef.current = false;
    stopHighlight();
    removeClickListeners();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentText("");
    currentIndexRef.current = 0;
  }, [removeClickListeners]);

  return {
    isSpeaking, isPaused, isSupported, currentText, mode, setMode,
    start,
    speakElement: speakElementFn,
    pause, resume, next, previous, stop,
    // gardé pour compat
    speakPage,
  };
}