/*
* manualChunks.js
*
* Decides, how chunks are bundled, when passed through Rollup or Vite.
*
* References:
*   - Rollup docs > output.manualChunks
*     -> https://rollupjs.org/guide/en/#outputmanualchunks
*/
const defaultChunk = 'default';

function manualChunks(id) {
  //console.debug(`Chunking (ID): ${id}`);    // DEBUG

  let name;
  for( const x of chunkTo ) {
    const [re,subDir,forceName] = Array.isArray(x) ? x : [x];

    const tmp = id.match(re);   // [_, capture] | null
    if (tmp) {
      name = (subDir ? `${subDir}/`:"") + ((tmp[1] || forceName || defaultChunk).replace('/','-'));
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
const chunkTo = [     // Array of (Regex | [Regex, string, string?])

  // All 'ops' things to one chunk
  //
  //  /Users/.../app-deploy-ops/src/main.js
  //  /Users/.../app-deploy-ops/src/assert.js
  //  /Users/.../app-deploy-ops/src/catch.js
  //  /Users/.../app-deploy-ops/src/central.js
  //  /Users/.../app-deploy-ops/index.html                        <-- only in the Vite build
  //  /Users/.../app-deploy-ops/index.html?html-proxy&index=0.js  <-- -''-
  //
  /\/app-deploy-ops\/(?:src\/|index\.html)/,

  // vite/preload-helper
  /^(vite)\//,      // Vite runtime (small, ~600b)

  // App and its libraries (keep the chunking)
  //
  // /Users/.../app/vitebox/dist/app.es.js
  // /Users/.../app/vitebox/dist/vue.js
  // /Users/.../app/vitebox/dist/aside-keys.js
  // /Users/.../app/vitebox/dist/vue-router.js
  // /Users/.../app/vitebox/dist/firebase.js
  // /Users/.../app/vitebox/dist/firebase-auth.js
  // /Users/.../app/vitebox/dist/firebase-firestore.js
  // /Users/.../app/vitebox/dist/firebase-performance.js
  // /Users/.../app/vitebox/dist/tslib.js
  //
  [/\/app\/.+\/(.+?)\.js$/, 'app'],

  // Firebase for both app and ops (+ tslib, idb)
  //
  //  /Users/.../app-deploy-ops/node_modules/firebase/performance/dist/index.esm.js
  //  /Users/.../app-deploy-ops/node_modules/@firebase/performance/dist/index.esm.js
  //  /Users/.../app-deploy-ops/node_modules/@firebase/component/dist/index.esm.js
  //  /Users/.../app-deploy-ops/node_modules/@firebase/logger/dist/index.esm2017.js
  //  /Users/.../app-deploy-ops/node_modules/@firebase/util/dist/index.esm.js
  //  /Users/.../app-deploy-ops/node_modules/@firebase/performance/node_modules/tslib/tslib.es6.js
  //  /Users/.../app-deploy-ops/node_modules/@firebase/installations/dist/index.esm.js
  //  /Users/.../app-deploy-ops/node_modules/@firebase/component/node_modules/tslib/tslib.es6.js
  //  /Users/.../app-deploy-ops/node_modules/@firebase/util/node_modules/tslib/tslib.es6.js
  //  /Users/.../app-deploy-ops/node_modules/@firebase/installations/node_modules/tslib/tslib.es6.js
  //  /Users/.../app-deploy-ops/node_modules/idb/lib/idb.mjs
  //
  /\/node_modules\/@?(firebase)\/(?!auth|firestore|performance)/,

  /\/node_modules\/@?(firebase\/auth)\//,
  /\/node_modules\/@?(firebase\/firestore)\//,
  /\/node_modules\/@?(firebase\/performance)\//,

  /\/node_modules\/(tslib)\//,
  [/\/app-deploy-ops\/node_modules\/idb\//, undefined, 'firebase-performance']    // used by firebase-performance only (pack in the same chunk)
];

export {
  manualChunks
}
