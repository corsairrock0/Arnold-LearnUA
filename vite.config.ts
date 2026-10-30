import path from 'path';
import type http from 'http';
import { defineConfig } from 'vite';
import {
  createConvoApiApp,
  attachConvoLiveWebSocket,
} from './src/convoServerRoutes.ts';

export default defineConfig(() => {
  const convoApiApp = createConvoApiApp();

  return {
    plugins: [
      {
        name: 'langoua-convo-api-plugin',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url && req.url.startsWith('/api/convo')) {
              convoApiApp(req as never, res as never, next);
            } else {
              next();
            }
          });
          if (server.httpServer) {
            attachConvoLiveWebSocket(server.httpServer as http.Server);
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      allowedHosts: true,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      allowedHosts: true,
    },
  };
});
