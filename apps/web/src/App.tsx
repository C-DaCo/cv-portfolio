import { useTheme } from "@hooks/useTheme";
import { Hero, Contact, Skills, Education, Experiences, Playground, Footer } from "@components/index";
import "@styles/main.scss";
import styles from "./App.module.scss";
import { useTranslation } from "react-i18next";
import { A11yMenu } from "@components/ui/A11yMenu/A11yMenu";
import { Projects } from "@components/index";
import { useEffect, useState } from "react";
import { useDocumentTitle } from "@hooks/useDocumentTitle";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { i18n, t } = useTranslation();
  const toggleLang = () => i18n.changeLanguage(i18n.language === "fr" ? "en" : "fr");
  const [menuOpen, setMenuOpen] = useState(false);
  // Ferme le menu au clic sur un lien
  const handleNavClick = () => setMenuOpen(false);
  useDocumentTitle();

  // Ferme sur Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // Bloque le scroll quand menu ouvert
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);


  return (
    <div className={styles.app}>
      <a href="#main" className="skip-link">
        {t("skipLink")}
      </a>

        {/* Overlay mobile */}
        {menuOpen && (
          <div
            className={styles.navOverlay}
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
        )}

      <nav className={styles.nav} aria-label="Navigation principale">
        <span className={styles.navLogo}>
          <strong>Carole</strong> Rotton
        </span>

        {/* Bouton hamburger — mobile uniquement */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ""}`}
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
          aria-controls="nav-menu"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <ul
          id="nav-menu"
          className={`${styles.navLinks} ${menuOpen ? styles.navOpen : ""}`}
          role="list"
        >

          {[
            { href: "#experiences", label: t("nav.experiences") },
            { href: "#projects", label: t("nav.projects") },
            { href: "#skills", label: t("nav.skills") },
            { href: "#playground", label: t("nav.playground") },
            { href: "#education", label: t("nav.education") },
            { href: "#contact", label: t("nav.contact") },
          ].map(({ href, label }) => (
            <li key={href}>
              <a href={href} onClick={handleNavClick}>{label}</a>
            </li>
          ))}
          <li>
            <button onClick={toggleLang} className={styles.langToggle} aria-label={t("nav.toggleLang")}>
              {i18n.language === "fr" ? "EN" : "FR"}
            </button>
          </li>
          <li>
            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? t("theme.toggleLight") : t("theme.toggleDark")}
              className={styles.themeToggle}
            >
              {theme === "dark" ? "☀ Clair" : "⏾ Sombre"}
            </button>
          </li>
        </ul>
      </nav>

      <main id="main">
        <Hero />
        <Experiences />
        <Projects />
        <Skills />
        <Playground />
        <Education />
        <Contact />
      </main>

      <Footer />
      <A11yMenu />

    </div>
  );
}