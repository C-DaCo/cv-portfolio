import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const frontPath = resolve(root, "apps/web/public/test-results.json");
const apiPath   = resolve(root, "apps/web/public/api-test-results.json");
const outPath   = resolve(root, "apps/web/public/test-results.json");

const front = JSON.parse(readFileSync(frontPath, "utf-8"));
const api   = existsSync(apiPath) ? JSON.parse(readFileSync(apiPath, "utf-8")) : null;

if (!api) {
  console.log("⚠ api-test-results.json introuvable, on garde uniquement les tests front.");
  process.exit(0);
}

// Préfixe les noms de suites API pour les distinguer dans le dashboard
const apiSuites = api.testResults.map((suite) => ({
  ...suite,
  name: "[API] " + suite.name
    .replace(/.*[/\\]apps[/\\]api[/\\]src[/\\]routes[/\\]/, "")
    .replace(/\.test\.ts$/, ""),
}));

const merged = {
  ...front,
  numTotalTests:       front.numTotalTests + api.numTotalTests,
  numPassedTests:      front.numPassedTests + api.numPassedTests,
  numFailedTests:      front.numFailedTests + api.numFailedTests,
  numTotalTestSuites:  front.numTotalTestSuites + api.numTotalTestSuites,
  numPassedTestSuites: front.numPassedTestSuites + api.numPassedTestSuites,
  numFailedTestSuites: front.numFailedTestSuites + api.numFailedTestSuites,
  success:             front.success && api.success,
  testResults:         [...front.testResults, ...apiSuites],
};

writeFileSync(outPath, JSON.stringify(merged, null, 2));
console.log(`✓ Merged: ${merged.numTotalTests} tests (${merged.numPassedTests} passed)`);