import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useTheme } from "./useTheme";
import { desc, TestScope, TestType } from "@tests/test-categories";

describe(desc(TestScope.HOOK, "useTheme", TestType.RENDU), () => {
  it("retourne un thème initial valide", () => {
    const { result } = renderHook(() => useTheme());
    expect(["light", "dark"]).toContain(result.current.theme);
  });

  it("expose une fonction toggleTheme", () => {
    const { result } = renderHook(() => useTheme());
    expect(typeof result.current.toggleTheme).toBe("function");
  });

  it("cycle complet light → dark → light", () => {
    const { result } = renderHook(() => useTheme());

    while (result.current.theme !== "light") {
      act(() => { result.current.toggleTheme(); });
    }

    act(() => { result.current.toggleTheme(); });
    expect(result.current.theme).toBe("dark");

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

  it("toggleTheme persiste le thème dans localStorage", () => {
    const { result } = renderHook(() => useTheme());
    act(() => { result.current.toggleTheme(); });
    expect(localStorage.getItem("cv-theme")).toBe(result.current.theme);
  });
});