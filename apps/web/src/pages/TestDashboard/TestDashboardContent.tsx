import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Shield } from "lucide-react";
import { parseDesc } from "@tests/test-categories";
import styles from "./TestDashboard.module.scss";

// ── Types Lighthouse ──────────────────────────

export interface LighthouseScores {
  date: string;
  scores: {
    performance:   number;
    accessibility: number;
    bestPractices: number;
    seo:           number;
  };
}

const LH_THRESHOLDS: Record<keyof LighthouseScores["scores"], number> = {
  performance:   90,
  accessibility: 95,
  bestPractices: 90,
  seo:           90,
};

const LH_LABELS: Record<keyof LighthouseScores["scores"], string> = {
  performance:   "Performance",
  accessibility: "Accessibilité",
  bestPractices: "Best Practices",
  seo:           "SEO",
};

function getLhColor(score: number, threshold: number): string {
  if (score >= threshold)       return "high";
  if (score >= threshold - 10)  return "mid";
  return "low";
}

function LighthouseSection({ data }: { data: LighthouseScores }) {
  const keys = Object.keys(LH_THRESHOLDS) as (keyof LighthouseScores["scores"])[];
  const allPass = keys.every(k => data.scores[k] >= LH_THRESHOLDS[k]);

  return (
    <section className={styles.section} aria-labelledby="lh-title">
      <h2 id="lh-title" className={styles.sectionTitle}>
        Audit Lighthouse
        <span className={styles.sectionCount}>{data.date}</span>
        <span className={`${styles.lhBadge} ${allPass ? styles.badgePass : styles.badgeFail}`}>
          {allPass ? "✓ Tous les seuils" : "✗ Seuil non atteint"}
        </span>
      </h2>
      <div className={styles.lhGrid}>
        {keys.map((key) => {
          const score = data.scores[key];
          const threshold = LH_THRESHOLDS[key];
          const color = getLhColor(score, threshold);
          return (
            <div key={key} className={styles.lhCard}>
              <span className={`${styles.lhScore} ${styles[color]}`}>{score}</span>
              <span className={styles.lhLabel}>{LH_LABELS[key]}</span>
              <div
                className={styles.progressBar}
                role="progressbar"
                aria-valuenow={score}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${LH_LABELS[key]} : ${score}/100`}
              >
                <div
                  className={`${styles.progressFill} ${styles[color]}`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className={styles.lhThreshold}>seuil {threshold}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Types Playwright ──────────────────────────

interface PlaywrightTestRun {
  projectName: string;
  status: "passed" | "failed" | "skipped" | "timedOut";
  duration: number;
}

interface PlaywrightSpec {
  title: string;
  ok: boolean;
  tests: PlaywrightTestRun[];
}

interface PlaywrightSuite {
  title: string;
  file?: string;
  suites?: PlaywrightSuite[];
  specs?: PlaywrightSpec[];
}

export interface PlaywrightResults {
  suites: PlaywrightSuite[];
  stats: {
    startTime: string;
    duration: number;
    expected: number;
    unexpected: number;
    skipped: number;
  };
}

// ── Types Vitest ───────────────────────────────

export interface AssertionResult {
  title: string;
  fullName: string;
  status: "passed" | "failed";
  duration: number;
  failureMessages: string[];
  ancestorTitles: string[];
}

export interface TestSuite {
  name: string;
  status: "passed" | "failed";
  assertionResults: AssertionResult[];
  startTime: number;
  endTime: number;
}

export interface TestResults {
  numTotalTests: number;
  numPassedTests: number;
  numFailedTests: number;
  numTotalTestSuites: number;
  numPassedTestSuites: number;
  numFailedTestSuites: number;
  startTime: number;
  success: boolean;
  testResults: TestSuite[];
}

export interface CoverageEntry {
  lines: { pct: number; total: number; covered: number };
  functions: { pct: number; total: number; covered: number };
  statements: { pct: number; total: number; covered: number };
  branches: { pct: number; total: number; covered: number };
}

export interface CoverageSummary {
  total: CoverageEntry;
  [key: string]: CoverageEntry;
}

// ── Helpers ───────────────────────────────────

export function getFileName(fullPath: string): string {
  return fullPath
    .replace(/\\/g, "/")
    .replace(/.*\/src\//, "src/")
    .replace(".tsx", "")
    .replace(".ts", "");
}

export function getSuiteName(fullPath: string): string {
  return fullPath
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    ?.replace(".test.tsx", "")
    .replace(".test.ts", "") ?? fullPath;
}

export function getCoverageColor(pct: number): string {
  if (pct >= 80) return "high";
  if (pct >= 50) return "mid";
  return "low";
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

// ── Types pour le parsing catégories ──────────

type TestColumn = "rendu" | "a11y" | "other";

const SCOPE_LABELS: Record<string, string> = {
  ui:      "Composants UI",
  section: "Sections",
  hook:    "Hooks",
  page:    "Pages",
};

interface ParsedDescribe {
  scope: string;
  name: string;
  column: TestColumn;
  tests: AssertionResult[];
  passed: number;
  total: number;
}

interface ScopeGroup {
  scope: string;
  describes: ParsedDescribe[];
}

// ── Parsing E2E ───────────────────────────────

interface E2EFile {
  name: string;
  specs: { title: string; ok: boolean; browsers: string[] }[];
  passed: number;
  total: number;
}

function collectSpecs(suite: PlaywrightSuite): PlaywrightSpec[] {
  const specs: PlaywrightSpec[] = [...(suite.specs ?? [])];
  for (const child of suite.suites ?? []) {
    specs.push(...collectSpecs(child));
  }
  return specs;
}

function parseE2EResults(results: PlaywrightResults): E2EFile[] {
  return results.suites.map((fileSuite) => {
    const specs = collectSpecs(fileSuite);
    return {
      name: fileSuite.title.replace(/^e2e\//, ""),
      specs: specs.map((s) => ({
        title: s.title,
        ok: s.ok,
        browsers: [...new Set(s.tests.map((t) => t.projectName))],
      })),
      passed: specs.filter((s) => s.ok).length,
      total: specs.length,
    };
  });
}

// ── Section E2E ───────────────────────────────

function E2ESection({ results }: { results: PlaywrightResults }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const files = parseE2EResults(results);
  const totalSpecs = files.reduce((s, f) => s + f.total, 0);
  const passedSpecs = files.reduce((s, f) => s + f.passed, 0);
  const browsers = [...new Set(
    results.suites.flatMap((s) => collectSpecs(s)).flatMap((s) => s.tests.map((t) => t.projectName))
  )];
  const allPassed = results.stats.unexpected === 0;

  return (
    <section className={styles.testColumnsSection} aria-labelledby="e2e-title">
      <h2 id="e2e-title" className={styles.sectionTitle}>
        Tests E2E — Playwright
        <span className={styles.sectionCount}>{browsers.join(" · ")}</span>
      </h2>

      <div className={`${styles.columnHeader} ${styles.colAccentA11y}`} style={{ marginBottom: "0.75rem", borderRadius: "6px" }}>
        <span className={styles.columnIcon}><Shield size={16} strokeWidth={1.5} /></span>
        <span className={styles.columnLabel}>
          {files.length} fichiers · {totalSpecs} scénarios
        </span>
        <span className={styles.columnScore}>{passedSpecs}/{totalSpecs}</span>
        <span className={`${styles.columnBadge} ${allPassed ? styles.badgePass : styles.badgeFail}`}>
          {allPassed ? "✓ OK" : "✗ Échec"}
        </span>
      </div>

      <div className={styles.suitesList}>
        {files.map((file) => {
          const isExpanded = expanded === file.name;
          const allOk = file.passed === file.total;
          return (
            <div key={file.name} className={styles.suiteCard}>
              <button
                className={styles.suiteHeader}
                onClick={() => setExpanded(isExpanded ? null : file.name)}
                aria-expanded={isExpanded}
              >
                <span className={styles.suiteStatus}>
                  {allOk
                    ? <CheckCircle size={14} strokeWidth={2} className={styles.iconPass} />
                    : <XCircle size={14} strokeWidth={2} className={styles.iconFail} />
                  }
                </span>
                <span className={styles.suiteName}>{file.name}</span>
                <span className={styles.suiteCount}>{file.passed}/{file.total}</span>
                <span className={styles.suiteChevron} aria-hidden="true">{isExpanded ? "▴" : "▾"}</span>
              </button>
              {isExpanded && (
                <ul className={styles.testList} role="list">
                  {file.specs.map((spec, i) => (
                    <li key={i} className={`${styles.testItem} ${!spec.ok ? styles.testFailed : ""}`}>
                      <span className={styles.testIcon} aria-hidden="true">{spec.ok ? "✓" : "✗"}</span>
                      <span className={styles.testTitle}>{spec.title}</span>
                      <span className={styles.testDuration}>{spec.browsers.join(" · ")}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Parsing des résultats Vitest ───────────────

function parseResults(testResults: TestSuite[]): {
  rendu: ScopeGroup[];
  a11y: ScopeGroup[];
  other: ScopeGroup[];
  renduTotal: number;
  renduPassed: number;
  a11yTotal: number;
  a11yPassed: number;
} {
  const map: Record<TestColumn, Record<string, Record<string, ParsedDescribe>>> = {
    rendu: {},
    a11y: {},
    other: {},
  };

  for (const suite of testResults) {
    // Grouper les tests par describe (ancestorTitles[0])
    const byDescribe: Record<string, AssertionResult[]> = {};
    for (const test of suite.assertionResults) {
      const descName = test.ancestorTitles[0] ?? "unknown";
      if (!byDescribe[descName]) byDescribe[descName] = [];
      byDescribe[descName].push(test);
    }

    for (const [descName, tests] of Object.entries(byDescribe)) {
      const parsed = parseDesc(descName);
      const scope = parsed?.scope ?? "other";
      const name = parsed?.name ?? getSuiteName(suite.name);
      const typeStr = parsed?.type ?? "";

      const column: TestColumn =
        typeStr === "a11y" ? "a11y" :
        typeStr === "rendu" || typeStr === "interactions" ? "rendu" :
        "other";

      if (!map[column][scope]) map[column][scope] = {};

      if (!map[column][scope][name]) {
        map[column][scope][name] = {
          scope, name, column,
          tests: [],
          passed: 0,
          total: 0,
        };
      }

      map[column][scope][name].tests.push(...tests);
      map[column][scope][name].passed += tests.filter(t => t.status === "passed").length;
      map[column][scope][name].total += tests.length;
    }
  }

  function toScopeGroups(col: TestColumn): ScopeGroup[] {
    return Object.entries(map[col]).map(([scope, names]) => ({
      scope,
      describes: Object.values(names),
    }));
  }

  const renduGroups = toScopeGroups("rendu");
  const a11yGroups = toScopeGroups("a11y");
  const otherGroups = toScopeGroups("other");

  const renduTotal  = renduGroups.flatMap(g => g.describes).reduce((s, d) => s + d.total, 0);
  const renduPassed = renduGroups.flatMap(g => g.describes).reduce((s, d) => s + d.passed, 0);
  const a11yTotal   = a11yGroups.flatMap(g => g.describes).reduce((s, d) => s + d.total, 0);
  const a11yPassed  = a11yGroups.flatMap(g => g.describes).reduce((s, d) => s + d.passed, 0);

  return {
    rendu: renduGroups,
    a11y: a11yGroups,
    other: otherGroups,
    renduTotal, renduPassed,
    a11yTotal, a11yPassed,
  };
}

// ── Sous-composant : colonne de tests ─────────

interface TestColumnPanelProps {
  label: string;
  icon: React.ReactNode;
  total: number;
  passed: number;
  groups: ScopeGroup[];
  accentClass: string;
}

function TestColumnPanel({ label, icon, total, passed, groups, accentClass }: TestColumnPanelProps) {
  const [expandedDescribe, setExpandedDescribe] = useState<string | null>(null);
  const [expandedScopes, setExpandedScopes] = useState<Set<string>>(new Set());
  const allPassed = passed === total;

  const toggleScope = (scope: string) =>
    setExpandedScopes(prev => {
      const next = new Set(prev);
      next.has(scope) ? next.delete(scope) : next.add(scope);
      return next;
    });

  return (
    <div className={styles.testColumn}>
      {/* En-tête colonne */}
      <div className={`${styles.columnHeader} ${accentClass}`}>
        <span className={styles.columnIcon}>{icon}</span>
        <span className={styles.columnLabel}>{label}</span>
        <span className={styles.columnScore}>
          {passed}/{total}
        </span>
        <span className={`${styles.columnBadge} ${allPassed ? styles.badgePass : styles.badgeFail}`}>
          {allPassed ? "✓ OK" : "✗ Échec"}
        </span>
      </div>

      {/* Groupes par scope */}
      <div className={styles.columnBody}>
        {groups.map(({ scope, describes }) => {
          const isOpen = expandedScopes.has(scope);
          const scopePassed = describes.reduce((s, d) => s + d.passed, 0);
          const scopeTotal  = describes.reduce((s, d) => s + d.total, 0);
          return (
          <div key={scope} className={styles.scopeGroup}>
            <button
              className={styles.scopeLabel}
              onClick={() => toggleScope(scope)}
              aria-expanded={isOpen}
            >
              <span>{SCOPE_LABELS[scope] ?? scope}</span>
              <span className={styles.scopeMeta}>{scopePassed}/{scopeTotal}</span>
              <span className={styles.suiteChevron} aria-hidden="true">{isOpen ? "▴" : "▾"}</span>
            </button>
            {isOpen && describes.map((d) => {
              const key = `${d.column}-${d.scope}-${d.name}`;
              const isExpanded = expandedDescribe === key;
              const allOk = d.passed === d.total;

              return (
                <div key={key} className={styles.describeRow}>
                  <button
                    className={styles.describeBtn}
                    onClick={() => setExpandedDescribe(isExpanded ? null : key)}
                    aria-expanded={isExpanded}
                    aria-label={d.name}
                  >
                    <span className={allOk ? styles.iconPass : styles.iconFail}>
                      {allOk
                        ? <CheckCircle size={12} strokeWidth={2} />
                        : <XCircle size={12} strokeWidth={2} />
                      }
                    </span>
                    <span className={styles.describeName}>{d.name}</span>
                    <span className={styles.describeScore}>{d.passed}/{d.total}</span>
                    <span className={styles.suiteChevron} aria-hidden="true">
                      {isExpanded ? "▴" : "▾"}
                    </span>
                  </button>

                  {isExpanded && (
                    <ul className={styles.testList} role="list">
                      {d.tests.map((test, i) => (
                        <li
                          key={i}
                          className={`${styles.testItem} ${test.status === "failed" ? styles.testFailed : ""}`}
                        >
                          <span className={styles.testIcon} aria-hidden="true">
                            {test.status === "passed" ? "✓" : "✗"}
                          </span>
                          <span className={styles.testTitle}>{test.title}</span>
                          <span className={styles.testDuration}>{formatDuration(test.duration)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Composant principal ───────────────────────

export function TestDashboardContent() {
  const [tests, setTests] = useState<TestResults | null>(null);
  const [coverage, setCoverage] = useState<CoverageSummary | null>(null);
  const [e2e, setE2e] = useState<PlaywrightResults | null>(null);
  const [lh, setLh] = useState<LighthouseScores | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSuite, setExpandedSuite] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/test-results.json").then(r => r.ok ? r.json() : null).catch(() => null),
      fetch("/coverage/coverage-summary.json").then(r => r.ok ? r.json() : null).catch(() => null),
      fetch("/e2e-results.json").then(r => r.ok ? r.json() : null).catch(() => null),
      fetch("/lighthouse-scores.json").then(r => r.ok ? r.json() : null).catch(() => null),
    ])
      .then(([t, c, e, l]) => {
        setTests(t);
        setCoverage(c);
        setE2e(e);
        setLh(l);
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger les résultats de tests.");
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.spinner} aria-label="Chargement..." />
    </div>
  );

  if (error || !tests) return (
    <div className={styles.error}>
      <p>{error ?? "Données indisponibles."}</p>
    </div>
  );

  const totalDuration = tests.testResults.reduce(
    (acc, s) => acc + (s.endTime - s.startTime), 0
  );

  const coverageFiles = coverage
    ? Object.entries(coverage)
        .filter(([key]) => key !== "total")
        .map(([key, val]) => ({ name: getFileName(key), ...val }))
        .sort((a, b) => a.lines.pct - b.lines.pct)
    : [];

  const { rendu, a11y, other, renduTotal, renduPassed, a11yTotal, a11yPassed } =
    parseResults(tests.testResults);

  return (
    <div className={styles.content}>

      {/* ── Stats globales ── */}
      <section className={styles.statsGrid} aria-label="Résumé des tests">
        <div className={styles.statCard}>
          <CheckCircle size={20} strokeWidth={1.5} className={styles.iconPass} />
          <span className={styles.statNum}>{tests.numPassedTests}</span>
          <span className={styles.statLabel}>Tests passés</span>
        </div>
        <div className={styles.statCard}>
          <XCircle size={20} strokeWidth={1.5} className={styles.iconFail} />
          <span className={styles.statNum}>{tests.numFailedTests}</span>
          <span className={styles.statLabel}>Tests échoués</span>
        </div>
        {coverage && (
          <div className={styles.statCard}>
            <Shield size={20} strokeWidth={1.5} className={styles.iconCoverage} />
            <span className={styles.statNum}>{coverage.total.lines.pct.toFixed(0)}%</span>
            <span className={styles.statLabel}>Couverture lignes</span>
          </div>
        )}
        <div className={styles.statCard}>
          <Clock size={20} strokeWidth={1.5} className={styles.iconTime} />
          <span className={styles.statNum}>{formatDuration(totalDuration)}</span>
          <span className={styles.statLabel}>Durée totale</span>
        </div>
      </section>

      {/* ── Colonnes Rendu / A11y ── */}
      <section className={styles.testColumnsSection} aria-labelledby="test-cols-title">
        <h2 id="test-cols-title" className={styles.sectionTitle}>
          Suites de tests
          <span className={styles.sectionCount}>{tests.numTotalTestSuites} fichiers</span>
        </h2>
        <div className={styles.testColumns}>
          <TestColumnPanel
            label="Rendu & Interactions"
            icon={<CheckCircle size={16} strokeWidth={1.5} />}
            total={renduTotal}
            passed={renduPassed}
            groups={rendu}
            accentClass={styles.colAccentRendu}
          />
          <TestColumnPanel
            label="Accessibilité"
            icon={<Shield size={16} strokeWidth={1.5} />}
            total={a11yTotal}
            passed={a11yPassed}
            groups={a11y}
            accentClass={styles.colAccentA11y}
          />
        </div>

        {/* Tests non catégorisés */}
        {other.length > 0 && (
          <div className={styles.otherSuites}>
            <p className={styles.scopeLabel}>Non catégorisés</p>
            <div className={styles.suitesList}>
              {tests.testResults
                .filter(suite =>
                  suite.assertionResults.some(t => !parseDesc(t.ancestorTitles[0] ?? ""))
                )
                .map((suite) => {
                  const name = getSuiteName(suite.name);
                  const isExpanded = expandedSuite === suite.name;
                  const duration = suite.endTime - suite.startTime;

                  return (
                    <div
                      key={suite.name}
                      className={`${styles.suiteCard} ${suite.status === "failed" ? styles.suiteFailed : ""}`}
                    >
                      <button
                        className={styles.suiteHeader}
                        onClick={() => setExpandedSuite(isExpanded ? null : suite.name)}
                        aria-expanded={isExpanded}
                      >
                        <span className={styles.suiteStatus}>
                          {suite.status === "passed"
                            ? <CheckCircle size={14} strokeWidth={2} className={styles.iconPass} />
                            : <XCircle size={14} strokeWidth={2} className={styles.iconFail} />
                          }
                        </span>
                        <span className={styles.suiteName}>{name}</span>
                        <span className={styles.suiteCount}>
                          {suite.assertionResults.filter(a => a.status === "passed").length}
                          /{suite.assertionResults.length}
                        </span>
                        <span className={styles.suiteDuration}>{formatDuration(duration)}</span>
                        <span className={styles.suiteChevron} aria-hidden="true">
                          {isExpanded ? "▴" : "▾"}
                        </span>
                      </button>

                      {isExpanded && (
                        <ul className={styles.testList} role="list">
                          {suite.assertionResults.map((test, i) => (
                            <li
                              key={i}
                              className={`${styles.testItem} ${test.status === "failed" ? styles.testFailed : ""}`}
                            >
                              <span className={styles.testIcon} aria-hidden="true">
                                {test.status === "passed" ? "✓" : "✗"}
                              </span>
                              <span className={styles.testTitle}>{test.title}</span>
                              <span className={styles.testDuration}>{formatDuration(test.duration)}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </section>

      {/* ── Tests E2E ── */}
      {e2e && <E2ESection results={e2e} />}

      {/* ── Audit Lighthouse ── */}
      {lh && <LighthouseSection data={lh} />}

      {/* ── Couverture globale ── */}
      {coverage && (
      <section className={styles.section} aria-labelledby="coverage-title-inline">
        <h2 id="coverage-title-inline" className={styles.sectionTitle}>Couverture de code</h2>
        <div className={styles.coverageGrid}>
          {(["lines", "statements", "functions", "branches"] as const).map((metric) => (
            <div key={metric} className={styles.coverageCard}>
              <div className={styles.coverageHeader}>
                <span className={styles.coverageMetric}>{metric}</span>
                <span className={`${styles.coveragePct} ${styles[getCoverageColor(coverage.total[metric].pct)]}`}>
                  {coverage.total[metric].pct.toFixed(1)}%
                </span>
              </div>
              <div className={styles.progressBar}
                role="progressbar"
                aria-valuenow={coverage.total[metric].pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Couverture ${metric} : ${coverage.total[metric].pct.toFixed(1)}%`}
              >
                <div
                  className={`${styles.progressFill} ${styles[getCoverageColor(coverage.total[metric].pct)]}`}
                  style={{ width: `${coverage.total[metric].pct}%` }}
                />
              </div>
              <span className={styles.coverageDetail}>
                {coverage.total[metric].covered} / {coverage.total[metric].total}
              </span>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* ── Couverture par fichier ── */}
      {coverage && coverageFiles.length > 0 && (
      <section className={styles.section} aria-labelledby="files-title-inline">
        <h2 id="files-title-inline" className={styles.sectionTitle}>
          Couverture par fichier
          <span className={styles.sectionCount}>{coverageFiles.length} fichiers</span>
        </h2>
        <div className={styles.filesTable}>
          <div className={styles.filesHeader}>
            <span>Fichier</span>
            <span>Lignes</span>
            <span>Fonctions</span>
            <span>Branches</span>
          </div>
          {coverageFiles.map((file) => (
            <div key={file.name} className={styles.fileRow}>
              <span className={styles.fileName}>{file.name}</span>
              <span className={`${styles.filePct} ${styles[getCoverageColor(file.lines.pct)]}`}>
                {file.lines.pct.toFixed(0)}%
              </span>
              <span className={`${styles.filePct} ${styles[getCoverageColor(file.functions.pct)]}`}>
                {file.functions.pct.toFixed(0)}%
              </span>
              <span className={`${styles.filePct} ${styles[getCoverageColor(file.branches.pct)]}`}>
                {file.branches.pct.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </section>
      )}

      <p className={styles.footer}>
        Vitest {tests.numTotalTests} tests
        {e2e && ` · E2E ${e2e.stats.expected} runs Playwright`}
        {lh && ` · Lighthouse ${lh.date}`}
        {" · "}{new Date(tests.startTime).toLocaleDateString("fr-FR")}
      </p>

    </div>
  );
}