import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSpeech } from "./useSpeech";
import { desc, TestScope, TestType } from "@tests/test-categories";

// ── Mock speechSynthesis ──────────────────────

const mockCancel  = vi.fn();
const mockPause   = vi.fn();
const mockResume  = vi.fn();
const mockSpeak   = vi.fn();
const mockGetVoices = vi.fn().mockReturnValue([]);

beforeEach(() => {
  mockCancel.mockClear();
  mockPause.mockClear();
  mockResume.mockClear();
  mockSpeak.mockClear();

  Object.defineProperty(window, "speechSynthesis", {
    writable: true,
    configurable: true,
    value: {
      cancel:    mockCancel,
      pause:     mockPause,
      resume:    mockResume,
      speak:     mockSpeak,
      getVoices: mockGetVoices,
      paused:    false,
    },
  });

  Object.defineProperty(window, "SpeechSynthesisUtterance", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((text: string) => ({
      text,
      lang: "",
      rate: 1,
      voice: null,
      onend: null,
      onerror: null,
    })),
  });
});

// ── Rendu ─────────────────────────────────────

describe(desc(TestScope.HOOK, "useSpeech", TestType.RENDU), () => {
  it("retourne isSupported=true si speechSynthesis est dans window", () => {
    const { result } = renderHook(() => useSpeech());
    expect(result.current.isSupported).toBe(true);
  });

  it("retourne isSupported=false si speechSynthesis est absent", () => {
    // @ts-expect-error suppression volontaire pour le test
    delete window.speechSynthesis;
    const { result } = renderHook(() => useSpeech());
    expect(result.current.isSupported).toBe(false);
  });

  it("état initial — isSpeaking=false", () => {
    const { result } = renderHook(() => useSpeech());
    expect(result.current.isSpeaking).toBe(false);
  });

  it("état initial — isPaused=false", () => {
    const { result } = renderHook(() => useSpeech());
    expect(result.current.isPaused).toBe(false);
  });

  it("état initial — currentText vide", () => {
    const { result } = renderHook(() => useSpeech());
    expect(result.current.currentText).toBe("");
  });

  it("état initial — mode=page", () => {
    const { result } = renderHook(() => useSpeech());
    expect(result.current.mode).toBe("page");
  });

  it("monte et démonte sans erreur", () => {
    const { unmount } = renderHook(() => useSpeech());
    expect(() => unmount()).not.toThrow();
  });

  it("annule la synthèse au démontage", () => {
    const { unmount } = renderHook(() => useSpeech());
    unmount();
    expect(mockCancel).toHaveBeenCalled();
  });
});

// ── Interactions ──────────────────────────────

describe(desc(TestScope.HOOK, "useSpeech", TestType.INTERACTIONS), () => {
  it("setMode change le mode vers click", () => {
    const { result } = renderHook(() => useSpeech());
    act(() => { result.current.setMode("click"); });
    expect(result.current.mode).toBe("click");
  });

  it("setMode change le mode vers page", () => {
    const { result } = renderHook(() => useSpeech());
    act(() => { result.current.setMode("click"); });
    act(() => { result.current.setMode("page"); });
    expect(result.current.mode).toBe("page");
  });

  it("pause — appelle speechSynthesis.pause et isPaused=true", () => {
    const { result } = renderHook(() => useSpeech());
    act(() => { result.current.pause(); });
    expect(mockPause).toHaveBeenCalled();
    expect(result.current.isPaused).toBe(true);
  });

  it("resume — appelle speechSynthesis.resume et isPaused=false", () => {
    const { result } = renderHook(() => useSpeech());
    act(() => { result.current.pause(); });
    act(() => { result.current.resume(); });
    expect(mockResume).toHaveBeenCalled();
    expect(result.current.isPaused).toBe(false);
  });

  it("pause ignorée en mode click", () => {
    const { result } = renderHook(() => useSpeech());
    act(() => { result.current.setMode("click"); });
    act(() => { result.current.pause(); });
    expect(mockPause).not.toHaveBeenCalled();
    expect(result.current.isPaused).toBe(false);
  });

  it("stop — remet isSpeaking, isPaused, currentText à zéro", () => {
    const { result } = renderHook(() => useSpeech());
    act(() => { result.current.stop(); });
    expect(result.current.isSpeaking).toBe(false);
    expect(result.current.isPaused).toBe(false);
    expect(result.current.currentText).toBe("");
  });

  it("stop — appelle speechSynthesis.cancel", () => {
    const { result } = renderHook(() => useSpeech());
    act(() => { result.current.stop(); });
    expect(mockCancel).toHaveBeenCalled();
  });

  it("next ignoré en mode click", () => {
    const { result } = renderHook(() => useSpeech());
    act(() => { result.current.setMode("click"); });
    act(() => { result.current.next(); });
    expect(mockCancel).not.toHaveBeenCalled();
  });

  it("previous ignoré en mode click", () => {
    const { result } = renderHook(() => useSpeech());
    act(() => { result.current.setMode("click"); });
    act(() => { result.current.previous(); });
    expect(mockCancel).not.toHaveBeenCalled();
  });

  it("next — appelle cancel en mode page", () => {
    const { result } = renderHook(() => useSpeech());
    act(() => { result.current.next(); });
    expect(mockCancel).toHaveBeenCalled();
  });

  it("previous — appelle cancel en mode page", () => {
    const { result } = renderHook(() => useSpeech());
    act(() => { result.current.previous(); });
    expect(mockCancel).toHaveBeenCalled();
  });
});