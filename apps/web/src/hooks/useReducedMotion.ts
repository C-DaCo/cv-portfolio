import { useState, useEffect } from "react";

/**
 * Hook d'accessibilité : détecte la préférence `prefers-reduced-motion`
 * Permet de désactiver les animations pour les utilisateurs sensibles
 *
 * @returns {boolean} true si l'utilisateur préfère moins de mouvement
 *
 * @example
 * const prefersReduced = useReducedMotion();
 * const animClass = prefersReduced ? '' : 'animate-fade-in';
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReduced(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReduced;
}
