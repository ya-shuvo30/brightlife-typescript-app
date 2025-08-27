import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Custom domain setup
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false, // Disable for production
    minify: 'terser', // Better minification for TypeScript
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['zustand', 'immer'],
          // Separate TypeScript utilities
          typescript: ['@types/node']
        },
        // Optimize file naming for caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    // TypeScript specific optimizations
    target: 'es2020',
    chunkSizeWarningLimit: 1000
  },
  // Better development experience for TypeScript
  server: {
    port: 3000,
    open: true,
    hmr: true
  },
  // TypeScript path resolution
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@utils': '/src/utils',
      '@types': '/src/types',
      '@hooks': '/src/hooks'
    }
  }
})
