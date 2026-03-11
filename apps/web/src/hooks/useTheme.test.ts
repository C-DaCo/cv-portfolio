import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useTheme } from "./useTheme";

describe("useTheme", () => {
  it("retourne un thème initial valide", () => {
    const { result } = renderHook(() => useTheme());
    expect(["light", "dark", "neon-dark", "neon-light"]).toContain(result.current.theme);
  });

  it("expose une fonction toggleTheme", () => {
    const { result } = renderHook(() => useTheme());
    expect(typeof result.current.toggleTheme).toBe("function");
  });

  it("toggleTheme change le thème", () => {
    const { result } = renderHook(() => useTheme());
    const initial = result.current.theme;
    act(() => { result.current.toggleTheme(); });
    expect(result.current.theme).not.toBe(initial);
  });

  it("cycle complet light → dark → neon-dark → neon-light → light", () => {
    const { result } = renderHook(() => useTheme());

    // Force le point de départ à light
    while (result.current.theme !== "light") {
      act(() => { result.current.toggleTheme(); });
    }

    act(() => { result.current.toggleTheme(); });
    expect(result.current.theme).toBe("dark");

    act(() => { result.current.toggleTheme(); });
    expect(result.current.theme).toBe("neon-dark");

    act(() => { result.current.toggleTheme(); });
    expect(result.current.theme).toBe("neon-light");

    act(() => { result.current.toggleTheme(); });
    expect(result.current.theme).toBe("light");
  });

  it("toggleTheme met à jour data-theme sur <html>", () => {
    const { result } = renderHook(() => useTheme());
    act(() => { result.current.toggleTheme(); });
    expect(document.documentElement.getAttribute("data-theme")).toBe(result.current.theme);
  });

  it("deux instances partagent le même thème", () => {
    const { result: a } = renderHook(() => useTheme());
    const { result: b } = renderHook(() => useTheme());
    act(() => { a.current.toggleTheme(); });
    expect(b.current.theme).toBe(a.current.theme);
  });
});