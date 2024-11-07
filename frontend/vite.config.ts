import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr(),
    react()
  ],
  server: {
    port: 5173, // Порт для вашего Vite dev server
    host: 'localhost', // Убедитесь, что сервер доступен по этому адресу
    hmr: {
      host: 'localhost', // Явно укажите хост для HMR WebSocket
      port: 5173, // Порт для HMR
      clientPort: 5173, // Укажите клиентский порт для корректного подключения к WebSocket
    },
    watch: {
      usePolling: true, // Используйте polling, если система не отслеживает изменения корректно
    },
  },
})
