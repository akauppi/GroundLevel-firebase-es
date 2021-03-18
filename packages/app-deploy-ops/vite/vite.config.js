/*
* Vite config
*
* Used by:
*   $ npm run build:vite
*/
import {dirname} from 'path'
import {fileURLToPath} from 'url'

const myPath = dirname(fileURLToPath(import.meta.url));

import visualizer from 'rollup-plugin-visualizer'

import { manualChunks } from '../vite-and-roll/manualChunks.js'
import { opsAliases } from '../vite-and-roll/opsAliases.js'
import {readdirSync} from 'fs'

const createStats = true;

const allFirebaseSubpackages = [
  ...readdirSync("./node_modules/@firebase").map( x => `@firebase/${x}` ),
  ...readdirSync("./node_modules/firebase").map( x => `firebase/${x}` ),
];

export default {
  resolve: {
    alias: opsAliases,
    dedupe: allFirebaseSubpackages,   // IMPORTANT
    // For dear Firebase
    mainFields: ["esm2017", "module"]
  },

  define: {     // "statically replaced" for production
    //"_OPS_VERSION": "\"0.0.0\""
  },

  build: {
    publicDir: 'node_modules/@local/app/vitebox/public',    // pass any static files directly
    outDir: myPath + "/out",    // must match 'hosting.public' in 'firebase.json'.
    assetsDir: '.',   // relative to 'outDir'

    //minify: true,
    sourcemap: true,
    target: 'esnext',   // assumes native dynamic imports
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
