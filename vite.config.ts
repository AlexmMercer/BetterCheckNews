import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/v1': {
        target: 'https://api.currentsapi.services',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1/, '/v1')
      },
      '/newsapi/v2': {
        target: 'https://newsapi.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/newsapi\/v2/, '/v2')
      }
    }
  }
})
