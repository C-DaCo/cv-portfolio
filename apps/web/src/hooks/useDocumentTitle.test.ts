import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useDocumentTitle } from "./useDocumentTitle";
import { desc, TestScope, TestType } from "@tests/test-categories";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "fr", changeLanguage: vi.fn() },
  }),
}));

// ── Helper : IntersectionObserver constructible ───────

function makeMockObserver(onObserve?: (cb: IntersectionObserverCallback) => void) {
  const disconnect = vi.fn();
  const observe    = vi.fn();

  class MockObserver {
    constructor(cb: IntersectionObserverCallback) {
      onObserve?.(cb);
    }
    observe    = observe;
    disconnect = disconnect;
  }

  vi.stubGlobal("IntersectionObserver", MockObserver);
  return { observe, disconnect };
}

beforeEach(() => {
  document.title    = "Carole Rotton";
  document.body.innerHTML = "";
});

// ── Rendu ─────────────────────────────────────

describe(desc(TestScope.HOOK, "useDocumentTitle", TestType.RENDU), () => {
  it("monte sans erreur", () => {
    expect(() => renderHook(() => useDocumentTitle())).not.toThrow();
  });

  it("ne change pas le titre si aucune section n'est dans le DOM", () => {
    renderHook(() => useDocumentTitle());
    expect(document.title).toBe("Carole Rotton");
  });
});

// ── Interactions ──────────────────────────────

describe(desc(TestScope.HOOK, "useDocumentTitle", TestType.INTERACTIONS), () => {
  it("met à jour le titre quand la section hero est intersectée", () => {
    const hero = document.createElement("div");
    hero.id    = "hero";
    document.body.appendChild(hero);

    let capturedCb: IntersectionObserverCallback | null = null;
    makeMockObserver((cb) => { capturedCb = cb; });

    renderHook(() => useDocumentTitle());

    capturedCb!(
      [{ isIntersecting: true, target: hero } as unknown as IntersectionObserverEntry],
      {} as IntersectionObserver
    );
    expect(document.title).toBe("Carole Rotton");
  });

  it("met à jour le titre avec la clé i18n pour une section avec titleKey", () => {
    const el = document.createElement("div");
    el.id    = "experiences";
    document.body.appendChild(el);

    let capturedCb: IntersectionObserverCallback | null = null;
    makeMockObserver((cb) => { capturedCb = cb; });

    renderHook(() => useDocumentTitle());

    capturedCb!(
      [{ isIntersecting: true, target: el } as unknown as IntersectionObserverEntry],
      {} as IntersectionObserver
    );
    expect(document.title).toBe("nav.experiences — Carole Rotton");
  });

  it("ne met pas à jour le titre si isIntersecting=false", () => {
    const el = document.createElement("div");
    el.id    = "skills";
    document.body.appendChild(el);

    let capturedCb: IntersectionObserverCallback | null = null;
    makeMockObserver((cb) => { capturedCb = cb; });

    renderHook(() => useDocumentTitle());

    capturedCb!(
      [{ isIntersecting: false, target: el } as unknown as IntersectionObserverEntry],
      {} as IntersectionObserver
    );
    expect(document.title).toBe("Carole Rotton");
  });

  it("déconnecte les observers au démontage", () => {
    const el = document.createElement("div");
    el.id    = "contact";
    document.body.appendChild(el);

    const { disconnect } = makeMockObserver();
    const { unmount }    = renderHook(() => useDocumentTitle());
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});