import 'dotenv/config';

import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // 可參考：https://israynotarray.com/nodejs/20230214/796256725/
  base: process.env.NODE_ENV === 'production' ? `/${process.env.REPOSITORIES}/` : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
