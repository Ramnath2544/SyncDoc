import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import flowbiteReact from 'flowbite-react/plugin/vite';

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://syncdoc-mwis.onrender.com',
        changeOrigin: true,
      },
      '/collaboration': {
        target: 'ws://localhost:1234',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), tailwindcss(), flowbiteReact()],
});
