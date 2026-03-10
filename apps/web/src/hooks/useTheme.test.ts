import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useTheme } from "./useTheme";

describe("useTheme", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
  });

  it("retourne un thème initial (light ou dark)", () => {
    const { result } = renderHook(() => useTheme());
    expect(["light", "dark"]).toContain(result.current.theme);
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