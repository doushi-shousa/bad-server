import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

const rootDir = import.meta.dirname;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr(), react(), tsconfigPaths({ root: rootDir })],
  resolve: {
    alias: {
      $fonts: resolve(rootDir, 'src/vendor/fonts'),
      $assets: resolve(rootDir, 'src/assets'),
    },
  },
  build: {
    assetsInlineLimit: 0,
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [resolve(rootDir, 'src/scss')],
        additionalData: `
          @use "variables" as *;
          @use "mixins";
        `,
      },
    },
  },
});