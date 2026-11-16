import type http from 'http';
import path from 'path';
import { defineConfig } from 'vite';
import {
  attachConvoLiveWebSocket,
  createConvoApiApp,
} from './src/convoServerRoutes.ts';
import { handleDockerZipHttpRequest } from './src/dockerZipExporter.ts';

export default defineConfig(() => {
  return {
    plugins: [
      {
        name: 'lango-dev-api-and-docker-exporter',
        configureServer(server) {
          const convoApp = !server.config.server.middlewareMode
            ? createConvoApiApp()
            : null;

          if (!server.config.server.middlewareMode && server.httpServer) {
            attachConvoLiveWebSocket(server.httpServer as http.Server);
          }

          server.middlewares.use((req, res, next) => {
            if (handleDockerZipHttpRequest(req, res, __dirname)) {
              return;
            }
            if (convoApp && req.url?.startsWith('/api/convo/')) {
              convoApp(
                req as unknown as import('express').Request,
                res as unknown as import('express').Response,
                next
              );
              return;
            }
            next();
          });
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
