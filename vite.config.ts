import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/vltx-settings/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        indonesian: 'index-indonesian.html',
        updates: 'index-updates.html',
        cards: 'index-cards.html',
      },
    },
  },
});
