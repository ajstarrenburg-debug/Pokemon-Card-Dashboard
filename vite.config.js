import { defineConfig } from 'vite';
import { cpSync } from 'node:fs';
import { resolve } from 'node:path';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    allowedHosts: ['terminal.local'],
  },
  build: {
    rollupOptions: {
      input: {
        dashboard: resolve(import.meta.dirname, 'index.html'),
        review: resolve(import.meta.dirname, 'review.html'),
      },
    },
  },
  plugins: [{
    name: 'copy-review-card-assets',
    closeBundle() {
      cpSync(
        resolve(import.meta.dirname, 'cards'),
        resolve(import.meta.dirname, 'dist/cards'),
        { recursive: true },
      );
    },
  }],
});
