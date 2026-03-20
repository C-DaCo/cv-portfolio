import { useTranslation } from "react-i18next";
import { useIntersectionObserver } from "@hooks/useIntersectionObserver";
import { useReducedMotion } from "@hooks/useReducedMotion";
import { cvData } from "@data/cv.data";
import type { Skill, SkillCategory } from "@/types/cv.types";
import styles from "./Skills.module.scss";

// ── Taille de police selon le niveau ─────────

const fontSizes: Record<number, string> = {
  5: "2.6rem",
  4: "1.9rem",
  3: "1.35rem",
  2: "1rem",
  1: "0.85rem",
};

// ── Couleur par catégorie ─────────────────────

const categoryColor: Record<SkillCategory, string> = {
  language: styles.colorYellow,
  front:    styles.colorCoral,
  back:     styles.colorSage,
  divers:   styles.colorMauve,
};


// ── Composant principal ───────────────────────

export function Skills() {
 const { t } = useTranslation();
  const prefersReduced = useReducedMotion();

  const { ref: headerRef, isVisible: headerVisible } =
    useIntersectionObserver<HTMLDivElement>({ threshold: 0.1, triggerOnce: true });

  const { ref: cloudRef, isVisible: cloudVisible } =
    useIntersectionObserver<HTMLDivElement>({ threshold: 0.05, triggerOnce: true });

  const categories: { key: SkillCategory; label: string; colorClass: string }[] = [
    { key: "language", label: t("skills.categories.language"), colorClass: styles.colorYellow },
    { key: "front",    label: t("skills.categories.front"),    colorClass: styles.colorCoral  },
    { key: "back",     label: t("skills.categories.back"),     colorClass: styles.colorSage   },
    { key: "divers",   label: t("skills.categories.divers"),   colorClass: styles.colorMauve  },
  ];

  // Tri : du plus grand au plus petit pour un rendu plus naturel
  const sortedSkills = [...cvData.skills].sort((a, b) => b.level - a.level);

  return (
    <section
      id="skills"
      className={styles.skills}
      aria-labelledby="skills-title"
    >
      {/* ── En-tête ── */}
      <div
        ref={headerRef}
        className={`${styles.header} ${headerVisible || prefersReduced ? styles.visible : ""}`}
      >
        <p className={styles.eyebrow} aria-hidden="true">
          {t("skills.eyebrow")}
        </p>
        <h2 id="skills-title" className={styles.title}>
          {t("skills.title")}
        </h2>
        <p className={styles.subtitle}>
          {t("skills.subtitle")}
        </p>

        {/* Légende */}
        <div className={styles.legend} aria-label="Légende des couleurs">
          {categories.map(({ key, label, colorClass }) => (
            <span key={key} className={styles.legendItem}>
              <span className={`${styles.legendDot} ${colorClass}`} aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Nuage ── */}
      <div
        ref={cloudRef}
        className={`${styles.cloud} ${cloudVisible || prefersReduced ? styles.visible : ""}`}
        role="list"
        aria-label={t("skills.cloudAriaLabel")}
      >
        {sortedSkills.map((skill: Skill, i: number) => {
          return (
            <span
              key={skill.name}
              role="listitem"
              aria-label={t("skills.levelAriaLabel", { name: skill.name, level: skill.level })}
              data-category={skill.category}
              className={`${styles.word} ${categoryColor[skill.category]}`}
              style={{
                fontSize: fontSizes[skill.level],
              }}
            >
              {skill.name}
            </span>
          );
        })}
      </div>

    </section>
  );
}