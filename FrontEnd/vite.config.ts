import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    allowedHosts: [
      'localhost',
      'poker-applies-dpi-hugh.trycloudflare.com' // <- adicione aqui
    ]
  }
})
