import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Include JSX runtime for smaller bundles
      jsxRuntime: 'automatic',
      // Only apply Fast Refresh in development
      fastRefresh: true,
    }),
  ],
  resolve: {
    alias: {
      // Set up path aliases for cleaner imports
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@lib': resolve(__dirname, './src/lib'),
    },
  },
  server: {
    // Enable HMR
    hmr: true,
    // Automatically open browser on start
    open: true,
    // Port to use (can be overridden by CLI)
    port: 5173,
    // Allow connections from network
    host: true,
  },
  build: {
    // Output directory
    outDir: 'dist',
    // Minify output
    minify: 'terser',
    // Sourcemaps in development, not in production
    sourcemap: process.env.NODE_ENV === 'development',
    // Optimize dependencies
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    // Split chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
  // Optimizations for production
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@mui/material'],
  },
  // Environment variable configuration
  envPrefix: 'VITE_',
});
