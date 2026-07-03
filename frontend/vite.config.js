import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
  },
  build: {
    // Target modern browsers for better tree-shaking
    target: 'es2020',
    // Enable minification with esbuild (default) — faster than terser
    minify: 'esbuild',
    // Raise chunk size warning threshold
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Core React
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Animation library
          'motion': ['framer-motion'],
          // Charts library
          'charts': ['recharts'],
          // Icons
          'icons': ['lucide-react'],
          // HTTP client
          'axios': ['axios'],
        },
      },
    },
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'recharts', 'lucide-react', 'axios'],
  },
})
