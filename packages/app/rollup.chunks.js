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

  // Vite 3.0.0-alpha.1 has an '\0' prepended ahead of "vite/preload-helper" (2.9.9 did not have that).
  //
  // Keep this while we check whether that's intentional, or a glitch.
  //
  //if (id.includes("vite")) { console.log("!!!YAY", id, Array.from(id)) }    // DEBUG (remove #later)

  if (id === "\0vite/preload-helper") {
    return manualChunks(id.substring(1))
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
// Note: Vite 3.0.0-alpha.7 (something after 'alpha.2') changed the chunking.
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
  //  vite/preload-helper
  //  plugin-vue:export-helper
  //
  "": [
    /^\/work\/prod\//,
    /^\/work\/firebase\.config\.js$/,
    /^\/work\/src\//,

    /^vite\/preload-helper$/,       // Vite runtime (small, ~600b)
    /^vite\/modulepreload-polyfill$/,
    /^plugin-vue:export-helper$/,    // very small, ~180b
  ],

  // Vue.js
  //
  //  /work/node_modules/vue/dist/vue.runtime.esm-bundler.js
  //  /work/node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js
  //  /work/node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
  //  /work/node_modules/@vue/devtools-api/lib/esm/api/api.js
  //  /work/node_modules/vue-router/dist/vue-router.esm-bundler.js
  //
  "vue": /\/node_modules\/@?vue\//,
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
  //  /work/node_modules/idb/build/index.js   # used by Firebase app and performance
  //
  "firebase-auth": /\/node_modules\/@firebase\/auth\//,
  "firebase-database": /\/node_modules\/@firebase\/database\//,
  "firebase-firestore": /\/node_modules\/@firebase\/firestore\//,
  "firebase-performance": /\/node_modules\/@firebase\/performance\//,
  "firebase": [
    /\/node_modules\/@firebase\/(?:app|util|logger|component|installations|webchannel-wrapper)\//,
    /\/node_modules\/idb\//,
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

/*** OLD Vite 3.0.0-alpha.2 :
const chunkTo = {     // Map of string -> (Regex | Array of Regex)

  // default chunk; application itself and small stuff
  "": [
    /^\/work\/src\//,

    // /work/prod/index.html
    // /work/prod/index.html?html-proxy&index=0.js
    // /work/prod/main.js
    // /work/firebase.config.js
    /^\/work\/prod\//,
    /^\/work\/firebase\.config\.js$/,

    // vite/preload-helper
    // vite/modulepreload-polyfill
    /^vite\/preload-helper$/,      // Vite runtime (small, ~600b)
    /^vite\/modulepreload-polyfill$/,

    // plugin-vue:export-helper
    /^plugin-vue:export-helper/,  // very small, ~180b
  ],

  "vue": /\/node_modules\/@?vue\//,
  "vue-router": /\/node_modules\/vue-router\//,
  "aside-keys": /\/node_modules\/aside-keys\//,

  // Firebase
  //
  // @firebase/{auth|firestore|app|util|logger|component|webchannel-wrapper|performance}
  "firebase-auth": /\/node_modules\/@firebase\/auth\//,
  "firebase": [
    /\/node_modules\/@firebase\/(?:app|util|logger|component)\//,
    /\/node_modules\/idb\//     // needed by '@firebase/{app|installations|messaging}' (place in the same chunk) (9.89k)
  ],
  "firebase-performance": [
    /\/node_modules\/@firebase\/performance\//,
    /\/node_modules\/@firebase\/installations\//,   // only used by '@firebase/performance' (so place in same chunk) (36.9k)
  ],
  "firebase-firestore": [
    /\/node_modules\/@firebase\/firestore\//,
    /\/node_modules\/@firebase\/webchannel-wrapper\//,
  ],

  // Sentry
  //
  // @sentry/{browser|tracing|core|utils|hub|minimal|types}
  "sentry-browser": /\/node_modules\/@sentry\/browser\//,
  "sentry-tracing": /\/node_modules\/@(sentry\/tracing)\//,

  "sentry": /\/node_modules\/@sentry\/(?:core|utils|hub|minimal|types)\//,    // Note: 'minimal' is no more in Sentry 7.x

  // TypeScript runtime
  //
  // NOTE: Seems important that this is placed in its own chunk (had it in the app chunk).
  //
  "tslib": /\/node_modules\/tslib\//,    // needed by Firebase and Sentry (15.2k)

  // There should not be others. Production builds (where this code is involved) are banned with 'npm link'ed or
  // 'file://') 'aside-keys'.
};
***/

export { manualChunks };
