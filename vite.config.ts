import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Cast process to any to avoid type errors if @types/node is missing
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Prioritize env var from .env files (env object), then system env (process.env for Vercel), then empty string
  const apiKey = env.API_KEY || process.env.API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // Ensure it's always a string, even if empty, to prevent JSON.stringify(undefined)
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            pdf: ['html2canvas', 'jspdf'],
            genai: ['@google/genai']
          }
        }
      }
    }
  }
})