/*
* Vite config
*
* Used by:
*   $ npm run build:vite
*/
import {dirname} from 'path'
import {fileURLToPath} from 'url'

const srcPath = dirname(fileURLToPath(import.meta.url)) + '../src';

import { manualChunks } from '../manualChunks'

export default {
  resolve: {
    alias: {
      '/src': srcPath
    }
  },

  define: {     // "statically replaced" for production
    "_OPS_VERSION": "\"0.0.0\""
  },

  build: {
    //publicDir: "not-used",
    // Must match 'hosting.public' in 'firebase.json'.
    //outDir: "vite/out",
    //assetsDir: "not-used",

    minify: true,
    sourcemap: true,
    target: 'esnext',   // assumes native dynamic imports
    //polyfillDynamicImport: false

    rollupOptions: {
      output: { manualChunks }
    }
  },

  clearScreen: false    // having it here doesn't matter
}
