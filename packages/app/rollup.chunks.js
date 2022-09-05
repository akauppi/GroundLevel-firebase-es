//
// rollup.chunks.js
//
// Splitting (production) code to suitable chunks.
//
// Used by 'vite.config.js'. Simplifies that code to have this in a separate file.
//

// Want:
//  - application in main chunk
//  - dependencies in their own, nice cubicles
//
// References:
//    -> https://rollupjs.org/guide/en/#outputmanualchunks
//
function manualChunks(id) {
  let name;

  if (id.includes('/worker')) {
    fail("Not handling worker sources!");
  }

  for (const [k,rr] of Object.entries(chunkTo)) {   // ""|<chunk-name> -> Regex | Array of Regex
    const arr = Array.isArray(rr) ? rr:[rr];

    if (arr.some( re => id.match(re) )) {
      name = k || "app";
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

// Regex's for grouping the chunks
//
const chunkTo = {     // Map of string -> (Regex | Array of Regex)

  // default chunk; application itself and small stuff
  //
  //  /work/prod/index.html
  //  /work/prod/index.html?html-proxy&index=0.js
  //  /work/prod/main.js
  //  /work/firebase.config.js
  //  /work/src/app.js
  //    ...
  //  /work/src/App/pages/Home.guest.vue?vue&type=style&index=0&scoped=true&lang.css
  //    ...
  //  vite/modulepreload-polyfill
  //  \x00vite/preload-helper
  //
  "": [
    /^\/work\/prod\//,
    /^\/work\/firebase\.config\.js$/,
    /^\/work\/src\//,

    /^.vite\/preload-helper$/,       // note: '.' is for the '\x00'
    /^vite\/modulepreload-polyfill$/,
  ],

  // Vue.js
  //
  //  /work/node_modules/vue/dist/vue.runtime.esm-bundler.js
  //  /work/node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js
  //  /work/node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
  //  /work/node_modules/@vue/devtools-api/lib/esm/api/api.js
  //  /work/node_modules/vue-router/dist/vue-router.esm-bundler.js
  //  plugin-vue:export-helper
  //
  "vue": [
    /\/node_modules\/@?vue\//,
    /^.plugin-vue:export-helper$/,
  ],
  "vue-router": /\/node_modules\/vue-router\//,

  // Firebase
  //
  //  /work/node_modules/@firebase/app/dist/esm/index.esm2017.js
  //  /work/node_modules/@firebase/performance/dist/esm/index.esm2017.js
  //  /work/node_modules/@firebase/util/dist/index.esm2017.js
  //  /work/node_modules/@firebase/logger/dist/esm/index.esm2017.js
  //  /work/node_modules/@firebase/component/dist/esm/index.esm2017.js
  //  /work/node_modules/@firebase/installations/dist/esm/index.esm2017.js
  //  /work/node_modules/@firebase/auth/dist/esm2017/index.js
  //  /work/node_modules/@firebase/firestore/dist/index.esm2017.js
  //  /work/node_modules/@firebase/database/dist/index.esm2017.js
  //  /work/node_modules/@firebase/webchannel-wrapper/dist/index.esm2017.js
  //
  //  /work/node_modules/idb/build/index.js
  //
  "firebase-auth": /\/node_modules\/@firebase\/auth\//,
  //"firebase-database": /\/node_modules\/@firebase\/database\//,
  "firebase-firestore": [
    /\/node_modules\/@firebase\/firestore\//,
    /\/node_modules\/@firebase\/webchannel-wrapper\//,    // used by '@firebase/firestore'
  ],
  "firebase-performance": /\/node_modules\/@firebase\/performance\//,
  "firebase": [
    /\/node_modules\/@firebase\/(?:app|util|logger|component|installations)\//,
    /\/node_modules\/idb\//,      // needed by '@firebase/{app|installations|messaging}' (place in same chunk)
  ],

  // Plausible
  //
  //  /work/node_modules/plausible-tracker/build/module/index.js
  //  /work/node_modules/plausible-tracker/build/module/lib/tracker.js
  //
  "plausible": /\/node_modules\/plausible-tracker\//,

  // Sentry
  //
  //  /work/node_modules/@sentry/browser/esm/index.js
  //  /work/node_modules/@sentry/tracing/esm/index.js
  //  /work/node_modules/@sentry/hub/esm/index.js
  //  /work/node_modules/@sentry/utils/esm/buildPolyfills/index.js
  //  /work/node_modules/@sentry/core/esm/api.js
  //  /work/node_modules/@sentry/hub/esm/index.js
  //
  "sentry-browser": /\/node_modules\/@sentry\/browser\//,
  "sentry-tracing": /\/node_modules\/@sentry\/tracing\//,
  "sentry": /\/node_modules\/@sentry\/(?:core|utils|hub)\//,

  // Other
  //
  //  /work/node_modules/tslib/tslib.es6.js   # used by Firebase, but also Sentry
  //
  "tslib": /\/node_modules\/tslib\//,

  // Auth UI component
  //
  //  /work/node_modules/aside-keys/dist/bundle.js
  //
  "aside-keys": /\/node_modules\/aside-keys\//,

  // There should not be others. Production builds are banned with 'npm link'ed or 'file://') 'aside-keys'.
};

function fail(msg) { throw new Error(msg) }
export { manualChunks };
