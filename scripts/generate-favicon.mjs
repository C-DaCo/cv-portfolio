/**
 * Génère les icônes avec les proportions exactes du Hero :
 * C = .firstname (PJS 300 uppercase small)
 * R = .lastname  (Cormorant Garamond 300 italic large)
 */

import { chromium } from "../node_modules/playwright/index.mjs";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC    = resolve(__dirname, "../apps/web/public");

const BG      = "#f9f4ec";
const C_COLOR = "#4A3A5E";  // --clr-text-muted light
const R_COLOR = "#991f3e";  // --clr-coral-text light

function makeHtml(size, dx = 0, dy = 0) {
  const rad = Math.round(size * 0.16);
  const rFs = Math.round(size * 1.049);
  const cFs = Math.round(size * 0.557);

  // Positions de base + offset de centrage calculé en 2e passe
  const cLeft = Math.round(size * 0.04)  + dx;
  const cTop  = Math.round(size * 0.30)  + dy;
  const rLeft = Math.round(size * 0.28)  + dx;
  const rTop  = Math.round(size * 0.02)  + dy;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300&family=Plus+Jakarta+Sans:wght@300&display=block" rel="stylesheet"/>
<style>
  * { margin: 0; padding: 0; }
  html, body { width: ${size}px; height: ${size}px; background: transparent; }
  .icon {
    width: ${size}px; height: ${size}px;
    background: ${BG};
    border-radius: ${rad}px;
    position: relative;
    overflow: hidden;
  }
  .c {
    position: absolute;
    left: ${cLeft}px;
    top: ${cTop}px;
    font-family: 'Plus Jakarta Sans', Arial, sans-serif;
    font-size: ${cFs}px;
    font-weight: 300;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: ${C_COLOR};
    line-height: 1;
  }
  .r {
    position: absolute;
    left: ${rLeft}px;
    top: ${rTop}px;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: ${rFs}px;
    font-weight: 300;
    font-style: italic;
    color: ${R_COLOR};
    line-height: 1;
  }
</style>
</head>
<body>
  <div class="icon">
    <span class="c">C</span>
    <span class="r">R</span>
  </div>
</body>
</html>`;
}

async function capture(size, outPath) {
  const browser = await chromium.launch();
  const page    = await browser.newPage();
  await page.setViewportSize({ width: size, height: size });

  // Passe 1 : mesure la bounding box réelle des deux lettres
  await page.setContent(makeHtml(size, 0, 0), { waitUntil: "networkidle" });
  const { dx, dy } = await page.evaluate((s) => {
    const c = document.querySelector(".c").getBoundingClientRect();
    const r = document.querySelector(".r").getBoundingClientRect();
    const left   = Math.min(c.left,   r.left);
    const top    = Math.min(c.top,    r.top);
    const right  = Math.max(c.right,  r.right);
    const bottom = Math.max(c.bottom, r.bottom);
    const cx = (left + right)  / 2;
    const cy = (top  + bottom) / 2;
    return { dx: Math.round(s / 2 - cx), dy: Math.round(s / 2 - cy) };
  }, size);

  // Passe 2 : rendu centré
  await page.setContent(makeHtml(size, dx, dy), { waitUntil: "networkidle" });
  const png = await page.locator(".icon").screenshot({ type: "png" });
  writeFileSync(outPath, png);
  await browser.close();
  console.log(`OK  ${outPath.split("\\").pop()} (${size}px) — offset (${dx}, ${dy})`);
}

await capture(64,  resolve(PUBLIC, "favicon-64.png"));
await capture(180, resolve(PUBLIC, "apple-touch-icon.png"));
await capture(192, resolve(PUBLIC, "icon-192.png"));
await capture(512, resolve(PUBLIC, "icon-512.png"));
console.log("\nOuvre apps/web/public/favicon-64.png et icon-512.png pour vérifier.");
