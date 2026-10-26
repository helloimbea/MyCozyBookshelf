import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Encaminha /api para o Spring Boot em dev (evita configurar CORS)
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
