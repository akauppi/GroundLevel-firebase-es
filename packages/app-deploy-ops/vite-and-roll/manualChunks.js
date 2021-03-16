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
  //  /Users/.../app-deploy-ops/src/ops/central.js
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
  [/(?<!node_modules.*)\/app\/.+\/(.+?)\.js$/, 'app'],      // note: 'node_modules' _not_ allowed to precede (negative look-behind)

  // Firebase for both app and ops (+ tslib, idb)
  //
  // /Users/.../app-deploy-ops/node_modules/@firebase/app/dist/index.esm2017.js
  // /Users/.../app-deploy-ops/node_modules/@firebase/performance/dist/index.esm2017.js
  // /Users/.../app-deploy-ops/node_modules/@firebase/util/dist/index.esm2017.js
  // /Users/.../app-deploy-ops/node_modules/@firebase/logger/dist/index.esm2017.js
  // /Users/.../app-deploy-ops/node_modules/@firebase/component/dist/index.esm2017.js
  // /Users/.../app-deploy-ops/node_modules/@firebase/installations/dist/index.esm2017.js
  // /Users/.../app-deploy-ops/node_modules/firebase/auth/dist/index.esm.js
  // /Users/.../app-deploy-ops/node_modules/@firebase/auth/dist/esm2017/index.js
  // /Users/.../app-deploy-ops/node_modules/@firebase/firestore/dist/exp/index.browser.esm2017.js
  // /Users/.../app-deploy-ops/node_modules/@firebase/auth/dist/esm2017/index-2cb9d3c8.js
  // /Users/.../app-deploy-ops/node_modules/tslib/tslib.es6.js
  // /Users/.../app-deploy-ops/node_modules/idb/lib/idb.mjs
  // /Users/.../app-deploy-ops/node_modules/@firebase/webchannel-wrapper/dist/index.esm2017.js
  //
  /\/node_modules\/@?(firebase\/auth)\//,
  /\/node_modules\/@?(firebase\/firestore)\//,
  /\/node_modules\/@?(firebase\/performance)\//,
    //
  /\/node_modules\/@?(firebase)\//,   // catch all of Firebase (keep AFTER the specific matches)

  /\/node_modules\/(tslib)\//,
  [/\/app-deploy-ops\/node_modules\/idb\//, undefined, 'firebase-performance']    // used by firebase-performance only (pack together)
];

export {
  manualChunks
}
