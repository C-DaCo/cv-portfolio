import { useTranslation } from "react-i18next";
import { Github, Linkedin } from "lucide-react";
import styles from "./Footer.module.scss";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer} role="contentinfo">

       <span className={styles.copy}>
        © {new Date().getFullYear()} Carole Rotton
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