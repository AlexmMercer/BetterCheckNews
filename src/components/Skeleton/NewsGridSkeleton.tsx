import { NewsItemSkeleton } from './NewsItemSkeleton';
import styles from './NewsGridSkeleton.module.css';

interface NewsGridSkeletonProps {
  count?: number;
}

export const NewsGridSkeleton = ({ count = 6 }: NewsGridSkeletonProps) => {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.gridItem}>
          <NewsItemSkeleton />
        </div>
      ))}
    </div>
  );
};
