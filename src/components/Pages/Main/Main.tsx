import { useEffect, useState } from "react";
import { getNews, type NewsApiResponse } from "../../../api/apiNews";
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
  const [paginationInfo, setPaginationInfo] = useState<NewsApiResponse['pagination'] | null>(null);

  useEffect(() => {
    console.log('Loading page:', currentPage);
    (async () => {
      try {
        setLoading(true);
        const response = await getNews({ 
          page: currentPage, 
          page_size: 11 // баннер(1) + список(2) + грид(8) = 11 новостей на страницу
        });
        console.log('Got news data:', response);
        
        // нормализуем под NewsList
        const normalized: NewsListItem[] = response.articles.map((n: any) => ({
          id: n.id || n.url, // NewsAPI может не иметь id
          title: n.title,
          url: n.url,
          urlToImage: n.urlToImage || n.image || null, // NewsAPI использует urlToImage
        }));
        
        // простейшая дедупликация по url, чтобы не было дублей
        const uniq = Array.from(new Map(normalized.map(n => [n.url || n.id, n])).values());
        
        // Проверяем, есть ли новости на текущей странице
        if (uniq.length === 0 && currentPage > 1) {
          // Если нет новостей на текущей странице, переходим на последнюю страницу с новостями
          // Ограничиваем количество страниц до реально доступных
          const maxPageWithNews = Math.ceil((response.pagination?.totalResults || 0) / 11);
          const targetPage = Math.min(currentPage - 1, maxPageWithNews);
          setCurrentPage(Math.max(1, targetPage));
          return;
        }
        
        setItems(uniq);
        setPaginationInfo(response.pagination || null);
        
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
        <NewsGridSkeleton count={8} />
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
      {paginationInfo && paginationInfo.totalPages > 1 && (
        <section className={styles.paginationSection}>
          <Pagination
            total={paginationInfo.totalResults} // реальное общее количество новостей
            pageSize={paginationInfo.pageSize} // размер страницы
            current={currentPage} // текущая страница из state
            onChange={(page) => {
              // Ограничиваем переход только на страницы с новостями
              const maxPage = Math.ceil(paginationInfo.totalResults / paginationInfo.pageSize);
              const targetPage = Math.min(page, maxPage);
              setCurrentPage(Math.max(1, targetPage));
            }}
          />
        </section>
      )}
    </main>
  );
};
