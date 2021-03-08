/*
* Vite config
*
* Used by:
*   $ npm run build:vite
*/
import {dirname} from 'path'
import {fileURLToPath} from 'url'

const myPath = dirname(fileURLToPath(import.meta.url));
const srcPath = myPath +'/../src';

import { manualChunks } from '../manualChunks.js'

export default {
  /* not needed
  resolve: {
    alias: {
      '/src': srcPath
    }
  },*/

  define: {     // "statically replaced" for production
    "_OPS_VERSION": "\"0.0.0\""
  },

  build: {
    //publicDir: myPath + "/../extras",

    outDir: myPath + "/out",    // must match 'hosting.public' in 'firebase.json'.
    assetsDir: '.',   // relative to 'outDir'

    minify: true,
    sourcemap: true,
    target: 'esnext',   // assumes native dynamic imports
    //polyfillDynamicImport: false

    rollupOptions: {
      output: { manualChunks }
    }
  }
}
