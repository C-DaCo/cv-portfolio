import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@hooks/useTheme";
import styles from "./Nav.module.scss";

export function Nav() {
  const { theme, toggleTheme } = useTheme();
  const { i18n, t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleLang = () => i18n.changeLanguage(i18n.language === "fr" ? "en" : "fr");
  const handleNavClick = () => setMenuOpen(false);

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
    <>
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
          aria-label={menuOpen ? t("nav.close") : t("nav.open")}
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
            { href: "#projects",    label: t("nav.projects") },
            { href: "#skills",      label: t("nav.skills") },
            { href: "#playground",  label: t("nav.playground") },
            { href: "#education",   label: t("nav.education") },
            { href: "#contact",     label: t("nav.contact") },
          ].map(({ href, label }) => (
            <li key={href}>
              <a href={href} onClick={handleNavClick}>{label}</a>
            </li>
          ))}

          <li>
            <button
              onClick={toggleLang}
              className={styles.langToggle}
              aria-label={t("nav.toggleLang")}
            >
              {i18n.language === "fr" ? "EN" : "FR"}
            </button>
          </li>

          <li>
            <button
              onClick={toggleTheme}
              aria-label={t(`theme.toggle.${theme}`)}
              className={styles.themeToggle}
            >
              {theme === "light"      && "⏾ Clair"}
              {theme === "dark"       && "✦ Sombre"}
              {theme === "neon-dark"  && "◈ Neon"}
              {theme === "neon-light" && "☀ Pop"}
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}