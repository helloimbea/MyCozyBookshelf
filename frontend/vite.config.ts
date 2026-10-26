<<<<<<< HEAD
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
=======
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
>>>>>>> bf49dee96ea0d0c0af491d59dcf644e6bf6504e5

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  server: {
    port: 5173,
    // Encaminha /api para o Spring Boot em dev (evita configurar CORS)
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
=======
>>>>>>> bf49dee96ea0d0c0af491d59dcf644e6bf6504e5
})
