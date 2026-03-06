import { useState, useEffect, useCallback } from "react";

export interface A11ySettings {
  dyslexicFont: boolean;
  fontSize: number; // 1 = normal, 2 = grand, 3 = très grand
  highContrast: boolean;
  pauseAnimations: boolean;
  letterSpacing: boolean;
}

const DEFAULT: A11ySettings = {
  dyslexicFont: false,
  fontSize: 1,
  highContrast: false,
  pauseAnimations: false,
  letterSpacing: false,
};

const STORAGE_KEY = "cv-a11y-settings";

export function useA11y() {
  const [settings, setSettings] = useState<A11ySettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULT, ...JSON.parse(stored) } : DEFAULT;
    } catch {
      return DEFAULT;
    }
  });

  // Applique les settings sur <html>
  useEffect(() => {
    const root = document.documentElement;

    // Police Dys
    root.classList.toggle("a11y-dyslexic", settings.dyslexicFont);

    // Taille de police
    root.classList.remove("a11y-font-md", "a11y-font-lg");
    if (settings.fontSize === 2) root.classList.add("a11y-font-md");
    if (settings.fontSize === 3) root.classList.add("a11y-font-lg");

    // Contraste élevé
    root.classList.toggle("a11y-contrast", settings.highContrast);

    // Pause animations
    root.classList.toggle("a11y-no-motion", settings.pauseAnimations);

    // Espacement
    root.classList.toggle("a11y-spacing", settings.letterSpacing);

    // Persiste
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const toggle = useCallback((key: keyof A11ySettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const setFontSize = useCallback((size: number) => {
    setSettings((prev) => ({ ...prev, fontSize: size }));
  }, []);

  const reset = useCallback(() => {
    setSettings(DEFAULT);
  }, []);

  return { settings, toggle, setFontSize, reset };
}