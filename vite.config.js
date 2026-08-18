import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Говорим Vite перехватывать все запросы, которые начинаются с /api
      '/api': {
        target: 'https://api.coingecko.com', // Куда перенаправлять запрос на самом деле
        changeOrigin: true,                 // Подменять заголовок Origin на домен получателя
        secure: false                       // Отключаем строгую валидацию SSL для локальной разработки
      }
    }
  }
})
