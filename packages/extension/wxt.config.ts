import { defineConfig } from 'wxt';
import react from '@vitejs/plugin-react';

// See https://wxt.dev/api/config.html
export default defineConfig({
  vite: () => ({
    plugins: [react()],
  }),
  dev: {
    server: {
      port: 4000,
    },
  },
  manifest: {
    host_permissions: ["http://*/"],
    permissions: ["activeTab", "storage", "http://localhost:3000/*"],
  },
});
