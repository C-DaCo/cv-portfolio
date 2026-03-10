import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@hooks/useTheme";
import { ArrowLeft } from "lucide-react";
import { TestDashboardContent } from "./TestDashboardContent";
import styles from "./TestDashboard.module.scss";

export function TestDashboard() {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    document.title = `Tests — Carole Rotton`;
    return () => { document.title = "Carole Rotton"; };
  }, []);

  return (
    <div className={styles.page} data-theme={theme}>

      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link to="/" className={styles.backLink}>
            <ArrowLeft size={16} strokeWidth={1.5} />
            Portfolio
          </Link>
          <div>
            <p className={styles.eyebrow}>✦ Qualité</p>
            <h1 className={styles.title}>
              Tests <em>Dashboard</em>
            </h1>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button onClick={toggleTheme} className={styles.themeBtn}>
            {theme === "dark" ? "☀ Clair" : "⏾ Sombre"}
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <TestDashboardContent />
      </main>

    </div>
  );
}