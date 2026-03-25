/**
 * Usage: node scripts/update-lighthouse-scores.mjs <path-to-lighthouse-report.json>
 *
 * Parses an exported Lighthouse JSON report and writes apps/web/public/lighthouse-scores.json.
 * Export from Chrome DevTools > Lighthouse > Export > JSON.
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const reportPath = process.argv[2];
if (!reportPath) {
  console.error("Usage: node scripts/update-lighthouse-scores.mjs <report.json>");
  process.exit(1);
}

let lhr;
try {
  lhr = JSON.parse(readFileSync(resolve(process.cwd(), reportPath), "utf8"));
} catch {
  console.error(`Cannot read ${reportPath}`);
  process.exit(1);
}

const cats = lhr.categories;
const summary = {
  date: (lhr.fetchTime ?? new Date().toISOString()).slice(0, 10),
  scores: {
    performance:   Math.round((cats["performance"]?.score   ?? 0) * 100),
    accessibility: Math.round((cats["accessibility"]?.score ?? 0) * 100),
    bestPractices: Math.round((cats["best-practices"]?.score ?? 0) * 100),
    seo:           Math.round((cats["seo"]?.score           ?? 0) * 100),
  },
};

const outPath = resolve(__dirname, "../apps/web/public/lighthouse-scores.json");
writeFileSync(outPath, JSON.stringify(summary, null, 2));

console.log("Scores updated:");
for (const [k, v] of Object.entries(summary.scores)) {
  console.log(`  ${k}: ${v}`);
}
console.log(`Date: ${summary.date}`);
