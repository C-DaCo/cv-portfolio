import { useTranslation } from "react-i18next";
import { useIntersectionObserver } from "@hooks/useIntersectionObserver";
import { useReducedMotion } from "@hooks/useReducedMotion";
import { cvData } from "@data/cv.data";
import type { Formation } from "@/types/cv.types";
import styles from "./Education.module.scss";
import { assets } from "@assets/index";

// ── Icône par école ───────────────────────────
const schoolIcon: Record<string, string> = {
  DAWAN:          "◈",
  IFOCOP:         "◉",
  OPENCLASSROOMS: "◎",
};

// ── Carte formation ───────────────────────────
interface EducationCardProps {
  formation: Formation;
  index: number;
}

function EducationCard({ formation, index }: EducationCardProps) {
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();
  const logo = assets.education[formation.logo as keyof typeof assets.education];
  const { ref, isVisible } = useIntersectionObserver<HTMLLIElement>({
    threshold: 0.15,
    triggerOnce: true,
  });

  const icon = schoolIcon[formation.school.toUpperCase()] ?? "◇";

  return (
    <li
      ref={ref}
      className={`${styles.card} ${isVisible || prefersReduced ? styles.visible : ""}`}
      style={{ transitionDelay: prefersReduced ? "0ms" : `${index * 120}ms` }}
      aria-label={`${formation.school}, ${formation.degree}`}
    >
      {/* Logo */}
      <div className={styles.logoWrap} aria-hidden="true">
        {formation.logo ? (
            <a href={formation.url} target="_blank" rel="noopener noreferrer">
              <img src={logo} alt={formation.school} className={styles.logo} />
            </a>
        ) : (
            <span className={styles.icon}>{icon}</span>
        )}
        </div>

      {/* Contenu */}
      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.year}>{formation.year}</span>
          <span className={styles.duration}>{t(formation.duration)}</span>
        </div>

        <p className={styles.degree}>{t(formation.degree)}</p>

        {formation.certifications && (
          <ul className={styles.certList} role="list">
            {formation.certifications.map((cert, i) => (
              <li key={i} className={styles.certItem}>
                <span aria-hidden="true">→</span> {cert}
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

// ── Composant principal ───────────────────────
export function Education() {
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section
      id="education"
      className={styles.education}
      aria-labelledby="education-title"
    >
      {/* En-tête */}
      <div
        ref={ref}
        className={`${styles.header} ${isVisible || prefersReduced ? styles.visible : ""}`}
      >
        <p className={styles.eyebrow} aria-hidden="true">
          {t("education.eyebrow")}
        </p>
        <h2 id="education-title" className={styles.title}>
          {t("education.title")}
        </h2>
      </div>

      {/* Grid */}
      <ul
        className={styles.grid}
        role="list"
        aria-label={t("education.ariaLabel")}
      >
        {cvData.formations.map((formation, index) => (
          <EducationCard
            key={formation.id}
            formation={formation}
            index={index}
          />
        ))}
      </ul>
    </section>
  );
}