import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'backend-integration',
    environment: 'node',
    globals: true,
    include: ['backend/src/**/*.integration.test.js'],
  },
});
