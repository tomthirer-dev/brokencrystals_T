import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  publicDir: './public',
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg', '**/*.gif', '**/*.webp', '**/*.ico', '**/*.css', '**/*.js', '**/*.map', '**/*.woff', '**/*.woff2', '**/*.ttf', '**/*.eot'],
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/grpc': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 600 * 1024
  }
});
