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
function generateFallbackNews(count: number = 9): CurrentsNewsItem[] {
  const demoNews: CurrentsNewsItem[] = [
    {
      id: "1",
      title: "Breaking: Revolutionary AI Technology Transforms Healthcare Industry",
      description: "New artificial intelligence system helps doctors diagnose diseases with 99% accuracy, potentially saving millions of lives worldwide.",
      url: "#",
      urlToImage: "https://picsum.photos/400/300?random=1",
      author: "Tech Reporter",
      publishedAt: new Date().toISOString(),
      category: ["Technology", "Healthcare"]
    },
    {
      id: "2", 
      title: "Climate Change: Scientists Announce Major Breakthrough in Carbon Capture",
      description: "Researchers develop new method that can remove CO2 from atmosphere 10 times more efficiently than previous technologies.",
      url: "#",
      urlToImage: "https://picsum.photos/400/300?random=2",
      author: "Environmental Correspondent",
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      category: ["Environment", "Science"]
    },
    {
      id: "3",
      title: "Space Exploration: Mars Mission Discovers Evidence of Ancient Water Systems",
      description: "NASA rovers find compelling evidence of massive underground water networks that could have supported life millions of years ago.",
      url: "#", 
      urlToImage: "https://picsum.photos/400/300?random=3",
      author: "Space Correspondent",
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      category: ["Space", "Science"]
    },
    {
      id: "4",
      title: "Economic Update: Global Markets Show Strong Recovery Signals",
      description: "International financial experts report positive trends across major economies as inflation rates begin to stabilize.",
      url: "#",
      urlToImage: "https://picsum.photos/400/300?random=4",
      author: "Financial Analyst",
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      category: ["Business", "Economy"]
    },
    {
      id: "5",
      title: "Sports: Championship Finals Set to Break Viewership Records",
      description: "Unprecedented global interest in this year's championship expected to surpass all previous broadcasting milestones.",
      url: "#",
      urlToImage: "https://picsum.photos/400/300?random=5",
      author: "Sports Reporter",
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      category: ["Sports"]
    },
    {
      id: "6",
      title: "Technology: Quantum Computing Achieves New Milestone",
      description: "Scientists successfully demonstrate quantum supremacy in solving complex mathematical problems impossible for classical computers.",
      url: "#",
      urlToImage: "https://picsum.photos/400/300?random=6",
      author: "Science Reporter",
      publishedAt: new Date(Date.now() - 18000000).toISOString(),
      category: ["Technology", "Science"]
    },
    {
      id: "7",
      title: "Health: New Treatment Shows Promise for Rare Genetic Disorders",
      description: "Clinical trials reveal groundbreaking gene therapy technique could help thousands of patients with previously untreatable conditions.",
      url: "#",
      urlToImage: "https://picsum.photos/400/300?random=7",
      author: "Health Correspondent",
      publishedAt: new Date(Date.now() - 21600000).toISOString(),
      category: ["Health", "Medical"]
    },
    {
      id: "8",
      title: "Education: Digital Learning Platforms Report Record Enrollment",
      description: "Online education continues to grow as institutions worldwide adapt to changing learning preferences and technological advances.",
      url: "#",
      urlToImage: "https://picsum.photos/400/300?random=8",
      author: "Education Reporter",
      publishedAt: new Date(Date.now() - 25200000).toISOString(),
      category: ["Education", "Technology"]
    },
    {
      id: "9",
      title: "Entertainment: Streaming Services Invest Billions in Original Content",
      description: "Major platforms announce unprecedented spending on exclusive shows and movies to compete in the rapidly evolving entertainment landscape.",
      url: "#",
      urlToImage: "https://picsum.photos/400/300?random=9",
      author: "Entertainment Critic",
      publishedAt: new Date(Date.now() - 28800000).toISOString(),
      category: ["Entertainment", "Media"]
    }
  ];

  return demoNews.slice(0, count);
}

export async function getNews(params: { language?: string; page_size?: number; page?: number } = {}) {
  const { language = 'en', page_size = 20, page = 1 } = params;

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
          return generateFallbackNews(page_size);
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
        return res.data.articles ?? [];
        
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
        return res.data.articles ?? [];
      }
    } else {
      // Currents API логика (если нужна)
      const apiKey = getApiKey();
      if (!apiKey) {
        console.error("Missing Currents API key.");
        return generateFallbackNews(page_size);
      }

      const endpoint = 'latest-news';
      const requestParams = { apiKey, page_size, page, language };
      
      const res = await axios.get(`${BASE_URL}/${endpoint}`, {
        timeout: 10000,
        params: requestParams,
      });
      
      return res.data.news ?? [];
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
    return generateFallbackNews(page_size);
  }
}
