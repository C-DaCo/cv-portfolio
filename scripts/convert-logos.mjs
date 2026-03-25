import sharp from "sharp";

const base = "apps/web/src/assets/experiences/";

const ktm = await sharp(base + "ktm-advance.png").webp({ lossless: true }).toFile(base + "ktm-advance.webp");
console.log(`ktm-advance.webp: ${ktm.width}x${ktm.height} — ${ktm.size} bytes`);

const hipp = await sharp(base + "hippocad.jpg").webp({ quality: 80 }).toFile(base + "hippocad.webp");
console.log(`hippocad.webp: ${hipp.width}x${hipp.height} — ${hipp.size} bytes`);
