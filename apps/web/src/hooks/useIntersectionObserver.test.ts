import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useIntersectionObserver } from "./useIntersectionObserver";
import { desc, TestScope, TestType } from "@tests/test-categories";

// Note : ref.current reste null dans jsdom — le hook ne peut pas observer
// un élément sans vrai rendu DOM. Le comportement isVisible=true/false
// est couvert indirectement par les tests de sections (Hero, Education, etc.)
// qui mockent ce hook. On teste ici le contrat de l'API.

describe(desc(TestScope.HOOK, "useIntersectionObserver", TestType.RENDU), () => {
  it("retourne isVisible=false par défaut", () => {
    const { result } = renderHook(() => useIntersectionObserver());
    expect(result.current.isVisible).toBe(false);
  });

  it("retourne une ref initialisée", () => {
    const { result } = renderHook(() => useIntersectionObserver());
    expect(result.current.ref).toBeDefined();
    expect(result.current.ref).toHaveProperty("current");
  });

  it("accepte des options threshold et rootMargin", () => {
    expect(() =>
      renderHook(() => useIntersectionObserver({ threshold: 0.5, rootMargin: "0px" }))
    ).not.toThrow();
  });

  it("accepte triggerOnce=false", () => {
    expect(() =>
      renderHook(() => useIntersectionObserver({ triggerOnce: false }))
    ).not.toThrow();
  });

  it("monte et démonte sans erreur", () => {
    const { unmount } = renderHook(() => useIntersectionObserver());
    expect(() => unmount()).not.toThrow();
  });
});