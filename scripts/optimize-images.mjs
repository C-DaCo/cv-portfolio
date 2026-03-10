import sharp from "sharp";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// const assets = resolve(__dirname, "../apps/web/src/assets/projects");

// const images = [
//   { input: "Portfolio-Hero-Light.png", output: "Portfolio-Hero-Light.webp" },
//   { input: "Portfolio-Hero-Dark.png",  output: "Portfolio-Hero-Dark.webp"  },
// ];

// for (const { input, output } of images) {
//   await sharp(resolve(assets, input))
//     .webp({ quality: 82 })
//     .toFile(resolve(assets, output));
//   console.log(`✓ ${output}`);
// }

const portraits = resolve(__dirname, "../apps/web/src/assets");
await sharp(resolve(portraits, "photo.jpg"))
    .resize(800, null, { withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(resolve(portraits, "photo.webp"));
console.log("✓ photo.webp");