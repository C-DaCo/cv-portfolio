import sharp from "sharp";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src    = resolve(__dirname, "../apps/web/src/assets");
const pub    = resolve(__dirname, "../apps/web/public");

// ── Photo portrait ────────────────────────────────────────────────────────────
// Source : src/assets/photo.jpg → génère les variantes public/

await sharp(resolve(src, "photo.jpg"))
  .resize(800, null, { withoutEnlargement: true })
  .webp({ quality: 82 })
  .toFile(resolve(pub, "photo.webp"));
console.log("✓ public/photo.webp (800px, q82)");

await sharp(resolve(src, "photo.jpg"))
  .resize(480, null, { withoutEnlargement: true })
  .webp({ quality: 70 })
  .toFile(resolve(pub, "photo-480.webp"));
console.log("✓ public/photo-480.webp (480px, q70) — 3× DPR mobile");

await sharp(resolve(src, "photo.jpg"))
  .resize(320, null, { withoutEnlargement: true })
  .webp({ quality: 65 })
  .toFile(resolve(pub, "photo-320.webp"));
console.log("✓ public/photo-320.webp (320px, q65) — 2× DPR mobile");

// ── Logo Maskott ──────────────────────────────────────────────────────────────
// Affiché à ~194×40px (desktop) / ~98×20px (mobile) → génère une version compressée

await sharp(resolve(src, "experiences/maskott.webp"))
  .resize(400, null, { withoutEnlargement: true })
  .webp({ quality: 80 })
  .toFile(resolve(src, "experiences/maskott.webp"));
console.log("✓ src/assets/experiences/maskott.webp (400px, q80)");
