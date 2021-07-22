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

  // All 'src' things to one chunk (except for 'src/ops' - those are loaded by the app code)
  //
  //  /Users/.../app-deploy-ops/src/main.js
  //  /Users/.../app-deploy-ops/src/assert.js
  //  /Users/.../app-deploy-ops/src/catch.js
  //  /Users/.../app-deploy-ops/index.html                        <-- only in the Vite build
  //  /Users/.../app-deploy-ops/index.html?html-proxy&index=0.js  <-- -''-
  //
  /\/app-deploy-ops\/src\/(?!ops\/)/,   // to main chunk
  /\/app-deploy-ops\/index\.html/,

  //  /Users/.../app-deploy-ops/src/ops/central.js
  //  /Users/.../app-deploy-ops/adapters/logging/googleCloudLogging.js
  //
  /\/app-deploy-ops\/src\/(ops)\//,
  [/\/app-deploy-ops\/adapters/, undefined, 'ops'],

  //  /Users/.../firebase.{staging|...}.js    // the Firebase access values
  /\/firebase\.[^.]+\.js$/,

  // vite/preload-helper
  /^(vite)\//,      // Vite runtime (small, ~600b)

  // App and its libraries (keep the chunking)
  //
  // /Users/.../app/dist/app.es.js
  // /Users/.../app/dist/vue.js
  // /Users/.../app/dist/aside-keys.js
  // /Users/.../app/dist/vue-router.js
  // /Users/.../app/dist/firebase.js
  // /Users/.../app/dist/firebase-auth.js
  // /Users/.../app/dist/firebase-firestore.js
  // /Users/.../app/dist/firebase-performance.js
  // /Users/.../app/dist/tslib.js
  //
  [/(?<!node_modules.*)\/app\/.+\/(.+?)\.js$/, 'app'],      // note: 'node_modules' _not_ allowed to precede (negative look-behind)

  // Firebase for both app and ops (+ tslib, idb)
  //
  // /Users/.../node_modules/@firebase/app/dist/index.esm2017.js
  // /Users/.../node_modules/@firebase/performance/dist/index.esm2017.js
  // /Users/.../node_modules/@firebase/util/dist/index.esm2017.js
  // /Users/.../node_modules/@firebase/logger/dist/index.esm2017.js
  // /Users/.../node_modules/@firebase/component/dist/index.esm2017.js
  // /Users/.../node_modules/@firebase/installations/dist/index.esm2017.js
  // /Users/.../node_modules/firebase/auth/dist/index.esm.js
  // /Users/.../node_modules/@firebase/auth/dist/esm2017/index.js
  // /Users/.../node_modules/@firebase/firestore/dist/exp/index.browser.esm2017.js
  // /Users/.../node_modules/@firebase/auth/dist/esm2017/index-2cb9d3c8.js
  // /Users/.../node_modules/tslib/tslib.es6.js
  // /Users/.../node_modules/idb/lib/idb.mjs
  // /Users/.../node_modules/@firebase/webchannel-wrapper/dist/index.esm2017.js
  //
  /\/node_modules\/@?(firebase\/auth)\//,
  /\/node_modules\/@?(firebase\/firestore)\//,
  /\/node_modules\/@?(firebase\/performance)\//,
    //
  /\/node_modules\/@?(firebase)\//,   // catch all of Firebase (keep AFTER the specific matches)

  /\/node_modules\/(tslib)\//,
  [/\/node_modules\/idb\//, undefined, 'firebase-performance']    // used by firebase-performance only (pack together)
];

export {
  manualChunks
}
