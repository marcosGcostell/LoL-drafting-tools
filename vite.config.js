import { resolve } from 'path';

export default {
  root: resolve(__dirname, 'client'),
  server: {
    port: 8000,
    open: true,
    // proxy: {
    //   '/api': 'http://localhost:3000',
    // },
    hmr: {
      overlay: false,
    },
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
  },
};
