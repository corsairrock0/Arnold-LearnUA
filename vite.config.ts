import path from 'path';
import { defineConfig } from 'vite';
import { handleDockerZipHttpRequest } from './src/dockerZipExporter.ts';

export default defineConfig(() => {
  return {
    plugins: [
      {
        name: 'lango-docker-zip-exporter',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (handleDockerZipHttpRequest(req, res, __dirname)) {
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
