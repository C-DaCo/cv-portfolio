import styles from "./Skeleton.module.scss";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className = "", style }: SkeletonProps) {
  return <div className={`${styles.skeleton} ${className}`} style={style} aria-hidden="true" />;
}

export function SectionSkeleton() {
  return (
    <div className={styles.sectionBlock} aria-hidden="true">
      <Skeleton className={`${styles.bar} ${styles.barShort}`} />
      <Skeleton className={`${styles.bar} ${styles.barMid}`} />
      <Skeleton className={`${styles.bar} ${styles.barLong}`} />
      <Skeleton className={`${styles.bar} ${styles.barMid}`} />
      <Skeleton className={`${styles.bar} ${styles.barShort}`} />
    </div>
  );
}
