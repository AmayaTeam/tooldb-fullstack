import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  plugins: [reactRefresh()],
  define: {
    'process.env': process.env
  },
  resolve: {
    alias: {
      src: "/src",
    },
  },
})