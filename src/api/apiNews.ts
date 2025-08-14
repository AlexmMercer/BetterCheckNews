import axios, { type AxiosError } from "axios";

export interface CurrentsNewsItem {
  id?: string;
  title: string;
  description?: string;
  url: string;
  image?: string | null;
  urlToImage?: string | null; // NewsAPI поле
  language?: string;
  category?: string[];
  author?: string | null;
  published?: string; // "YYYY-MM-DD HH:mm:ss +0000"
  publishedAt?: string; // NewsAPI поле
}
// interface CurrentsResponse {
//   status: "ok" | "error";
//   news: CurrentsNewsItem[];
// }

// Можно переключаться между API
const USE_NEWSAPI = true; // Переключатель между Currents API и NewsAPI

// Определяем базовый URL в зависимости от окружения
const getBaseUrl = () => {
  const isDev = import.meta.env.DEV;
  if (isDev) {
    // В разработке используем прокси
    return USE_NEWSAPI ? "/newsapi/v2" : "/api/v1";
  } else {
    // В продакшене используем прямые URL
    return USE_NEWSAPI ? "https://newsapi.org/v2" : "https://api.currentsapi.services/v1";
  }
};

const BASE_URL = getBaseUrl();

function getApiKey(): string | undefined {
  const viteKey = import.meta.env.VITE_NEWS_API_KEY;
  return viteKey;
}

export async function getNews(params: { language?: string; page_size?: number; page?: number } = {}) {
  const { language = 'en', page_size = 20, page = 1 } = params;

  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("Missing Currents API key. Set VITE_NEWS_API_KEY in .env file.");
    return [];
  }

  try {
    const endpoint = USE_NEWSAPI ? 'top-headlines' : 'latest-news';
    const params = USE_NEWSAPI 
      ? { apiKey, pageSize: page_size, page, country: 'us' }
      : { apiKey, page_size, page, language };
    
    console.log('Making request to:', `${BASE_URL}/${endpoint}`);
    console.log('With params:', { ...params, apiKey: apiKey ? '***hidden***' : 'missing' });
    
    const res = await axios.get(`${BASE_URL}/${endpoint}`, {
      timeout: 10000,
      params,
    });
    
    console.log('Response:', res.data);
    
    // NewsAPI возвращает articles, Currents API возвращает news
    const articles = USE_NEWSAPI ? res.data.articles : res.data.news;
    return articles ?? [];
  } catch (err) {
    const e = err as AxiosError<{ message?: string }>;
    console.error('Full error:', err);
    console.error(`Currents API error: ${e.response?.data?.message || e.message || "Request failed"}`);
    
    // Если 429 (Too Many Requests), сообщаем об ошибке
    if (e.response?.status === 429) {
      console.error('API rate limit exceeded. Please wait or check your API plan.');
    }
    
    return [];
  }
}
