import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useReducedMotion } from "./useReducedMotion";
import { desc, TestScope, TestType } from "@tests/test-categories";

type MediaQueryListener = (e: MediaQueryListEvent) => void;
let mediaQueryListener: MediaQueryListener | null = null;

function mockMatchMedia(matches: boolean) {
  vi.stubGlobal("matchMedia", vi.fn().mockImplementation(() => ({
    matches,
    addEventListener: vi.fn().mockImplementation((_: string, cb: MediaQueryListener) => {
      mediaQueryListener = cb;
    }),
    removeEventListener: vi.fn(),
  })));
}

beforeEach(() => {
  mediaQueryListener = null;
});

describe(desc(TestScope.HOOK, "useReducedMotion", TestType.RENDU), () => {
  it("retourne false si prefers-reduced-motion=no-preference", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it("retourne true si prefers-reduced-motion=reduce", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });
});

describe(desc(TestScope.HOOK, "useReducedMotion", TestType.INTERACTIONS), () => {
  it("met à jour la valeur quand la préférence change vers reduce", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    act(() => {
      mediaQueryListener!({ matches: true } as MediaQueryListEvent);
    });

    expect(result.current).toBe(true);
  });

  it("met à jour la valeur quand la préférence change vers no-preference", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);

    act(() => {
      mediaQueryListener!({ matches: false } as MediaQueryListEvent);
    });

    expect(result.current).toBe(false);
  });

  it("retire le listener au démontage", () => {
    const removeEventListener = vi.fn();
    vi.stubGlobal("matchMedia", vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener,
    })));

    const { unmount } = renderHook(() => useReducedMotion());
    unmount();
    expect(removeEventListener).toHaveBeenCalled();
  });
});