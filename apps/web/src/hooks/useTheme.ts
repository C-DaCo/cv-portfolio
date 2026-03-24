import { useState, useEffect } from "react";

export type Theme = "light" | "dark";

const THEMES: Theme[] = ["light", "dark"];

function getThemeFromTime(): Theme {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 7 ? "dark" : "light";
}

function getInitialTheme(): Theme {
  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) return "dark";
  if (window.matchMedia?.("(prefers-color-scheme: light)").matches) return "light";
  return getThemeFromTime();
}

// ── Singleton partagé ─────────────────────────
let globalTheme: Theme = getInitialTheme();
const listeners = new Set<(theme: Theme) => void>();

function setGlobalTheme(theme: Theme) {
  globalTheme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  listeners.forEach((fn) => fn(theme));
}

// Intervalle global — une seule instance
let intervalId: ReturnType<typeof setInterval> | null = null;
let isManualGlobal = false;
setGlobalTheme(globalTheme);

function startAutoTheme() {
  if (intervalId) return;
  intervalId = setInterval(() => {
    if (!isManualGlobal) setGlobalTheme(getThemeFromTime());
  }, 60_000);
}

// Reset à minuit
const now = new Date();
const msUntilMidnight =
  new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
setTimeout(() => {
  isManualGlobal = false;
  setGlobalTheme(getThemeFromTime());
}, msUntilMidnight);

startAutoTheme();

// Suit les changements de préférence OS (sauf si l'utilisateur a toggleé manuellement)
window.matchMedia?.("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  if (!isManualGlobal) setGlobalTheme(e.matches ? "dark" : "light");
});

// ── Hook ──────────────────────────────────────
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(globalTheme);

  useEffect(() => {
    const listener = (t: Theme) => setTheme(t);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const toggleTheme = () => {
    isManualGlobal = true;
    const currentIndex = THEMES.indexOf(globalTheme);
    const nextTheme = THEMES[(currentIndex + 1) % THEMES.length];
    setGlobalTheme(nextTheme);
  };

  return { theme, toggleTheme };
}