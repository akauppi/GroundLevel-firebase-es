/*
* manualChunks.js
*
* Decides, how chunks are bundled, when passed through Rollup.
*
* Used by both Rollup and Vite builds.
*
* References:
*   - Rollup docs > output.manualChunks
*     -> https://rollupjs.org/guide/en/#outputmanualchunks
*/
const defaultChunk = 'default';

// Help Rollup in packaging (deploy & ops)
//
function manualChunks(id) {
  //console.debug(`Chunking (ID): ${id}`);    // DEBUG

  let name;
  for( const x of chunkTo ) {
    const [re,subDir] = Array.isArray(x) ? x : [x,null];

    const tmp = id.match(re);   // [_, capture] | null
    if (tmp) {
      name = (subDir ? `${subDir}/`:"") + ((tmp[1] || defaultChunk).replace('/','-'));
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
  // Firebase app, performance used by ops
  //
  // /Users/.../app-deploy-ops/node_modules/firebase/app/dist/index.esm.js
  // /Users/.../app-deploy-ops/node_modules/firebase/performance/dist/index.esm.js
  // /Users/.../app-deploy-ops/node_modules/@firebase/performance/dist/index.esm.js
  // /Users/.../app-deploy-ops/node_modules/@firebase/app/dist/index.esm5.js
  //  .. + tlib, idb
  //
  [/\/app-deploy-ops\/node_modules\/@?(firebase\/performance)\//, 'ops'],
  [/\/app-deploy-ops\/node_modules\/@?(firebase)\//, 'ops'],
  [/\/app-deploy-ops\/node_modules\/(tslib)\//, 'ops'],
  [/\/app-deploy-ops\/node_modules\/idb\//, 'ops', 'firebase-performance'],

  // All 'ops' things to one chunk
  //
  // /Users/.../app-deploy-ops/vite/index.html
  // /Users/.../app-deploy-ops/vite/index.html?html-proxy&index=0.js
  // /Users/.../app-deploy-ops/src/main.js
  // /Users/.../app-deploy-ops/src/assert.js
  // /Users/.../app-deploy-ops/src/central.js
  // /Users/.../app-deploy-ops/src/catch.js
  //
  /\/app-deploy-ops\//,

  // vite/preload-helper
  [/^(vite)\//, 'ops'],     // Vite runtime (small, ~600b)

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
  [/\/app\/.+\/(.+?)\.js$/, 'app']
];

export {
  manualChunks
}
