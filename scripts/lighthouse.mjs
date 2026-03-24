/**
 * Lighthouse CI — compatible Windows
 * Lance vite preview, audite localhost:4173, génère un rapport HTML + JSON.
 * L'erreur EPERM Windows (chrome-launcher cleanup) est ignorée si les fichiers sont produits.
 */

import { spawn }         from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath }  from "url";

const __dirname  = dirname(fileURLToPath(import.meta.url));
const WEB_DIR    = resolve(__dirname, "../apps/web");
const REPORT_BASE = resolve(WEB_DIR, "public/lighthouse");

const THRESHOLDS = {
  performance:      0.9,
  accessibility:    0.95,
  "best-practices": 0.9,
  seo:              0.9,
};

// ── 1. Démarre vite preview ────────────────────
console.log("▶  Démarrage du serveur de preview...");
const server = spawn("node", ["node_modules/vite/bin/vite.js", "preview"], {
  cwd: WEB_DIR,
  stdio: "pipe",
});

let started = false;
server.stdout.on("data", (d) => {
  const out = d.toString();
  if (!started && out.includes("4173")) {
    started = true;
    runAudit();
  }
});
server.stderr.on("data", (d) => {
  const out = d.toString();
  if (!started && out.includes("4173")) {
    started = true;
    runAudit();
  }
});

// Fallback si le pattern n'est pas trouvé
setTimeout(() => { if (!started) { started = true; runAudit(); } }, 5000);

// ── 2. Lance lighthouse CLI ────────────────────
function runAudit() {
  console.log("🔍  Audit Lighthouse en cours...\n");

  const lhBin = resolve(WEB_DIR, "../../node_modules/lighthouse/cli/index.js");
  const args  = [
    lhBin,
    "http://localhost:4173/",
    "--output=html", "--output=json",
    `--output-path=${REPORT_BASE}`,
    "--chrome-flags=--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage",
    "--log-level=error",
    "--quiet",
  ];

  const lh = spawn("node", args, { cwd: WEB_DIR, stdio: "inherit" });

  lh.on("close", (code) => {
    const jsonPath = `${REPORT_BASE}.report.json`;
    const htmlPath = `${REPORT_BASE}.report.html`;

    // EPERM Windows → exit 1 même si les fichiers sont là
    if (code !== 0 && !existsSync(jsonPath)) {
      console.error(`\n❌  Lighthouse a échoué (code ${code}) sans produire de rapport.`);
      server.kill();
      process.exit(1);
    }

    if (existsSync(htmlPath)) {
      console.log(`\n✅  Rapport HTML : apps/web/public/lighthouse.report.html`);
    }

    // ── Scores ────────────────────────────────
    let pass = true;
    try {
      const lhr  = JSON.parse(readFileSync(jsonPath, "utf8"));
      const cats = lhr.categories;
      console.log("\n── Scores Lighthouse ──────────────────────");
      for (const [key, threshold] of Object.entries(THRESHOLDS)) {
        const score = cats[key]?.score ?? 0;
        const pct   = Math.round(score * 100);
        const ok    = score >= threshold;
        if (!ok) pass = false;
        console.log(`  ${ok ? "✅" : "❌"}  ${key.padEnd(16)} ${pct} / ${Math.round(threshold * 100)} requis`);
      }
      console.log("───────────────────────────────────────────\n");

      // ── Résumé JSON pour le TestDashboard ────────
      const scoresPath = resolve(WEB_DIR, "public/lighthouse-scores.json");
      const summary = {
        date: new Date().toISOString().slice(0, 10),
        scores: {
          performance:   Math.round((cats["performance"]?.score   ?? 0) * 100),
          accessibility: Math.round((cats["accessibility"]?.score ?? 0) * 100),
          bestPractices: Math.round((cats["best-practices"]?.score ?? 0) * 100),
          seo:           Math.round((cats["seo"]?.score           ?? 0) * 100),
        },
      };
      writeFileSync(scoresPath, JSON.stringify(summary, null, 2));
      console.log("✅  lighthouse-scores.json mis à jour\n");
    } catch {
      console.warn("⚠  Impossible de lire le rapport JSON.");
    }

    server.kill();
    process.exit(pass ? 0 : 1);
  });
}
