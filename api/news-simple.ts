import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    console.log('Simple News API called');
    
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { page = '1', pageSize = '11' } = req.query;
    const pageNum = parseInt(String(page));
    const pageSizeNum = parseInt(String(pageSize));
    
    // Создаем фиктивные новости
    const mockNews = [];
    for (let i = 0; i < pageSizeNum; i++) {
      mockNews.push({
        id: `simple-${pageNum}-${i + 1}`,
        title: `Page ${pageNum}: Simple News Article ${i + 1}`,
        description: `This is a simple mock article ${i + 1} for page ${pageNum}`,
        url: "#",
        urlToImage: `https://picsum.photos/400/300?random=${pageNum}${i + 1}`,
        author: "Simple Reporter",
        publishedAt: new Date(Date.now() - (i * 3600000)).toISOString()
      });
    }
    
    const response = {
      articles: mockNews,
      pagination: {
        currentPage: pageNum,
        pageSize: pageSizeNum,
        totalResults: 55, // 5 страниц по 11 новостей
        totalPages: 5,
        hasNextPage: pageNum < 5,
        hasPrevPage: pageNum > 1
      }
    };
    
    console.log('Returning mock news:', response);
    return res.status(200).json(response);
    
  } catch (error) {
    console.error('Simple News API Error:', error);
    return res.status(500).json({
      error: 'Simple news API failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
