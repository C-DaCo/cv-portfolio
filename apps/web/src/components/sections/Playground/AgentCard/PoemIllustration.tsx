import { useMemo } from "react";
import { generateIllustration, type PoemData, type ShapeConfig } from "./poem.utils";
import styles from "./PoemIllustration.module.scss";

// ── Rendu d'une forme SVG ─────────────────────────────────────────────────────

function renderShape(shape: ShapeConfig, index: number) {
  const props = { key: index, ...shape.props };

  switch (shape.type) {
    case "circle":   return <circle {...props} />;
    case "ellipse":  return <ellipse {...props} />;
    case "rect":     return <rect {...props} />;
    case "polygon":  return <polygon {...props} />;
    case "line":     return <line {...props} />;
    case "path":     return <path {...props} />;
    default:         return null;
  }
}

// ── Composant ─────────────────────────────────────────────────────────────────

interface PoemIllustrationProps {
  poemData: PoemData;
}

export function PoemIllustration({ poemData }: PoemIllustrationProps) {
  const { poem, keywords, mood, palette } = poemData;

  const illustration = useMemo(
    () => generateIllustration(palette, mood, keywords),
    [palette, mood, keywords]
  );

  const verses = poem.split("\n").filter(Boolean);

  return (
    <div className={styles.wrapper}>

      {/* ── Poème ── */}
      <div className={styles.poemBlock}>
        <div className={styles.poemMeta}>
          <span className={styles.poemPalette}>{palette}</span>
          <span className={styles.poemMood}>{mood}</span>
        </div>
        <blockquote className={styles.poem} aria-label="Poème généré">
          {verses.map((verse, i) => (
            <p key={i} className={styles.verse}>{verse}</p>
          ))}
        </blockquote>
        <div className={styles.keywords} aria-label="Mots-clés">
          {keywords.map((kw) => (
            <span key={kw} className={styles.keyword}>{kw}</span>
          ))}
        </div>
      </div>

      {/* ── Illustration SVG ── */}
      <div className={styles.illustrationBlock} aria-hidden="true">
        <svg
          viewBox="0 0 240 200"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.svg}
          role="img"
          aria-label={`Illustration abstraite — ${palette}, ambiance ${mood}`}
        >
          {illustration.shapes.map((shape, i) => renderShape(shape, i))}
        </svg>
      </div>

    </div>
  );
}