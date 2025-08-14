import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Разрешаем только GET запросы
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { page = '1', pageSize = '9', country = 'us' } = req.query;
    const apiKey = process.env.VITE_NEWS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
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

    const data = await response.json();
    
    // Добавляем CORS заголовки
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Возвращаем данные
    return res.status(200).json(data);

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
