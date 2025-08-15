import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  try {
    console.log('Debug API called');
    console.log('Method:', req.method);
    console.log('Query:', req.query);
    
    // Проверяем переменные окружения
    const envCheck = {
      VITE_NEWS_API_KEY: !!process.env.VITE_NEWS_API_KEY,
      NEWS_API_KEY: !!process.env.NEWS_API_KEY,
      NEWSAPI_KEY: !!process.env.NEWSAPI_KEY,
      NODE_ENV: process.env.NODE_ENV
    };
    
    console.log('Environment:', envCheck);
    
    // Возвращаем фиктивные данные в том же формате, что ожидает фронтенд
    const mockResponse = {
      articles: [
        {
          id: "debug-1",
          title: "Debug: API Function Works",
          description: "This is a test article from debug endpoint",
          url: "#",
          urlToImage: "https://picsum.photos/400/300?random=1",
          author: "Debug Reporter",
          publishedAt: new Date().toISOString()
        }
      ],
      pagination: {
        currentPage: 1,
        pageSize: 11,
        totalResults: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
      }
    };
    
    return res.status(200).json(mockResponse);
    
  } catch (error) {
    console.error('Debug API Error:', error);
    return res.status(500).json({
      error: 'Debug endpoint failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
