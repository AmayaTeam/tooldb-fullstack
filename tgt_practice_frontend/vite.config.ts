import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  envDir: "../",
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  plugins: [reactRefresh()],
  resolve: {
    alias: {
      src: "/src",
    },
  },
})
