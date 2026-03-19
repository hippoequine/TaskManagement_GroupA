import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default () => {
  // https://vite.dev/config/
  return defineConfig({
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
    },
  });
};
