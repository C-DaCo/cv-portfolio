import { useState, useEffect } from "react";

function getThemeFromTime(): "light" | "dark" {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 7 ? "dark" : "light";
}

// ── Singleton partagé ─────────────────────────
let globalTheme: "light" | "dark" = getThemeFromTime();
const listeners = new Set<(theme: "light" | "dark") => void>();

function setGlobalTheme(theme: "light" | "dark") {
  globalTheme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  listeners.forEach((fn) => fn(theme));
}

// Intervalle global — une seule instance
let intervalId: ReturnType<typeof setInterval> | null = null;
let isManualGlobal = false;

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

// ── Hook ──────────────────────────────────────
export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(globalTheme);

  useEffect(() => {
    // S'abonne aux changements globaux
    const listener = (t: "light" | "dark") => setTheme(t);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const toggleTheme = () => {
    isManualGlobal = true;
    setGlobalTheme(globalTheme === "dark" ? "light" : "dark");
  };

  return { theme, toggleTheme };
}
