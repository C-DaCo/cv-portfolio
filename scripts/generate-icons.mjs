/**
 * Génère apple-touch-icon.png (180×180) depuis favicon.svg
 * Utilise sharp (déjà installé dans apps/web).
 * Usage : node scripts/generate-icons.mjs
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC    = resolve(__dirname, "../apps/web/public");

// sharp est une dép de apps/web — on le charge depuis là
const require = createRequire(import.meta.url);
const sharp   = require(resolve(__dirname, "../node_modules/sharp"));

const svgBuffer = readFileSync(resolve(PUBLIC, "favicon.svg"));

await sharp(svgBuffer)
  .resize(180, 180)
  .png()
  .toFile(resolve(PUBLIC, "apple-touch-icon.png"));

console.log("✅  apple-touch-icon.png (180×180) généré dans apps/web/public/");
