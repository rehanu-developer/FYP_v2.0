import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Front-end only prototype. No backend, no proxy.
//
// `base: './'` keeps the production build portable so `dist/` can be opened
// from any static host or subdirectory when sharing with the client.
//
// The dev and preview servers bind 0.0.0.0:5173.
//
// Port 8080 is RESERVED FOR ALLOY: the Alloy preview proxy listens on 8080 and
// forwards to the app's own port, which is declared as `frontendPort` in
// .alloy/environment.json. Binding the app itself to 8080 would collide with
// that proxy, so the app must stay on a non-8080 port.
//
// 0.0.0.0 (not localhost / IPv6-only) so the proxy can reach it from outside
// the container's network namespace.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // Accept whatever Host header the Alloy preview proxy forwards.
    cors: true,
    // HMR must advertise the proxy's public port, not the internal one.
    hmr: { clientPort: 8080 },
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    cors: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
