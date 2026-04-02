import { CheckCircle, Shield, GitBranch, TestTube } from "lucide-react";
import styles from "./TestDashboard.module.scss";

const COVERAGE = [
  { metric: "lines",      pct: 93.0 },
  { metric: "statements", pct: 91.7 },
  { metric: "functions",  pct: 87.1 },
  { metric: "branches",   pct: 82.3 },
];

const SUITES = [
  {
    label: "Unit · Libs & algorithme",
    icon: <TestTube size={14} strokeWidth={1.5} />,
    items: ["Algorithme SM-2", "Calcul intervalles", "Parsing leçons", "Utilitaires dates"],
    color: styles.colAccentRendu,
  },
  {
    label: "Unit · API Routes",
    icon: <CheckCircle size={14} strokeWidth={1.5} />,
    items: ["POST /api/scan", "GET /api/cards", "POST /api/review", "GET /api/stats"],
    color: styles.colAccentRendu,
  },
  {
    label: "Unit · Composants",
    icon: <CheckCircle size={14} strokeWidth={1.5} />,
    items: ["FlashCard", "ReviewSession", "StatsChart", "ScanModal"],
    color: styles.colAccentRendu,
  },
  {
    label: "E2E · Playwright",
    icon: <Shield size={14} strokeWidth={1.5} />,
    items: ["Auth Clerk (sign-in token bypass)", "A11y WCAG AA (axe-core)", "Navbar & ScanModal", "Pages métier (révision, stats)"],
    color: styles.colAccentA11y,
  },
];

function getCoverageColor(pct: number) {
  if (pct >= 80) return "high";
  if (pct >= 50) return "mid";
  return "low";
}

export function BrainZupTestsStatic() {
  return (
    <div className={styles.content}>

      {/* ── Stats globales ── */}
      <section className={styles.statsGrid} aria-label="Résumé des tests BrainZup">
        <div className={styles.statCard}>
          <CheckCircle size={20} strokeWidth={1.5} className={styles.iconPass} />
          <span className={styles.statNum}>282</span>
          <span className={styles.statLabel}>Tests Jest</span>
        </div>
        <div className={styles.statCard}>
          <Shield size={20} strokeWidth={1.5} className={styles.iconCoverage} />
          <span className={styles.statNum}>91.7%</span>
          <span className={styles.statLabel}>Couverture</span>
        </div>
        <div className={styles.statCard}>
          <GitBranch size={20} strokeWidth={1.5} className={styles.iconTime} />
          <span className={styles.statNum}>29</span>
          <span className={styles.statLabel}>Tests E2E</span>
        </div>
        <div className={styles.statCard}>
          <Shield size={20} strokeWidth={1.5} className={styles.iconCoverage} />
          <span className={styles.statNum}>AA</span>
          <span className={styles.statLabel}>WCAG axe-core</span>
        </div>
      </section>

      {/* ── Couverture ── */}
      <section className={styles.section} aria-labelledby="bb-coverage-title">
        <h2 id="bb-coverage-title" className={styles.sectionTitle}>Couverture de code</h2>
        <div className={styles.coverageGrid}>
          {COVERAGE.map(({ metric, pct }) => (
            <div key={metric} className={styles.coverageCard}>
              <div className={styles.coverageHeader}>
                <span className={styles.coverageMetric}>{metric}</span>
                <span className={`${styles.coveragePct} ${styles[getCoverageColor(pct)]}`}>
                  {pct.toFixed(1)}%
                </span>
              </div>
              <div
                className={styles.progressBar}
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Couverture ${metric} : ${pct}%`}
              >
                <div
                  className={`${styles.progressFill} ${styles[getCoverageColor(pct)]}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Suites ── */}
      <section className={styles.section} aria-labelledby="bb-suites-title">
        <h2 id="bb-suites-title" className={styles.sectionTitle}>
          Suites de tests
          <span className={styles.sectionCount}>4 catégories</span>
        </h2>
        <div className={styles.suitesList}>
          {SUITES.map((suite) => (
            <div key={suite.label} className={styles.suiteCard}>
              <div className={`${styles.columnHeader} ${suite.color}`}>
                <span className={styles.columnIcon}>{suite.icon}</span>
                <span className={styles.columnLabel}>{suite.label}</span>
                <span className={`${styles.columnBadge} ${styles.badgePass}`}>✓ OK</span>
              </div>
              <ul className={styles.testList} role="list">
                {suite.items.map((item) => (
                  <li key={item} className={styles.testItem}>
                    <span className={styles.testIcon} aria-hidden="true">✓</span>
                    <span className={styles.testTitle}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <p className={styles.footer}>
        Jest 91.7% coverage · 29 tests E2E Playwright · WCAG AA validé axe-core
      </p>
    </div>
  );
}
