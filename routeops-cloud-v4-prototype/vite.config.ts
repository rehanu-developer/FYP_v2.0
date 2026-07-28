import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Front-end only prototype. No backend, no proxy.
// `base: './'` keeps the production build portable so `dist/` can be opened
// from any static host or subdirectory when sharing with the client.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: true,
    port: 5173,
    strictPort: false,
  },
  preview: {
    host: true,
    port: 4173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
