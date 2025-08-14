import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Простой тест API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  return res.status(200).json({ 
    message: 'API работает!',
    environment: process.env.NODE_ENV || 'unknown',
    timestamp: new Date().toISOString(),
    hasApiKey: !!process.env.VITE_NEWS_API_KEY
  });
}
