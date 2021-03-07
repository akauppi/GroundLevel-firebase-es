// vite.config.js
//
import {dirname as pDirname, join as pJoin} from 'path'
import {fileURLToPath} from 'url'

const srcPath = pJoin( pDirname(fileURLToPath(import.meta.url)), '../src');

// Help Rollup in packaging (deploy & ops)
//
// Want:
//  - 'src/**' as 'init'
//  - 'index.html'
//  - dependencies in their own, nice cubicles
//
// References:
//    -> https://rollupjs.org/guide/en/#outputmanualchunks
//
function manualChunks(id) {

  // ID's that flow through:
  //
  // /Users/.../app-deploy-ops/index.html
  // /Users/.../app-deploy-ops/index.html?html-proxy&index=0.js
  // /Users/.../app-deploy-ops/src/main.js
  //    ...
  // /Users/.../app/vitebox/dist/app.es.js
  // vite/preload-helper
  // /Users/.../app/vitebox/dist/vue.js
  // /Users/.../app/vitebox/dist/firebase.js
  // /Users/.../app/vitebox/dist/firebase-auth.js
  // /Users/.../app/vitebox/dist/firebase-firestore.js
  // /Users/.../app/vitebox/dist/vue-router.js
  // /Users/.../app/vitebox/dist/tslib.js
  //
  // /Users/.../app/node_modules/idb/lib/idb.mjs    # because we import 'firebase-performance' from near it
  //
  //console.debug(`Chunking (ID): ${id}`);

  let name;
  for( const x of chunkTo ) {
    const [re,appStuff] = Array.isArray(x) ? x : [x,false];

    const tmp = id.match(re);   // [_, capture] | null
    if (tmp) {
      name = (appStuff ? "app/":"") + ((tmp[1] || "main").replace('/','-'));
      break;
    }
  }

  if (!name) {
    console.warn("Unexpected dependency found (not mapped in 'manualChunks'):", id);
    return;   // do NOT return a value -> let Rollup do its default
  } else {
    return name;
  }
}

// Regex's for grouping the chunks.
//
const chunkTo = [     // Array of Regex
  // All 'ops' things to one chunk
  //
  // /Users/.../app-deploy-ops/vite/index.html
  // /Users/.../app-deploy-ops/vite/index.html?html-proxy&index=0.js
  // /Users/.../app-deploy-ops/src/main.js
  //    ...
  //
  /\/app-deploy-ops\//,

  // vite/preload-helper
  /^(vite)\//,      // Vite runtime (small, ~600b)

  // App and its libraries (keep the chunking)
  //
  // /Users/.../app/vitebox/dist/app.es.js
  // /Users/.../app/vitebox/dist/vue.js
  // /Users/.../app/vitebox/dist/firebase.js
  // /Users/.../app/vitebox/dist/firebase-auth.js
  // /Users/.../app/vitebox/dist/firebase-firestore.js
  // /Users/.../app/vitebox/dist/aside-keys.js
  // /Users/.../app/vitebox/dist/vue-router.js
  // /Users/.../app/vitebox/dist/firebase-performance.js
  // /Users/.../app/vitebox/dist/tslib.js
  //
  [/\/app\/.+\/(.+?)\.js$/, true]
];

export default {
  root: 'vite',

  resolve: {
    alias: {
      '/src': srcPath
    }
  },

  define: {     // "statically replaced" for production
    "_OPS_VERSION": "\"0.0.0\""
  },

  build: {
    publicDir: "xyz",
    // Must match 'hosting.public' in 'firebase.json'.
    outDir: "vite/out",
    assetsDir: "abc",  // used ???

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
