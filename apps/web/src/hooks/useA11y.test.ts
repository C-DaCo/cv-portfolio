import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useA11y } from "./useA11y";

describe("useA11y", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  it("retourne les settings par défaut", () => {
    const { result } = renderHook(() => useA11y());
    expect(result.current.settings).toMatchObject({
      dyslexicFont: false,
      fontSize: 1,
      highContrast: false,
      pauseAnimations: false,
      letterSpacing: false,
    });
  });

  it("toggle dyslexicFont", () => {
    const { result } = renderHook(() => useA11y());
    act(() => { result.current.toggle("dyslexicFont"); });
    expect(result.current.settings.dyslexicFont).toBe(true);
    expect(document.documentElement.classList.contains("a11y-dyslexic")).toBe(true);
  });

  it("toggle highContrast ajoute la classe a11y-contrast", () => {
    const { result } = renderHook(() => useA11y());
    act(() => { result.current.toggle("highContrast"); });
    expect(document.documentElement.classList.contains("a11y-contrast")).toBe(true);
  });

  it("toggle pauseAnimations ajoute la classe a11y-no-motion", () => {
    const { result } = renderHook(() => useA11y());
    act(() => { result.current.toggle("pauseAnimations"); });
    expect(document.documentElement.classList.contains("a11y-no-motion")).toBe(true);
  });

  it("toggle letterSpacing ajoute la classe a11y-spacing", () => {
    const { result } = renderHook(() => useA11y());
    act(() => { result.current.toggle("letterSpacing"); });
    expect(document.documentElement.classList.contains("a11y-spacing")).toBe(true);
  });

  it("setFontSize(2) ajoute a11y-font-md", () => {
    const { result } = renderHook(() => useA11y());
    act(() => { result.current.setFontSize(2); });
    expect(result.current.settings.fontSize).toBe(2);
    expect(document.documentElement.classList.contains("a11y-font-md")).toBe(true);
  });

  it("setFontSize(3) ajoute a11y-font-lg", () => {
    const { result } = renderHook(() => useA11y());
    act(() => { result.current.setFontSize(3); });
    expect(document.documentElement.classList.contains("a11y-font-lg")).toBe(true);
  });

  it("reset remet les valeurs par défaut", () => {
    const { result } = renderHook(() => useA11y());
    act(() => { result.current.toggle("highContrast"); });
    act(() => { result.current.reset(); });
    expect(result.current.settings).toMatchObject({
      dyslexicFont: false,
      fontSize: 1,
      highContrast: false,
    });
  });

  it("persiste les settings dans localStorage", () => {
    const { result } = renderHook(() => useA11y());
    act(() => { result.current.toggle("dyslexicFont"); });
    const stored = JSON.parse(localStorage.getItem("cv-a11y-settings")!);
    expect(stored.dyslexicFont).toBe(true);
  });

  it("charge les settings depuis localStorage au montage", () => {
    localStorage.setItem("cv-a11y-settings", JSON.stringify({ dyslexicFont: true, fontSize: 2 }));
    const { result } = renderHook(() => useA11y());
    expect(result.current.settings.dyslexicFont).toBe(true);
    expect(result.current.settings.fontSize).toBe(2);
  });
});