import { NewsItem } from "../NewsItem/NewsItem";
import styles from './NewsGrid.module.css';

export interface NewsGridItem {
  id: string;
  title: string;
  url?: string;
  urlToImage?: string | null;
}

export const NewsGrid = ({ news }: { news: NewsGridItem[] }) => {
  if (!news.length) return null;

  return (
    <div className={styles.grid}>
      {news.map((item) => (
        <div key={item.id || item.url} className={styles.gridItem}>
          <NewsItem 
            title={item.title} 
            url={item.url} 
            urlToImage={item.urlToImage} 
            as="h3" 
          />
        </div>
      ))}
    </div>
  );
};
