// @ts-nocheck
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': '/src',  // Simplified alias for Vite
    },
  },
});
