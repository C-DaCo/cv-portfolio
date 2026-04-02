import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Github, Linkedin } from "lucide-react";
import styles from "./Footer.module.scss";

export function Footer() {
  const { t } = useTranslation();
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [showCount, setShowCount] = useState(false);

  // Enregistre la visite une seule fois par session
  useEffect(() => {
    if (sessionStorage.getItem("cv-visited")) return;
    sessionStorage.setItem("cv-visited", "1");
    fetch(`${import.meta.env.VITE_API_URL}/api/visits`, { method: "POST" })
      .then(r => r.json())
      .then(d => { if (d.success) setVisitCount(d.count); })
      .catch(() => {});
  }, []);

  const handleCopyClick = (e: React.MouseEvent) => {
    if (!e.altKey) return;
    e.preventDefault();
    if (visitCount !== null) {
      setShowCount(v => !v);
    } else {
      fetch(`${import.meta.env.VITE_API_URL}/api/visits`)
        .then(r => r.json())
        .then(d => { if (d.success) { setVisitCount(d.count); setShowCount(true); } })
        .catch(() => {});
    }
  };

  return (
    <footer className={styles.footer} role="contentinfo">

      <span className={styles.copy} onClick={handleCopyClick}>
        © {new Date().getFullYear()} Carole Rotton
        {showCount && visitCount !== null && (
          <span className={styles.visitBadge}>{visitCount} visites</span>
        )}
      </span>
      <div className={styles.socials}>
        <a href="https://github.com/C-DaCo" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <Github size={16} strokeWidth={1.5} />
        </a>
        <a href="https://www.linkedin.com/in/carole-rotton-b09854b0" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <Linkedin size={16} strokeWidth={1.5} />
        </a>
      </div>
      <span className={styles.made}>
        {t("footer.madeWithStack")}
      </span>

    </footer>
  );
}