import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./frontend/src/setupTests.js'],
    include: ['./frontend/src/tests/**/*.integration.test.{js,jsx}'],
    globals: true,
  },
});
