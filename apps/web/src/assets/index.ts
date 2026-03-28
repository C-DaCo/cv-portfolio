const photo = "/photo.webp";
const photo320 = "/photo-320.webp";
const photo480 = "/photo-480.webp";
import maskott from "./experiences/maskott.webp";
import ktmAdvance from "./experiences/ktm-advance.webp";
import hippocad from "./experiences/hippocad.webp";
import logoDawan from "./education/logo_dawan.png";
import logoIfocop from "./education/logo_ifocop.png";
import logoOcr from "./education/logo_ocr.png";

export const assets = {
  photo,
  photo320,
  photo480,
  experiences: { maskott, ktmAdvance, hippocad },
  education: { logoDawan, logoIfocop, logoOcr },
};

/** Dimensions intrinsèques — utilisées comme width/height sur les <img> pour éviter le CLS */
export const assetMeta = {
  experiences: {
    maskott:    { w: 494, h: 102 },
    ktmAdvance: { w: 318, h: 158 },
    hippocad:   { w: 200, h: 56  },
  },
  education: {
    logoDawan:  { w: 418, h: 120 },
    logoIfocop: { w: 290, h: 138 },
    logoOcr:    { w: 192, h: 73  },
  },
};