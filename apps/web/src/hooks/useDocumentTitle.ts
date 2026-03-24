import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const SECTIONS = [
  { id: "hero",        titleKey: null },
  { id: "experiences", titleKey: "nav.experiences" },
  { id: "projects",    titleKey: "nav.projects" },
  { id: "skills",      titleKey: "nav.skills" },
  { id: "playground",  titleKey: "nav.playground" },
  { id: "education",   titleKey: "nav.education" },
  { id: "contact",     titleKey: "nav.contact" },
];

const BASE_TITLE = "Carole Rotton — Développeuse Front-End React & TypeScript";

export function useDocumentTitle() {
  const { t } = useTranslation();

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id, titleKey }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            document.title = titleKey ? `${t(titleKey)} — ${BASE_TITLE}` : BASE_TITLE;
          }
        },
        {
          threshold: 0,
          rootMargin: "-40% 0px -60% 0px",
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [t]);
}