import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useReducedMotion } from "@hooks/useReducedMotion";
import { Tag } from "@components/ui/Tag/Tag";
import { Button } from "@components/ui/Button/Button";
import { Skeleton } from "@components/ui/Skeleton/Skeleton";
import { cvData } from "@data/cv.data";
import styles from "./Hero.module.scss";
import { assets } from "@assets/index";

export function Hero() {
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const { personalInfo, skills } = cvData;

  const frontTags = skills
    .filter((s) => s.category === "front")
    .slice(0, 4)
    .map((s) => s.name);

  const backTags = skills
    .filter((s) => s.category === "back")
    .slice(0, 3)
    .map((s) => s.name);

  const allTags = [...frontTags, ...backTags];

  const tagVariants = ["coral", "sage", "mauve", "sand"] as const;

  const stats = [
    { id: "years",    num: "+9",  label: t("hero.statsYears")     },
    { id: "companies", num: "2",  label: t("hero.statsCompanies") },
    { id: "projects", num: "+10", label: t("hero.statsProjects")  },
  ];

  return (
    <section id="hero" className={styles.hero} aria-label="Introduction">

      {/* ── Blobs décoratifs ── */}
      <div className={styles.bgLayer} aria-hidden="true">
        <div className={`${styles.blob} ${styles.blob1}`} />
        <div className={`${styles.blob} ${styles.blob2}`} />
        <div className={`${styles.blob} ${styles.blob3}`} />
      </div>

      <div className={styles.inner}>

        {/* ── Gauche ── */}
        <div className={styles.left}>

          {/* Badge disponibilité */}
          <div
            className={`${styles.eyebrow} ${!prefersReduced ? styles.animFadeUp : ""}`}
            style={{ animationDelay: "0.2s" }}
            role="status"
            aria-label="Statut : disponible, full remote"
          >
            <span className={styles.pill}>
              <span className={styles.pulse} aria-hidden="true" />
              {t("hero.available")}
            </span>
          </div>

          {/* Titre */}
          <div
            className={`${styles.titleBlock} ${!prefersReduced ? styles.animFadeUp : ""}`}
            style={{ animationDelay: "0.35s" }}
          >
            <p className={styles.firstname} aria-hidden="true">
              {personalInfo.firstName}
            </p>
            <h1
              className={styles.lastname}
              aria-label={`${personalInfo.firstName} ${personalInfo.lastName}, ${personalInfo.title}`}
            >
              <em>{personalInfo.lastName}</em>
            </h1>
            <div
              className={styles.roleRow}
              aria-label={`${personalInfo.title} spécialisée ${personalInfo.subtitle}`}
            >
              <span className={styles.roleDash} aria-hidden="true" />
              <span className={styles.roleText}>
                {t("hero.rolePart1")} · <strong>{t("hero.rolePart2")}</strong>
              </span>
            </div>
          </div>

          {/* Description */}
          <p
            className={`${styles.desc} ${!prefersReduced ? styles.animFadeUp : ""}`}
            style={{ animationDelay: "0.5s" }}
          >
            {t("hero.summary")}
          </p>

          {/* Bonnes pratiques */}
          <div
            className={`${styles.practices} ${!prefersReduced ? styles.animFadeUp : ""}`}
            style={{ animationDelay: "0.58s" }}
            aria-label={t("hero.practicesLabel")}
          >
            <p className={styles.practicesTitle}>{t("hero.practicesTitle")}</p>
            <ul className={styles.practicesList} role="list">
              {(t("hero.practicesList", { returnObjects: true }) as string[]).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div
            className={`${styles.tags} ${!prefersReduced ? styles.animFadeUp : ""}`}
            style={{ animationDelay: "0.65s" }}
            aria-label={t("hero.techAriaLabel")}
            role="list"
          >
            {allTags.map((name, i) => (
              <Tag
                key={name}
                label={t(name)}
                variant={tagVariants[i % tagVariants.length]}
              />
            ))}
          </div>

          {/* CTAs */}
          <div
            className={`${styles.ctas} ${!prefersReduced ? styles.animFadeUp : ""}`}
            style={{ animationDelay: "0.8s" }}
          >
            <Button as="a" href="#contact" variant="primary">
              {t("hero.ctaContact")} <span aria-hidden="true">→</span>
            </Button>
            <Button as="a" href="#projects" variant="secondary">
              {t("hero.ctaProjects")}
            </Button>
          </div>
        </div>

        {/* ── Droite : photo ── */}
        <div
          className={`${styles.right} ${!prefersReduced ? styles.animFadeLeft : ""}`}
          style={{ animationDelay: "0.4s" }}
          aria-hidden="true"
        >
          <div className={styles.decoBlob} />

          <span className={`${styles.decoTag} ${styles.decoTag1}`}>✦ React · TypeScript</span>
          <span className={`${styles.decoTag} ${styles.decoTag2}`}>♡ EdTech · Remote</span>
          <span className={`${styles.decoTag} ${styles.decoTag3}`}>◎ {t("skills.a11y")}</span>

          <div className={styles.dotDeco1} />
          <div className={styles.dotDeco2} />
          <div className={styles.dotDeco3} />

          <div className={styles.photoCard}>
            {!photoLoaded && (
              <Skeleton style={{ width: "100%", height: "100%", position: "absolute", inset: 0, borderRadius: "inherit" }} />
            )}
            <img
              src={assets.photo}
              srcSet={`${assets.photo320} 320w, ${assets.photo} 400w`}
              sizes="(max-width: 768px) 160px, 300px"
              alt={`Portrait de ${personalInfo.firstName} ${personalInfo.lastName}, ${personalInfo.title}`}
              className={styles.photo}
              width={400}
              height={533}
              fetchpriority="high"
              onLoad={() => setPhotoLoaded(true)}
              style={{ opacity: photoLoaded ? 1 : 0, transition: "opacity 0.3s ease" }}
            />
          </div>
        </div>

      </div>

      {/* ── Stats ── */}
      <footer
        className={`${styles.statsBar} ${!prefersReduced ? styles.animFadeUp : ""}`}
        style={{ animationDelay: "1s" }}
        aria-label={t("hero.statsAriaLabel")}
      >
        <div className={styles.stats}>
          {stats.map(({ id, num, label }, i) => (
            <div key={id} className={styles.statGroup}>
              {i > 0 && <div className={styles.statSep} aria-hidden="true" />}
              <div className={styles.stat}>
                <span className={styles.statNum} aria-label={num}>
                  {num.includes("+") ? "+" : ""}<em>{num.replace("+", "")}</em>
                </span>
                <span className={styles.statLabel}>{label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.scrollHint} aria-hidden="true">
          <span className={styles.scrollText}>{t("hero.scroll")}</span>
          <div className={styles.scrollArrow}>
            <svg width="14" height="20" viewBox="0 0 14 20" fill="none" className={styles.scrollSvg}>
              <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M1 7L7 13L13 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
              <path d="M1 13L7 19L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.2" />
            </svg>
          </div>
        </div>
      </footer>

    </section>
  );
}