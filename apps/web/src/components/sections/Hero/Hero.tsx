import { useTranslation } from "react-i18next";
import { useReducedMotion } from "@hooks/useReducedMotion";
import { Tag } from "@components/ui/Tag/Tag";
import { Button } from "@components/ui/Button/Button";
import { cvData } from "@data/cv.data";
import styles from "./Hero.module.scss";
import { assets } from "@assets/index";

export function Hero() {
  const { t } = useTranslation();
  const prefersReduced = useReducedMotion();
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

  return (
    <section className={styles.hero} aria-label="Introduction">

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

          {/* Tags */}
          <div
            className={`${styles.tags} ${!prefersReduced ? styles.animFadeUp : ""}`}
            style={{ animationDelay: "0.65s" }}
            aria-label="Technologies maîtrisées"
            role="list"
          >
            {allTags.map((name, i) => (
              <Tag
                key={name}
                label={name}
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
            <Button as="a" href="#projects" variant="outline">
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
          <span className={`${styles.decoTag} ${styles.decoTag3}`}>◎ Accessibilité</span>

          <div className={styles.dotDeco1} />
          <div className={styles.dotDeco2} />
          <div className={styles.dotDeco3} />

          <div className={styles.photoCard}>
            <img
              src={assets.photo}
              alt={`Portrait de ${personalInfo.firstName} ${personalInfo.lastName}, ${personalInfo.title}`}
              className={styles.photo}
              width={400}
              height={533}
            />
          </div>
        </div>

      </div>

      {/* ── Stats ── */}
      <footer
        className={`${styles.statsBar} ${!prefersReduced ? styles.animFadeUp : ""}`}
        style={{ animationDelay: "1s" }}
        aria-label="En chiffres"
      >
        <div className={styles.stats}>
          {[
            { num: t("hero.statsYearsValue"), label: t("hero.statsYears") },
            { num: t("hero.statsCompaniesValue"),  label: t("hero.statsCompanies") },
            { num: t("hero.statsModulesValue"), label: t("hero.statsModules") },
          ].map(({ num, label }, i) => (
            <>
              {i > 0 && <div className={styles.statSep} aria-hidden="true" key={`sep-${i}`} />}
              <div className={styles.stat} key={label}>
                <span className={styles.statNum} aria-label={num}>
                  <em>{num.replace("+", "")}</em>{num.includes("+") ? "+" : ""}
                </span>
                <span className={styles.statLabel}>{label}</span>
              </div>
            </>
          ))}
        </div>

        <div className={styles.scrollHint} aria-hidden="true">
          <span className={styles.scrollText}>{t("hero.scroll")}</span>
          <div className={styles.scrollArrow}>
            {/* Chevron animé SVG */}
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
