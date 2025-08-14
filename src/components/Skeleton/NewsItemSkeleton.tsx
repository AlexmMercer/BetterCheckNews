import styles from './NewsItemSkeleton.module.css';

export const NewsItemSkeleton = () => {
  return (
    <div className={styles.skeleton}>
      <div className={styles.imageBlock}></div>
      <div className={styles.titleBlock}>
        <div className={styles.titleLine}></div>
        <div className={styles.titleLine}></div>
        <div className={styles.titleLine}></div>
        <div className={styles.titleLine}></div>
      </div>
    </div>
  );
};
