import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Простой тест API
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Проверяем все возможные переменные окружения
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      VITE_NEWS_API_KEY: !!process.env.VITE_NEWS_API_KEY,
      NEWS_API_KEY: !!process.env.NEWS_API_KEY,
      NEWSAPI_KEY: !!process.env.NEWSAPI_KEY,
      hasAnyApiKey: !!(process.env.VITE_NEWS_API_KEY || process.env.NEWS_API_KEY || process.env.NEWSAPI_KEY)
    };
    
    console.log('Environment variables check:', envVars);
    
    return res.status(200).json({ 
      message: 'API работает!',
      environment: process.env.NODE_ENV || 'unknown',
      timestamp: new Date().toISOString(),
      envVars
    });
  } catch (error) {
    console.error('Test API Error:', error);
    return res.status(500).json({ 
      error: 'Test function failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
