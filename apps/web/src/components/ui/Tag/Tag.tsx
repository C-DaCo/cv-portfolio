import styles from "./Tag.module.scss";

export type TagVariant = "coral" | "sage" | "mauve" | "sand";

interface TagProps {
  label: string;
  variant?: TagVariant;
}

/**
 * Composant Tag — pill colorée pour technologies et compétences
 */
export function Tag({ label, variant = "coral" }: TagProps) {
  return (
    <span className={`${styles.tag} ${styles[variant]}`} role="listitem">
      {label}
    </span>
  );
}
