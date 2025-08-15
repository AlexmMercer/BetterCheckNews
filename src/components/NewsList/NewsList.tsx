import { NewsItem } from "../NewsItem/NewsItem";
import styles from "./NewsList.module.css";

export interface NewsListItem {
  id: string;
  title: string;
  url?: string;
  urlToImage?: string | null;
}

export const NewsList = ({ news }: { news: NewsListItem[] }) => {
  if (!news.length) return null;

  return (
    <div className={styles.newsList}>
      {news.map((item) => (
        <NewsItem 
          key={item.id || item.url}
          title={item.title} 
          url={item.url} 
          urlToImage={item.urlToImage} 
          as="h3" 
        />
      ))}
    </div>
  );
};
