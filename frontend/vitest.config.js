import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./frontend/src/setupTests.js'],
    include: ['./frontend/src/tests/**/*.test.{js,jsx}'],
    exclude: ['./frontend/src/tests/**/*.integration.test.{js,jsx}'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'src/setupTests.js',
        'src/App.css',
        'src/keycloak.js',
        'src/api/axios.js',
        'src/api/usersApi.js',
        'src/auth/useAuth.js',
        'src/Unauthorized.jsx',
      ],
    },
  },
});
