import { useState, useEffect } from "react";

export type Theme = "light" | "dark";

const THEMES: Theme[] = ["light", "dark"];

function getThemeFromTime(): Theme {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 7 ? "dark" : "light";
}

const THEME_STORAGE_KEY = "cv-theme";

// ── Singleton partagé ─────────────────────────
let isManualGlobal = false;
let intervalId: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<(theme: Theme) => void>();

function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark" || stored === "light") {
      isManualGlobal = true;
      return stored;
    }
  } catch { /* ignore */ }
  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) return "dark";
  if (window.matchMedia?.("(prefers-color-scheme: light)").matches) return "light";
  return getThemeFromTime();
}

let globalTheme: Theme = getInitialTheme();

function setGlobalTheme(theme: Theme) {
  globalTheme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  listeners.forEach((fn) => fn(theme));
}

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
  try { localStorage.removeItem(THEME_STORAGE_KEY); } catch { /* ignore */ }
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
    try { localStorage.setItem(THEME_STORAGE_KEY, nextTheme); } catch { /* ignore */ }
    setGlobalTheme(nextTheme);
  };

  return { theme, toggleTheme };
}