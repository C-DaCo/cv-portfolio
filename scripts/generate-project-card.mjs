/**
 * Génère portfolio-card.jpg — extrait de code de useTheme.ts
 * avec coloration syntaxique (Tokyo Night).
 * Usage : node scripts/generate-project-card.mjs
 */

import { resolve, dirname } from "path";
import { fileURLToPath }    from "url";
import { createRequire }    from "module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC    = resolve(__dirname, "../apps/web/public");
const require   = createRequire(import.meta.url);
const sharp     = require(resolve(__dirname, "../node_modules/sharp"));

// ── Palette Tokyo Night ───────────────────────────────────────────────────────
const KW   = "#BB9AF7"; // keywords
const STR  = "#9ECE6A"; // strings
const NUM  = "#FF9E64"; // numbers
const CMT  = "#565F89"; // comments
const TYP  = "#2AC3DE"; // types
const FN   = "#7DCFFF"; // function names
const OP   = "#89DDFF"; // operators / ponctuation
const DEF  = "#C0CAF5"; // identifiers par défaut
const PROP = "#73DACA"; // propriétés

// ── Tokenizer simple ──────────────────────────────────────────────────────────

const KEYWORDS  = new Set(["export","type","function","const","let","return","if","new","true","false"]);
const TYPES     = new Set(["Theme","Date"]);
const FUNCTIONS = new Set(["getThemeFromTime","getInitialTheme","setGlobalTheme","useState","useEffect","getHours","addEventListener","matchMedia"]);
const PROPS     = new Set(["window","matches","hour","document"]);

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function tokenize(line) {
  const tokens = [];
  let i = 0;
  while (i < line.length) {
    // Commentaire
    if (line[i] === "/" && line[i + 1] === "/") {
      tokens.push({ text: line.slice(i), color: CMT, italic: true });
      break;
    }
    // Chaîne
    if (line[i] === '"') {
      let j = i + 1;
      while (j < line.length && line[j] !== '"') j++;
      tokens.push({ text: line.slice(i, j + 1), color: STR });
      i = j + 1;
      continue;
    }
    // Nombre
    if (/\d/.test(line[i]) && (i === 0 || !/\w/.test(line[i - 1]))) {
      let j = i;
      while (j < line.length && /\d/.test(line[j])) j++;
      tokens.push({ text: line.slice(i, j), color: NUM });
      i = j;
      continue;
    }
    // Identifiant
    if (/[a-zA-Z_$]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[\w$]/.test(line[j])) j++;
      const word = line.slice(i, j);
      const color =
        KEYWORDS.has(word)  ? KW  :
        TYPES.has(word)     ? TYP :
        FUNCTIONS.has(word) ? FN  :
        PROPS.has(word)     ? PROP : DEF;
      tokens.push({ text: word, color });
      i = j;
      continue;
    }
    // Espace
    if (line[i] === " ") {
      tokens.push({ text: " ", color: DEF });
      i++;
      continue;
    }
    // Opérateurs / ponctuation
    tokens.push({ text: line[i], color: OP });
    i++;
  }
  return tokens;
}

function renderLine(line, x, y) {
  if (line.trim() === "") return "";
  const spans = tokenize(line)
    .map(({ text, color, italic }) =>
      `<tspan fill="${color}"${italic ? ' font-style="italic"' : ""}>${esc(text)}</tspan>`)
    .join("");
  return `<text x="${x}" y="${y}" xml:space="preserve" font-family="Consolas,'Courier New',monospace" font-size="13.5">${spans}</text>`;
}

// ── Code à afficher ───────────────────────────────────────────────────────────

const CODE = [
  `export type Theme = "light" | "dark";`,
  ``,
  `function getThemeFromTime(): Theme {`,
  `  const hour = new Date().getHours();`,
  `  return hour >= 18 || hour < 7 ? "dark" : "light";`,
  `}`,
  ``,
  `// Priorité : OS → heure → toggle manuel`,
  `function getInitialTheme(): Theme {`,
  `  const dark = window.matchMedia?.("(prefers-color-scheme: dark)");`,
  `  if (dark?.matches) return "dark";`,
  `  return getThemeFromTime();`,
  `}`,
  ``,
  `// Suit les préférences OS en temps réel`,
  `window.matchMedia?.("(prefers-color-scheme: dark)")`,
  `  .addEventListener("change", (e) => {`,
  `    if (!isManualGlobal) setGlobalTheme(e.matches ? "dark" : "light");`,
  `  });`,
];

// ── Dimensions 16/9 ──────────────────────────────────────────────────────────
const W          = 900;
const H          = Math.round(W * 9 / 16);          // 506
const CODE_X     = 64;
const NUM_X      = 40;
const HEADER_H   = 46;
const PAD_TOP    = 18;
const PAD_BOT    = 18;
const CODE_Y     = HEADER_H + PAD_TOP + 14;         // baseline première ligne
const LINE_H     = Math.floor((H - CODE_Y - PAD_BOT) / CODE.length);

// ── SVG ───────────────────────────────────────────────────────────────────────

const lineNums = CODE.map((_, i) =>
  `<text x="${NUM_X}" y="${CODE_Y + i * LINE_H}" text-anchor="end"
         font-family="Consolas,'Courier New',monospace" font-size="12"
         fill="#3b3d57">${i + 1}</text>`
).join("\n  ");

const codeLines = CODE.map((line, i) =>
  renderLine(line, CODE_X, CODE_Y + i * LINE_H)
).join("\n  ");

const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">

  <!-- Fond éditeur -->
  <rect width="${W}" height="${H}" fill="#1a1b26"/>

  <!-- Header bar -->
  <rect width="${W}" height="46" fill="#16172a"/>

  <!-- Onglet fichier actif -->
  <rect x="0" y="0" width="158" height="46" fill="#1a1b26"/>
  <rect x="0" y="43" width="158" height="3" fill="#7aa2f7"/>
  <text x="16" y="28" font-family="Consolas,'Courier New',monospace" font-size="13">
    <tspan fill="#7aa2f7">useTheme</tspan><tspan fill="#4a5374">.ts</tspan>
  </text>

  <!-- Numéro de ligne — fond -->
  <rect x="0" y="46" width="48" height="${H - 46}" fill="#16172a"/>

  <!-- Numéros de ligne -->
  ${lineNums}

  <!-- Code -->
  ${codeLines}


</svg>`;

// ── Rendu ─────────────────────────────────────────────────────────────────────

await sharp(Buffer.from(svg))
  .jpeg({ quality: 94, mozjpeg: true })
  .toFile(resolve(PUBLIC, "portfolio-card.jpg"));

console.log(`✅  portfolio-card.jpg (${W}×${H}) généré dans apps/web/public/`);
