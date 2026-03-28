import { useTranslation } from "react-i18next";
import { useIntersectionObserver } from "@hooks/useIntersectionObserver";
import { useReducedMotion } from "@hooks/useReducedMotion";
import { cvData } from "@data/cv.data";
import type { SkillCategory } from "@/types/cv.types";
import styles from "./Skills.module.scss";

// ── Logos devicons ────────────────────────────

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

const skillLogos: Record<string, string> = {
  "JavaScript": `${DEVICON}/javascript/javascript-original.svg`,
  "TypeScript": `${DEVICON}/typescript/typescript-original.svg`,
  "PHP":        `${DEVICON}/php/php-original.svg`,
  "Python":     `${DEVICON}/python/python-original.svg`,
  "Java":       `${DEVICON}/java/java-original.svg`,
  "React":      `${DEVICON}/react/react-original.svg`,
  "Next.js":    `${DEVICON}/nextjs/nextjs-original.svg`,
  "SCSS":       `${DEVICON}/sass/sass-original.svg`,
  "Redux":      `${DEVICON}/redux/redux-original.svg`,
  "Angular":    `${DEVICON}/angular/angular-original.svg`,
  "Node.js":    `${DEVICON}/nodejs/nodejs-original.svg`,
  "Prisma":     `${DEVICON}/prisma/prisma-original.svg`,
  "MongoDB":    `${DEVICON}/mongodb/mongodb-original.svg`,
  "PostgreSQL": `${DEVICON}/postgresql/postgresql-original.svg`,
  "MySQL":      `${DEVICON}/mysql/mysql-original.svg`,
  "GitLab":     `${DEVICON}/gitlab/gitlab-original.svg`,
  "Vite":       `${DEVICON}/vite/vite-original.svg`,
  "JIRA":       `${DEVICON}/jira/jira-original.svg`,
  "Android":    `${DEVICON}/android/android-original.svg`,
  "Capacitor":  `${DEVICON}/capacitor/capacitor-original.svg`,
};

// Logos noirs sur fond transparent → à inverser en dark mode
const invertInDark = new Set(["Next.js"]);

// ── Icône a11y inline (pas de devicon disponible) ─

function A11yIcon() {
  return (
    <svg
      width="22" height="22" viewBox="0 0 24 24"
      aria-hidden="true" focusable="false" fill="none"
      className={styles.logo}
    >
      <circle cx="12" cy="12" r="12" fill="#005A9C" />
      {/* Tête */}
      <circle cx="12" cy="5.5" r="2" fill="white" />
      {/* Corps */}
      <line x1="12" y1="7.5" x2="12" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" />
      {/* Bras */}
      <line x1="8"  y1="11"  x2="16" y2="11" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      {/* Jambes */}
      <line x1="12" y1="14"  x2="9"  y2="19.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="12" y1="14"  x2="15" y2="19.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

const CATEGORY_ORDER: SkillCategory[] = ["language", "front", "back", "divers"];

// ── Composant principal ───────────────────────

export function Skills() {
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();

  const { ref: headerRef, isVisible: headerVisible } =
    useIntersectionObserver<HTMLDivElement>({ threshold: 0.1, triggerOnce: true });

  const { ref: gridRef, isVisible: gridVisible } =
    useIntersectionObserver<HTMLDivElement>({ threshold: 0.05, triggerOnce: true });

  const byCategory = CATEGORY_ORDER.map((cat) => ({
    cat,
    label: t(`skills.categories.${cat}`),
    skills: cvData.skills
      .filter((s) => s.category === cat)
      .sort((a, b) => b.level - a.level),
  }));

  return (
    <section id="skills" className={styles.skills} aria-labelledby="skills-title">

      {/* ── En-tête ── */}
      <div
        ref={headerRef}
        className={`${styles.header} ${headerVisible || prefersReduced ? styles.visible : ""}`}
      >
        <p className={styles.eyebrow} aria-hidden="true">{t("skills.eyebrow")}</p>
        <h2 id="skills-title" className={styles.title}>{t("skills.title")}</h2>
        <p className={styles.subtitle}>{t("skills.subtitle")}</p>
      </div>

      {/* ── Grille logos ── */}
      <div
        ref={gridRef}
        className={`${styles.groups} ${gridVisible || prefersReduced ? styles.visible : ""}`}
        aria-label={t("skills.cloudAriaLabel")}
      >
        {byCategory.map(({ cat, label, skills }) => (
          <div key={cat} className={`${styles.group} ${styles[cat]}`}>
            <h3 className={styles.groupTitle}>{label}</h3>
            <ul className={styles.chipList} role="list">
              {skills.map((skill) => {
                const logo = skillLogos[skill.name];
                const isA11y = skill.name === "skills.a11y";
                const displayName = t(skill.name);
                return (
                  <li key={skill.name} role="listitem">
                    <div
                      className={`${styles.chip} ${styles[`level${skill.level}`]}`}
                      aria-label={t("skills.levelAriaLabel", { name: displayName, level: skill.level })}
                    >
                      {isA11y ? (
                        <A11yIcon />
                      ) : logo ? (
                        <img
                          src={logo}
                          alt=""
                          aria-hidden="true"
                          className={`${styles.logo} ${invertInDark.has(skill.name) ? styles.invertDark : ""}`}
                          width={22}
                          height={22}
                          loading="lazy"
                        />
                      ) : null}
                      <span className={styles.chipName}>{displayName}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

    </section>
  );
}
