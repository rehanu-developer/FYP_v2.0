import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Front-end only prototype. No backend, no proxy.
//
// `base: './'` keeps the production build portable so `dist/` can be opened
// from any static host or subdirectory when sharing with the client.
//
// The dev and preview servers bind 0.0.0.0:8080 because that is the port the
// Alloy preview viewer looks for. Keep them on 8080 or the viewer will sit on
// "Setting up environment...".
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: '0.0.0.0',
    port: 8080,
    strictPort: true,
    // Accept whatever Host header the preview proxy forwards.
    cors: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 8080,
    strictPort: true,
    cors: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
