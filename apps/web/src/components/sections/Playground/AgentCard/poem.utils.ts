// ── Types ─────────────────────────────────────────────────────────────────────

export type Mood = "calm" | "energetic" | "melancholic" | "joyful";
export type Palette = "ocean" | "forest" | "sunset" | "night" | "dawn" | "desert";

export interface PoemData {
  poem: string;
  keywords: string[];
  mood: Mood;
  palette: Palette;
}

export interface IllustrationConfig {
  background: string;
  primary: string;
  secondary: string;
  accent: string;
  shapes: ShapeConfig[];
}

export interface ShapeConfig {
  type: "circle" | "ellipse" | "rect" | "path" | "line" | "polygon";
  props: Record<string, string | number>;
}

// ── Palettes de couleurs ──────────────────────────────────────────────────────

export const PALETTES: Record<Palette, { bg: string; primary: string; secondary: string; accent: string }> = {
  ocean: {
    bg: "var(--clr-bg)",
    primary: "#4A90D9",
    secondary: "#B8D9F0",
    accent: "#1A5F8A",
  },
  forest: {
    bg: "var(--clr-bg)",
    primary: "#4A8C5C",
    secondary: "#A8D5B5",
    accent: "#2D5A3D",
  },
  sunset: {
    bg: "var(--clr-bg)",
    primary: "#E8715A",
    secondary: "#F2C4A0",
    accent: "#C04A2A",
  },
  night: {
    bg: "var(--clr-bg)",
    primary: "#7B6BA8",
    secondary: "#C4BAE0",
    accent: "#3D2F6E",
  },
  dawn: {
    bg: "var(--clr-bg)",
    primary: "#E8A87C",
    secondary: "#F5D5B8",
    accent: "#C47840",
  },
  desert: {
    bg: "var(--clr-bg)",
    primary: "#C4A862",
    secondary: "#E8D5A0",
    accent: "#8A6830",
  },
};

type PaletteColors = { bg: string; primary: string; secondary: string; accent: string };

// ── Générateur de formes selon palette + mood ─────────────────────────────────

export function generateIllustration(palette: Palette, mood: Mood, keywords: string[]): IllustrationConfig {
  const colors = PALETTES[palette];

  const baseShapes = getBaseShapes(palette, colors);
  const moodShapes = getMoodShapes(mood, colors);
  const keywordShapes = getKeywordShapes(keywords, colors);

  return {
    background: colors.bg,
    primary: colors.primary,
    secondary: colors.secondary,
    accent: colors.accent,
    shapes: [...baseShapes, ...moodShapes, ...keywordShapes],
  };
}

// ── Formes de base selon la palette ──────────────────────────────────────────

function getBaseShapes(palette: Palette, colors: PaletteColors): ShapeConfig[] {
  switch (palette) {
    case "ocean":
      return [
        { type: "ellipse", props: { cx: 120, cy: 160, rx: 90, ry: 20, fill: colors.secondary, opacity: 0.4 } },
        { type: "ellipse", props: { cx: 120, cy: 140, rx: 70, ry: 15, fill: colors.primary, opacity: 0.3 } },
        { type: "ellipse", props: { cx: 120, cy: 120, rx: 50, ry: 10, fill: colors.accent, opacity: 0.2 } },
        { type: "circle",  props: { cx: 120, cy: 70,  r: 40, fill: colors.secondary, opacity: 0.6 } },
        { type: "circle",  props: { cx: 120, cy: 70,  r: 25, fill: colors.primary, opacity: 0.8 } },
      ];
    case "forest":
      return [
        { type: "polygon", props: { points: "120,20 160,100 80,100", fill: colors.accent, opacity: 0.9 } },
        { type: "polygon", props: { points: "120,45 155,115 85,115", fill: colors.primary, opacity: 0.8 } },
        { type: "polygon", props: { points: "120,70 150,130 90,130", fill: colors.secondary, opacity: 0.7 } },
        { type: "rect",    props: { x: 112, y: 130, width: 16, height: 40, fill: colors.accent, opacity: 0.9 } },
      ];
    case "sunset":
      return [
        { type: "circle",  props: { cx: 120, cy: 90,  r: 50, fill: colors.secondary, opacity: 0.5 } },
        { type: "circle",  props: { cx: 120, cy: 90,  r: 35, fill: colors.primary,   opacity: 0.8 } },
        { type: "ellipse", props: { cx: 120, cy: 160, rx: 100, ry: 18, fill: colors.accent, opacity: 0.25 } },
        { type: "ellipse", props: { cx: 120, cy: 155, rx: 80,  ry: 12, fill: colors.primary, opacity: 0.2 } },
      ];
    case "night":
      return [
        { type: "circle", props: { cx: 80,  cy: 50,  r: 3,  fill: colors.secondary, opacity: 0.9 } },
        { type: "circle", props: { cx: 150, cy: 30,  r: 2,  fill: colors.secondary, opacity: 0.7 } },
        { type: "circle", props: { cx: 40,  cy: 80,  r: 2,  fill: colors.secondary, opacity: 0.8 } },
        { type: "circle", props: { cx: 160, cy: 80,  r: 1.5,fill: colors.secondary, opacity: 0.6 } },
        { type: "circle", props: { cx: 120, cy: 70,  r: 30, fill: colors.primary,   opacity: 0.3 } },
        { type: "circle", props: { cx: 100, cy: 55,  r: 22, fill: colors.secondary, opacity: 0.7 } },
      ];
    case "dawn":
      return [
        { type: "ellipse", props: { cx: 120, cy: 170, rx: 110, ry: 30, fill: colors.secondary, opacity: 0.3 } },
        { type: "ellipse", props: { cx: 120, cy: 155, rx: 90,  ry: 22, fill: colors.primary,   opacity: 0.25 } },
        { type: "circle",  props: { cx: 120, cy: 100, r: 45,   fill: colors.secondary, opacity: 0.4 } },
        { type: "circle",  props: { cx: 120, cy: 100, r: 28,   fill: colors.primary,   opacity: 0.7 } },
      ];
    case "desert":
      return [
        { type: "path", props: { d: "M20,160 Q60,100 120,110 Q180,120 220,160 Z", fill: colors.secondary, opacity: 0.5 } },
        { type: "path", props: { d: "M0,170 Q50,130 120,140 Q190,150 240,170 Z",  fill: colors.primary,   opacity: 0.4 } },
        { type: "circle", props: { cx: 120, cy: 60, r: 35, fill: colors.accent, opacity: 0.7 } },
      ];
    default:
      return [];
  }
}

// ── Formes selon le mood ──────────────────────────────────────────────────────

function getMoodShapes(mood: Mood, colors: PaletteColors): ShapeConfig[] {
  switch (mood) {
    case "calm":
      return [
        { type: "ellipse", props: { cx: 120, cy: 185, rx: 80, ry: 8, fill: colors.primary, opacity: 0.15 } },
      ];
    case "energetic":
      return [
        { type: "line", props: { x1: 30,  y1: 30,  x2: 50,  y2: 60,  stroke: colors.accent, strokeWidth: 1.5, opacity: 0.4 } },
        { type: "line", props: { x1: 190, y1: 40,  x2: 210, y2: 20,  stroke: colors.accent, strokeWidth: 1.5, opacity: 0.4 } },
        { type: "line", props: { x1: 20,  y1: 140, x2: 40,  y2: 120, stroke: colors.primary, strokeWidth: 1, opacity: 0.3 } },
      ];
    case "melancholic":
      return [
        { type: "line", props: { x1: 40,  y1: 20, x2: 40,  y2: 180, stroke: colors.secondary, strokeWidth: 0.5, opacity: 0.3 } },
        { type: "line", props: { x1: 200, y1: 20, x2: 200, y2: 180, stroke: colors.secondary, strokeWidth: 0.5, opacity: 0.3 } },
      ];
    case "joyful":
      return [
        { type: "circle", props: { cx: 35,  cy: 35,  r: 4, fill: colors.accent,   opacity: 0.5 } },
        { type: "circle", props: { cx: 205, cy: 45,  r: 3, fill: colors.primary,  opacity: 0.4 } },
        { type: "circle", props: { cx: 25,  cy: 150, r: 3, fill: colors.secondary,opacity: 0.4 } },
        { type: "circle", props: { cx: 210, cy: 155, r: 5, fill: colors.accent,   opacity: 0.3 } },
      ];
    default:
      return [];
  }
}

// ── Formes selon les mots-clés ────────────────────────────────────────────────

function getKeywordShapes(keywords: string[], colors: PaletteColors): ShapeConfig[] {
  const shapes: ShapeConfig[] = [];
  const keywordsLower = keywords.map((k) => k.toLowerCase());

  const hasKeyword = (...words: string[]) =>
    words.some((w) => keywordsLower.some((k) => k.includes(w)));

  // Eau / mer / pluie → gouttes
  if (hasKeyword("eau", "mer", "pluie", "vague", "rivière", "lac")) {
    shapes.push(
      { type: "ellipse", props: { cx: 55,  cy: 170, rx: 6, ry: 9, fill: colors.primary, opacity: 0.4 } },
      { type: "ellipse", props: { cx: 185, cy: 165, rx: 5, ry: 8, fill: colors.secondary, opacity: 0.35 } },
    );
  }

  // Vent / air / nuage → courbes légères
  if (hasKeyword("vent", "air", "nuage", "souffle", "brise")) {
    shapes.push(
      { type: "path", props: { d: "M30,90 Q60,70 90,90 Q120,110 150,90", fill: "none", stroke: colors.secondary, strokeWidth: 1, opacity: 0.4 } },
    );
  }

  // Lumière / soleil / étoile → rayons
  if (hasKeyword("lumière", "soleil", "étoile", "rayon", "astre")) {
    shapes.push(
      { type: "line", props: { x1: 120, y1: 30, x2: 120, y2: 10,  stroke: colors.accent, strokeWidth: 1.5, opacity: 0.5 } },
      { type: "line", props: { x1: 148, y1: 42, x2: 162, y2: 28,  stroke: colors.accent, strokeWidth: 1.5, opacity: 0.4 } },
      { type: "line", props: { x1: 92,  y1: 42, x2: 78,  y2: 28,  stroke: colors.accent, strokeWidth: 1.5, opacity: 0.4 } },
    );
  }

  // Montagne / roche / terre → triangle
  if (hasKeyword("montagne", "roche", "pierre", "terre", "sommet")) {
    shapes.push(
      { type: "polygon", props: { points: "30,180 70,120 110,180", fill: colors.secondary, opacity: 0.3 } },
      { type: "polygon", props: { points: "130,180 185,100 240,180", fill: colors.primary, opacity: 0.25 } },
    );
  }

  return shapes;
}