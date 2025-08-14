import React from 'react'
import { useState } from "react";
import styles from './NewsItem.module.css';

export interface NewsItemProps {
  id?: string;                     // не обязателен, ключ берём в списке
  title?: string;
  url?: string;
  urlToImage?: string | null;
  as?: keyof React.JSX.IntrinsicElements; // 'h2' | 'h3' | ...
}

export const NewsItem = ({ title, url, urlToImage, as = "h3" }: NewsItemProps) => {
  const [imgError, setImgError] = useState(false);

  const safeTitle = (title && title.trim()) || "Untitled";
  const hasImage = !!(urlToImage && urlToImage.trim().length > 0 && !imgError);
  const Heading = as as any;

  const body = (
    <div className={styles.newsItem}>
      {hasImage && (
        <div className={styles.imageContainer}>
          <div className={styles.category}>NEWS</div>
          <img
            src={urlToImage!}
            alt={safeTitle}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className={styles.image}
          />
        </div>
      )}
      <div className={styles.content}>
        <Heading className={styles.title}>{safeTitle}</Heading>
      </div>
    </div>
  );

  return url ? (
    <a href={url} target="_blank" rel="noopener noreferrer" className={styles.link}>
      {body}
    </a>
  ) : (
    body
  );
};
