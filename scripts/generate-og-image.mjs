/**
 * Génère og-image.jpg (1200×630) pour Open Graph / Twitter Card.
 * Usage : node scripts/generate-og-image.mjs
 */

import { resolve, dirname } from "path";
import { fileURLToPath }    from "url";
import { createRequire }    from "module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC    = resolve(__dirname, "../apps/web/public");
const require   = createRequire(import.meta.url);
const sharp     = require(resolve(__dirname, "../node_modules/sharp"));

// ── Générer le SVG ────────────────────────────────────────────────────────

const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="0%" cy="100%" r="60%">
      <stop offset="0%"   stop-color="#FF4B6E" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#FF4B6E" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Fond -->
  <rect width="1200" height="630" fill="#0D0D0D"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- Bande coral gauche -->
  <rect x="0" y="0" width="6" height="630" fill="#FF4B6E"/>

  <!-- Monogramme {CR} — accolades DM Mono, lettres Georgia -->
  <text font-size="56" dominant-baseline="auto">
    <tspan x="100"  y="135" font-family="Arial,sans-serif" fill="#FF4B6E">{</tspan>
    <tspan dx="0"   y="140" font-family="Georgia,serif" font-style="italic" fill="white">C</tspan>
    <tspan dx="0"   y="140" font-family="Georgia,serif" font-style="italic" fill="#FFB0C0">R</tspan>
    <tspan dx="0"   y="135" font-family="Arial,sans-serif" fill="#FF4B6E">}</tspan>
  </text>

  <!-- Nom -->
  <text x="100" y="316"
        font-family="Arial,sans-serif" font-size="88" font-weight="700"
        fill="white">Carole Rotton</text>

  <!-- Titre -->
  <text x="100" y="396"
        font-family="Arial,sans-serif" font-size="38"
        fill="#a5a5a5">Développeuse Front-End</text>

  <!-- Badges tech (style Hero decoTag) -->
  <!-- React — sage vert -->
  <rect x="100" y="444" width="116" height="34" rx="17"
        fill="rgba(123, 158, 135, 0.1)" stroke="#5DDFD0" stroke-width="1.5"/>
  <text x="158" y="461" text-anchor="middle" dominant-baseline="middle"
        font-family="Arial,sans-serif" font-size="17" fill="#00C2A8">React</text>

  <!-- TypeScript — mauve violet -->
  <rect x="228" y="444" width="170" height="34" rx="17"
        fill="rgba(155, 126, 168, 0.1)" stroke="#C9B3D4" stroke-width="1.5"/>
  <text x="313" y="461" text-anchor="middle" dominant-baseline="middle"
        font-family="Arial,sans-serif" font-size="17" fill="#B97FFF">TypeScript</text>

  <!-- Node.js — coral -->
  <rect x="410" y="444" width="132" height="34" rx="17"
        fill="rgba(196, 168, 130, 0.1)" stroke="#D9C4A8" stroke-width="1.5"/>
  <text x="476" y="461" text-anchor="middle" dominant-baseline="middle"
        font-family="Arial,sans-serif" font-size="17" fill="#FFB703">Node.js</text>

  <!-- Séparateur -->
  <rect x="100" y="524" width="1000" height="1" fill="#2A2A2A"/>

  <!-- Disponibilité — texte simple sage -->
  <text x="100" y="566"
        font-family="Arial,sans-serif" font-size="21"
        fill="#00C2A8">full remote · disponible</text>

  <!-- URL -->
  <text x="1100" y="566"
        font-family="Arial,sans-serif" font-size="22"
        fill="#888888" text-anchor="end">carolerotton.dev</text>

</svg>`;

// ── 3. Rendu ──────────────────────────────────────────────────────────────

await sharp(Buffer.from(svg))
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(resolve(PUBLIC, "og-image.jpg"));

console.log("✅  og-image.jpg (1200×630) généré dans apps/web/public/");
