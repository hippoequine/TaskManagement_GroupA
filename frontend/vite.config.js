import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://backend:5050',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.js'],
    include: ['src/tests/**/*.{test,spec}.{js,jsx}'],
    testTimeout: 10000, // Increase timeout for async tests
  },
});
