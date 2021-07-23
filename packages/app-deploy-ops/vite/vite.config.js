/*
* Vite config
*
* Used by:
*   $ npm run build:vite
*/
import {dirname} from 'path'
import {fileURLToPath} from 'url'

const myPath = dirname(fileURLToPath(import.meta.url));

import { visualizer } from 'rollup-plugin-visualizer'

import { manualChunks } from '../vite-and-roll/manualChunks.js'
import { aliases } from '../vite-and-roll/aliases.js'
import { } from '../vite-and-roll/rollupConfig.js'

const createStats = true;

// tbd. How to say "modulesOnly: true" (only build to ES modules), for Vite???

export default {
  resolve: {
    alias: {
      // tbd. which one works??
      ...aliases
      //entries: Object.entries(aliases).map( ([k,v]) => ({ find: k, replacement: v }) )   // plugin's syntax
    },
    //dedupe,   // IMPORTANT (no longer needed???)
  },

  define: {     // "statically replaced" for production
    //"_OPS_VERSION": "\"0.0.0\""
  },

  build: {
    publicDir: false,   // act as if we don't have public files (want to only reach to 'dist' in the app, and it has all files mixed; 'package.json' takes care)
    outDir: myPath + "/out",    // 'firebase.json' 'hosting.public' must point to 'vite/out'
    assetsDir: '.',   // relative to 'outDir'

    //minify: true,
    sourcemap: true,
    target: 'esnext',   // assumes native dynamic imports (also default in Vite 2.3.x)
    //polyfillDynamicImport: false

    rollupOptions: {
      output: { manualChunks },

      plugins: [
        createStats && visualizer({   // does not work
          filename: 'vite/stats.html',
          sourcemap: true,
          template: 'sunburst',
          brotliSize: true
        })
      ]
    }
  }
}
