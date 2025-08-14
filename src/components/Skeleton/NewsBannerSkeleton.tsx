import styles from './NewsBannerSkeleton.module.css';

export const NewsBannerSkeleton = () => {
  return (
    <div className={styles.skeleton}>
      <div className={styles.imageBlock}></div>
      <div className={styles.titleBlock}>
        <div className={styles.titleLine}></div>
        <div className={styles.titleLine}></div>
        <div className={styles.titleLine}></div>
        <div className={styles.titleLine}></div>
        <div className={styles.titleLine}></div>
      </div>
    </div>
  );
};
