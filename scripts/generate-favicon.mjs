/**
 * Génère les icônes app depuis le design du favicon.svg :
 * C = Arial gris, R = Cormorant Garamond italic coral
 * Fond crème #fff4f1, points accent teal + violet
 */

import { chromium } from "../node_modules/playwright/index.mjs";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC    = resolve(__dirname, "../apps/web/public");

const BG      = "#fff4f1";
const C_COLOR = "#7e7e7e";
const R_COLOR = "#FF4B6E";
const DOT1    = "#00C2A8";  // teal accent (top-right)
const DOT2    = "#B97FFF";  // violet accent (bottom-left)

function makeHtml(size, dx = 0, dy = 0) {
  const rad  = Math.round(size * 0.16);   // border-radius arrondi
  const rFs  = Math.round(size * 0.732);  // R : font-size (41/56 du SVG)
  const cFs  = Math.round(size * 0.536);  // C : font-size (30/56 du SVG)

  const dot1R = Math.round(size * 0.054); // rayon point teal  (~3px à 56)
  const dot2R = Math.round(size * 0.036); // rayon point violet (~2px à 56)

  // Positions de base (auto-centrées en passe 2)
  const cLeft = Math.round(size * 0.04)  + dx;
  const cTop  = Math.round(size * 0.10)  + dy;
  const rLeft = Math.round(size * 0.28)  + dx;
  const rTop  = Math.round(size * 0.00)  + dy;

  // Dots fixés aux coins de l'icône (indépendants du centrage)
  const dot1Left = Math.round(size * 0.82);
  const dot1Top  = Math.round(size * 0.14);
  const dot2Left = Math.round(size * 0.16);
  const dot2Top  = Math.round(size * 0.82);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300&display=block" rel="stylesheet"/>
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
    font-family: Arial, sans-serif;
    font-size: ${cFs}px;
    font-weight: 400;
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
  .dot {
    position: absolute;
    border-radius: 50%;
  }
  .dot1 {
    width: ${dot1R * 2}px; height: ${dot1R * 2}px;
    left: ${dot1Left - dot1R}px; top: ${dot1Top - dot1R}px;
    background: ${DOT1};
  }
  .dot2 {
    width: ${dot2R * 2}px; height: ${dot2R * 2}px;
    left: ${dot2Left - dot2R}px; top: ${dot2Top - dot2R}px;
    background: ${DOT2};
  }
</style>
</head>
<body>
  <div class="icon">
    <span class="c">C</span>
    <span class="r">R</span>
    <div class="dot dot1"></div>
    <div class="dot dot2"></div>
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
  console.log(`OK  ${outPath.split(/[\\/]/).pop()} (${size}px) — offset (${dx}, ${dy})`);
}

await capture(180, resolve(PUBLIC, "apple-touch-icon.png"));
await capture(192, resolve(PUBLIC, "icon-192.png"));
await capture(512, resolve(PUBLIC, "icon-512.png"));
console.log("\nVérifier apps/web/public/apple-touch-icon.png et icon-512.png.");
