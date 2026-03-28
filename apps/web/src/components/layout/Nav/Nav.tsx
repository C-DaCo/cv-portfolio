import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@hooks/useTheme";
import { useFocusTrap } from "@hooks/useFocusTrap";
import styles from "./Nav.module.scss";

export function Nav() {
  const { theme, toggleTheme } = useTheme();
  const { i18n, t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  const nextTheme = theme === "light" ? "dark" : "light";

  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const menuRef      = useRef<HTMLUListElement>(null);
  const navRef       = useRef<HTMLElement>(null);
  const wasOpenRef   = useRef(false);

  useFocusTrap(navRef, menuOpen);

  const navItems = [
    { href: "#experiences", label: t("nav.experiences") },
    { href: "#projects",    label: t("nav.projects") },
    { href: "#skills",      label: t("nav.skills") },
    { href: "#playground",  label: t("nav.playground") },
    { href: "#education",   label: t("nav.education") },
    { href: "#contact",     label: t("nav.contact") },
  ];

  const toggleLang   = () => i18n.changeLanguage(i18n.language === "fr" ? "en" : "fr");
  const handleNavClick = () => setMenuOpen(false);

  // Retour du focus au hamburger à la fermeture (guard pour éviter le focus au mount)
  useEffect(() => {
    if (!menuOpen && wasOpenRef.current) hamburgerRef.current?.focus();
    if (menuOpen) wasOpenRef.current = true;
  }, [menuOpen]);

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

  // Section active au scroll
  useEffect(() => {
    const ids = navItems.map(({ href }) => href.slice(1));
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

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

      <nav ref={navRef} className={styles.nav} aria-label="Navigation principale">
        <span className={styles.navLogo}>
          <strong>Carole</strong> Rotton
        </span>

        {/* Bouton hamburger — mobile uniquement */}
        <button
          ref={hamburgerRef}
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
          ref={menuRef}
          id="nav-menu"
          className={`${styles.navLinks} ${menuOpen ? styles.navOpen : ""}`}
          role="list"
        >
          {navItems.map(({ href, label }) => {
            const id = href.slice(1);
            return (
              <li key={href}>
                <a
                  href={href}
                  onClick={handleNavClick}
                  className={activeSection === id ? styles.navLinkActive : undefined}
                >
                  {label}
                </a>
              </li>
            );
          })}

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
              {t(`theme.label.${nextTheme}`)}
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
