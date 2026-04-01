import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (err, _req, res) => {
            console.error('[proxy] Backend not reachable:', err.message)
            if ('writeHead' in res && typeof res.writeHead === 'function') {
              res.writeHead(503, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'Backend server is not running. Start it with: npm run dev' }))
            }
          })
        },
      },
    },
  },
})
