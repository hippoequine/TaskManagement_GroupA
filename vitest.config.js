import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./frontend/src/setupTests.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['frontend/src/**', 'backend/src/**'],
      exclude: [
        'node_modules/**',
        '**/*.integration.test.*',
        'frontend/src/setupTests.js',
      ],
      thresholds: {
        statements: 75,
        branches: 75,
        functions: 75,
        lines: 75,
      },
    },
  },
});
