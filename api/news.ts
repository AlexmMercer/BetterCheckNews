import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('API called with method:', req.method);
  console.log('Query params:', req.query);
  
  // Разрешаем только GET запросы
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { page = '1', pageSize = '11', country = 'us' } = req.query;
    
    // Пробуем разные варианты названий переменных окружения
    const apiKey = process.env.VITE_NEWS_API_KEY || 
                   process.env.NEWS_API_KEY || 
                   process.env.NEWSAPI_KEY;

    console.log('Environment check:', {
      VITE_NEWS_API_KEY: !!process.env.VITE_NEWS_API_KEY,
      NEWS_API_KEY: !!process.env.NEWS_API_KEY,
      NEWSAPI_KEY: !!process.env.NEWSAPI_KEY,
      hasApiKey: !!apiKey
    });

    if (!apiKey) {
      return res.status(500).json({ 
        error: 'API key not configured',
        hint: 'Set VITE_NEWS_API_KEY, NEWS_API_KEY, or NEWSAPI_KEY in Vercel environment variables'
      });
    }

    // Построим URL для NewsAPI
    const newsApiUrl = new URL('https://newsapi.org/v2/top-headlines');
    newsApiUrl.searchParams.append('apiKey', apiKey);
    newsApiUrl.searchParams.append('page', String(page));
    newsApiUrl.searchParams.append('pageSize', String(pageSize));
    newsApiUrl.searchParams.append('country', String(country));

    console.log('Fetching from NewsAPI:', newsApiUrl.toString().replace(apiKey, '***'));

    const response = await fetch(newsApiUrl.toString());
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('NewsAPI error:', response.status, errorData);
      return res.status(response.status).json({ 
        error: 'NewsAPI request failed',
        details: errorData
      });
    }

    const data = await response.json() as { totalResults?: number; articles?: any[]; [key: string]: any };
    
    // Добавляем CORS заголовки
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Возвращаем данные с метаинформацией
    const pageNum = parseInt(String(page));
    const pageSizeNum = parseInt(String(pageSize));
    const totalResults = data.totalResults || 0;
    const totalPages = Math.ceil(totalResults / pageSizeNum);
    
    return res.status(200).json({
      articles: data.articles || [],
      totalResults: data.totalResults || 0,
      status: data.status || 'ok',
      pagination: {
        currentPage: pageNum,
        pageSize: pageSizeNum,
        totalResults,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
