import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const host = process.env.HOST || '127.0.0.1';

export default defineConfig({
  plugins: [react()],
  server: {
    port,
    host,
  },
  preview: {
    port,
    host,
  },
});
