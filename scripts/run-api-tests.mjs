import { execSync } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const apiDir = resolve(__dirname, "../apps/api");

execSync(
  "npx vitest run --reporter=json --outputFile=../web/public/api-test-results.json",
  { cwd: apiDir, stdio: "inherit" }
);