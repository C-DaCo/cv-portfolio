import "@testing-library/jest-dom";
import { vi } from "vitest";
import { configureAxe, toHaveNoViolations } from "jest-axe";
expect.extend(toHaveNoViolations); 

configureAxe({
  rules: [
    {
      id: "color-contrast",
      selector: "*",
    },
  ],
});

window.HTMLElement.prototype.scrollIntoView = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { returnObjects?: boolean }) => {
      if (options?.returnObjects) return [key];
      return key;
    },
    i18n: { changeLanguage: vi.fn(), language: "fr" },
  }),
  initReactI18next: { type: "3rdParty", init: vi.fn() },
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}));

// Mock window.matchMedia (non supporté par jsdom)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  constructor(callback: IntersectionObserverCallback) {}
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

Object.defineProperty(globalThis, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});