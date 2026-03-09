import { useIntersectionObserver } from "@hooks/useIntersectionObserver";
import { useReducedMotion } from "@hooks/useReducedMotion";
import { Tag } from "@components/ui/Tag/Tag";
import { cvData } from "@data/cv.data";
import type { Experience } from "@/types/cv.types";
import styles from "./Experiences.module.scss";
import { useTranslation } from "react-i18next";
import { assets } from "@assets/index";

const techVariant = (category: string) => {
  const map: Record<string, "coral" | "sage" | "mauve" | "sand"> = {
    frontend: "coral", language: "coral",
    backend: "sage", database: "mauve",
    mobile: "sand", tools: "sand",
  };
  return map[category] ?? "coral";
};

function formatDate(isoDate: string) {
  const [year, month] = isoDate.split("-");
  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
  return `${months[parseInt(month) - 1]} ${year}`;
}

interface ExperienceCardProps {
  experience: Experience;
  index: number;
  isLast: boolean;
}

function ExperienceCard({ experience, index, isLast }: ExperienceCardProps) {

  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();
  const logo = assets.experiences[experience.companyLogo as keyof typeof assets.experiences];

  const { ref, isVisible } = useIntersectionObserver<HTMLLIElement>({
    threshold: 0.15,
    triggerOnce: true
  });

  return (
    <li
      ref={ref}
      className={`${styles.item} ${isVisible || prefersReduced ? styles.visible : ""}`}
      style={{ transitionDelay: prefersReduced ? "0ms" : `${index * 120}ms` }}
      aria-label={`${experience.role} chez ${experience.company}`}
    >
      <div className={styles.timelineCol} aria-hidden="true">
        <div className={styles.dot} />
        {!isLast && <div className={styles.line} />}
      </div>
      <article className={styles.card}>
        <header className={styles.cardHeader}>
          <div className={styles.cardMeta}>
            <span className={styles.sector}>{experience.sector}</span>
            {experience.remote && <span className={styles.remoteBadge} aria-label="Full remote">{t("experiences.remote")}</span>}
          </div>
          <h3 className={styles.role}>{experience.role}</h3>
          <div className={styles.companyRow}>
            <a href={experience.companyUrl} target="_blank" rel="noopener noreferrer">
              <img src={logo} alt={experience.company} className={styles.companyLogo} />
            </a>
            <span className={styles.location}>{experience.location}</span>
          </div>
          <time className={styles.dates} dateTime={experience.startDate}>
            {formatDate(experience.startDate)} — {experience.endDate ? formatDate(experience.endDate) : t("experiences.today")}
            <span className={styles.duration}> · {experience.duration}</span>
          </time>
        </header>
        <ul className={styles.descList} role="list">
          {experience.description.map((item, i) => (
            <li key={i} className={styles.descItem}>
              <span className={styles.descBullet} aria-hidden="true">→</span>
              {item}
            </li>
          ))}
        </ul>
        <div
          className={styles.techList}
          role="list"
          aria-label={t("experiences.techAriaLabel", { company: experience.company })}>
          {experience.technologies.map((tech) => (
            <Tag key={tech.name} label={tech.name} variant={techVariant(tech.category)} />
          ))}
        </div>
      </article>
    </li>
  );
}

export function Experiences() {
  const { t } = useTranslation();
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.1, triggerOnce: true });
  const prefersReduced = useReducedMotion();

  return (
    <section id="experiences" className={styles.experiences} aria-labelledby="experiences-title">
      <div ref={ref} className={`${styles.header} ${isVisible || prefersReduced ? styles.visible : ""}`}>
        <p className={styles.eyebrow} aria-hidden="true">{t("experiences.eyebrow")}</p>
        <h2 id="experiences-title" className={styles.title}>{t("experiences.title")}</h2>
        <p className={styles.subtitle}>
          {t("experiences.subtitle")}
        </p>
      </div>
      <ol className={styles.timeline} aria-label={t("experiences.ariaLabel")}>
        {cvData.experiences.map((exp, index) => (
          <ExperienceCard key={exp.id} experience={exp} index={index} isLast={index === cvData.experiences.length - 1} />
        ))}
      </ol>
    </section>
  );
}