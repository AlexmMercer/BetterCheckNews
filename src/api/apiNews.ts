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

export interface NewsApiResponse {
  articles: CurrentsNewsItem[];
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalResults: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Можно переключаться между API
const USE_NEWSAPI = true; // Переключатель между Currents API и NewsAPI

// Определяем базовый URL в зависимости от окружения
const getBaseUrl = () => {
  const isProduction = import.meta.env.PROD;
  const isDevelopment = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  if (isDevelopment && !isProduction) {
    // В разработке используем Vite прокси
    return USE_NEWSAPI ? "/newsapi/v2" : "/api/v1";
  } else {
    // В продакшене используем наш Vercel API прокси
    return USE_NEWSAPI ? "/api" : "https://api.currentsapi.services/v1";
  }
};

const BASE_URL = getBaseUrl();

// Логируем для отладки
console.log('Environment check:', {
  isProduction: import.meta.env.PROD,
  isDevelopment: typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'),
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
  baseUrl: BASE_URL,
  useNewsApi: USE_NEWSAPI,
  mode: import.meta.env.MODE
});

function getApiKey(): string | undefined {
  const viteKey = import.meta.env.VITE_NEWS_API_KEY;
  return viteKey;
}

// Генерируем фиктивные данные для демонстрации
function generateFallbackNews(count: number = 9, page: number = 1): CurrentsNewsItem[] {
  // Создаем большой набор новостей для демонстрации пагинации
  const allDemoNews: CurrentsNewsItem[] = [];
  
  const newsTemplates = [
    {
      title: "Breaking: Revolutionary AI Technology Transforms Healthcare Industry",
      description: "New artificial intelligence system helps doctors diagnose diseases with high accuracy.",
      category: ["Technology", "Healthcare"]
    },
    {
      title: "Climate Change: Scientists Announce Major Breakthrough in Carbon Capture",
      description: "Researchers develop new method that can remove CO2 from atmosphere efficiently.",
      category: ["Environment", "Science"]
    },
    {
      title: "Space Exploration: Mars Mission Discovers Evidence of Ancient Water Systems",
      description: "NASA rovers find compelling evidence of massive underground water networks.",
      category: ["Space", "Science"]
    },
    {
      title: "Economic Update: Global Markets Show Strong Recovery Signals",
      description: "International financial experts report positive trends across major economies.",
      category: ["Business", "Economy"]
    },
    {
      title: "Sports: Championship Finals Set to Break Viewership Records",
      description: "Unprecedented global interest in this year's championship expected.",
      category: ["Sports"]
    },
    {
      title: "Technology: Quantum Computing Achieves New Milestone",
      description: "Scientists successfully demonstrate quantum supremacy in complex calculations.",
      category: ["Technology", "Science"]
    },
    {
      title: "Health: New Treatment Shows Promise for Rare Genetic Disorders",
      description: "Clinical trials reveal groundbreaking gene therapy technique.",
      category: ["Health", "Medical"]
    },
    {
      title: "Education: Digital Learning Platforms Report Record Enrollment",
      description: "Online education continues to grow as institutions adapt.",
      category: ["Education", "Technology"]
    },
    {
      title: "Entertainment: Streaming Services Invest Billions in Original Content",
      description: "Major platforms announce unprecedented spending on exclusive shows.",
      category: ["Entertainment", "Media"]
    }
  ];
  
  // Генерируем 66 новостей для демонстрации пагинации (6 страниц по 11 новостей)
  for (let i = 0; i < 66; i++) {
    const template = newsTemplates[i % newsTemplates.length];
    const pageVariation = Math.floor(i / 11) + 1; // Для разных страниц
    
    allDemoNews.push({
      id: `${i + 1}`,
      title: `Page ${pageVariation}: ${template.title}`,
      description: template.description,
      url: "#",
      urlToImage: `https://picsum.photos/400/300?random=${i + 1}`,
      author: "Demo Reporter",
      publishedAt: new Date(Date.now() - (i * 3600000)).toISOString(),
      category: template.category
    });
  }
  
  // Возвращаем новости для конкретной страницы
  const startIndex = (page - 1) * count;
  const endIndex = startIndex + count;
  const demoNews = allDemoNews.slice(startIndex, endIndex);

  return demoNews.slice(0, count);
}

// Создаем фиктивную пагинацию для демо данных
function createFallbackPagination(page: number, pageSize: number, availableNewsCount: number = 11) {
  // Для демо данных у нас есть 66 новостей всего
  const totalDemoNews = 66;
  const totalResults = Math.min(totalDemoNews, Math.max(availableNewsCount, pageSize * page));
  
  // Убеждаемся, что мы не создаем пустых страниц
  const actualTotalPages = Math.max(1, Math.ceil(totalResults / pageSize));
  
  return {
    currentPage: page,
    pageSize: pageSize,
    totalResults: totalResults,
    totalPages: actualTotalPages,
    hasNextPage: page < actualTotalPages,
    hasPrevPage: page > 1
  };
}

export async function getNews(params: { language?: string; page_size?: number; page?: number } = {}): Promise<NewsApiResponse> {
  const { language = 'en', page_size = 11, page = 1 } = params;

  try {
    const isProduction = import.meta.env.PROD;
    const isDevelopment = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    if (USE_NEWSAPI) {
      if (isDevelopment && !isProduction) {
        // В разработке используем Vite прокси к NewsAPI
        const apiKey = getApiKey();
        if (!apiKey) {
          console.error("Missing NewsAPI key. Set VITE_NEWS_API_KEY in .env file.");
          const articles = generateFallbackNews(page_size, page);
          return {
            articles,
            pagination: createFallbackPagination(page, page_size, 66) // 66 - общее количество демо новостей
          };
        }

        const endpoint = 'top-headlines';
        const requestParams = { apiKey, pageSize: page_size, page, country: 'us' };
        
        console.log('Making request to:', `${BASE_URL}/${endpoint}`);
        console.log('With params:', { ...requestParams, apiKey: '***hidden***' });
        
        const res = await axios.get(`${BASE_URL}/${endpoint}`, {
          timeout: 10000,
          params: requestParams,
        });
        
        console.log('Response:', res.data);
        
        // Если это разработка с фиктивными данными, создаем пагинацию
        const articles = res.data.articles ?? [];
        return {
          articles,
          pagination: createFallbackPagination(page, page_size, 66) // Фиксированное количество для демо
        };
        
      } else {
        // В продакшене используем наш Vercel API прокси
        const endpoint = 'news'; // наш API endpoint
        const requestParams = { pageSize: page_size, page, country: 'us' };
        
        console.log('Making request to:', `${BASE_URL}/${endpoint}`);
        console.log('With params:', requestParams);
        
        const res = await axios.get(`${BASE_URL}/${endpoint}`, {
          timeout: 10000,
          params: requestParams,
        });
        
        console.log('Response:', res.data);
        
        // Возвращаем данные с пагинацией от сервера
        return {
          articles: res.data.articles ?? [],
          pagination: res.data.pagination
        };
      }
    } else {
      // Currents API логика (если нужна)
      const apiKey = getApiKey();
      if (!apiKey) {
        console.error("Missing Currents API key.");
        const articles = generateFallbackNews(page_size, page);
        return {
          articles,
          pagination: createFallbackPagination(page, page_size, 50) // 50 - общее количество демо новостей
        };
      }

      const endpoint = 'latest-news';
      const requestParams = { apiKey, page_size, page, language };
      
      const res = await axios.get(`${BASE_URL}/${endpoint}`, {
        timeout: 10000,
        params: requestParams,
      });
      
      const articles = res.data.news ?? [];
      return {
        articles,
        pagination: createFallbackPagination(page, page_size, 66) // Для Currents API тоже используем 66
      };
    }
  } catch (err) {
    const e = err as AxiosError<{ message?: string }>;
    console.error('Full error:', err);
    console.error(`API error: ${e.response?.data?.message || e.message || "Request failed"}`);
    
    // Если 429 (Too Many Requests), сообщаем об ошибке
    if (e.response?.status === 429) {
      console.error('API rate limit exceeded. Please wait or check your API plan.');
    }
    
    // В случае ошибки возвращаем фиктивные данные
    console.log('Returning fallback demo data due to API error...');
    const articles = generateFallbackNews(page_size, page);
    return {
      articles,
      pagination: createFallbackPagination(page, page_size, 50) // 50 - общее количество демо новостей
    };
  }
}