import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
<<<<<<< HEAD
    setupFiles: ['./src/setupTests.js'],
    include: ['./src/tests/**/*.test.{js,jsx}'],
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      exclude:['src/tests/**', 'src/main.jsx'],
=======
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
        'src/pages/Unauthorized.jsx',
      ],
>>>>>>> 33525af2e71e1cf8b6889cd21b51af7244019e6f
    },
  },
});
