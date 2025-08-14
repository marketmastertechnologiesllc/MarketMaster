import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Bind the dev server to your IP (or use '0.0.0.0' to listen on all interfaces)
    port: 5173,           // Default Vite port
    strictPort: true,     // Fail if port is already in use
    open: false,           // Don't auto-open browser (optional)
    allowedHosts: ['app.trademesh.com']
  }
})
