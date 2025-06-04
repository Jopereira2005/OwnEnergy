import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    allowedHosts: [
      'localhost',
      '9c1d-45-191-221-98.ngrok-free.app' // <- adicione aqui
    ]
  }
})
