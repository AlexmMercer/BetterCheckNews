import { useEffect, useState } from "react";
import { getNews } from "../../../api/apiNews";
import { NewsList, type NewsListItem } from "../../NewsList/NewsList";
import { NewsBanner } from "../../NewsBanner/NewsBanner";
import { NewsGrid } from "../../NewsGrid/NewsGrid";
import { NewsBannerSkeleton, NewsListSkeleton, NewsGridSkeleton } from "../../Skeleton";
import { Pagination } from "../../Pagination/Pagination";
import styles from "./Main.module.css";

export const MainPage = () => {
  const [items, setItems] = useState<NewsListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    console.log('Loading page:', currentPage);
    (async () => {
      try {
        setLoading(true);
        const raw = await getNews({ 
          page: currentPage, 
          page_size: 9 // баннер(1) + список(2) + грид(6) = 9 новостей на страницу
        });
        console.log('Got news data:', raw);
        
        // нормализуем под NewsList
        const normalized: NewsListItem[] = raw.map((n: any) => ({
          id: n.id || n.url, // NewsAPI может не иметь id
          title: n.title,
          url: n.url,
          urlToImage: n.urlToImage || n.image || null, // NewsAPI использует urlToImage
        }));
        
        // простейшая дедупликация по url, чтобы не было дублей
        const uniq = Array.from(new Map(normalized.map(n => [n.url || n.id, n])).values());
        setItems(uniq);
        
        // Для демонстрации пагинации зададим общее количество страниц
        // В реальном API это должно приходить от сервера
        setTotalPages(10); // Пока зададим 10 страниц для теста
        
      } catch (e: any) {
        setErr(e?.message || "Failed to load news");
      } finally {
        setLoading(false);
      }
    })();
  }, [currentPage]); // ← Важно! Следим за изменением страницы

  if (loading) {
    return (
      <div style={{ padding: "1rem" }}>
        {/* Скелетон верхней секции */}
        <div className={styles.topSection}>
          <NewsBannerSkeleton />
          <NewsListSkeleton count={2} />
        </div>
        
        {/* Скелетон грид секции */}
        <NewsGridSkeleton count={6} />
      </div>
    );
  }
  
  if (err) return <p style={{ color: "crimson" }}>{err}</p>;

  return (
    <main style={{ backgroundColor: "var(--white)" }}>
      {/* Верхняя секция: баннер + первые 2 новости */}
      <section className={styles.topSection}>
        {items.length > 0 && (
          <NewsBanner 
            title={items[0]?.title || 'No title'} 
            url={items[0]?.url} 
            urlToImage={items[0]?.urlToImage} 
          />
        )}
        <NewsList news={items.slice(1, 3)} />
      </section>
      
      {/* Нижняя секция: грид с остальными новостями */}
      {items.length > 3 && (
        <NewsGrid news={items.slice(3)} />
      )}
      
      {/* Пагинация */}
      {totalPages > 1 && (
        <section className={styles.paginationSection}>
          <Pagination
            total={totalPages * 9} // общее количество новостей (примерное)
            pageSize={9} // размер страницы
            current={currentPage} // текущая страница из state
            onChange={setCurrentPage} // обновляем state при клике
          />
        </section>
      )}
    </main>
  );
};
