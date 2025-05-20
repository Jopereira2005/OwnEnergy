import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    allowedHosts: [
      'localhost',
      'a337-186-224-143-216.ngrok-free.app' // <- adicione aqui
    ]
  }
})
