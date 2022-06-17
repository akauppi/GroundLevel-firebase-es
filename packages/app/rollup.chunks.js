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

    // Moved here, to avoid a "Generated an empty chunk" warning.
    /\/deps_build-.{8}\/vue\.js$/
  ],

  // Note:
  //    Since Vite 3.0.0-alpha.{3..7}, these are based on '/work/tmp/.vite/depsBuild' (and not 'node_modules').
  //    Since 3.0.0-alpha.8, they are under 'deps_build'

  // Vue.js
  //
  //  /work/tmp/.vite/deps_build-.../vue.js
  //  /work/tmp/.vite/deps_build-.../vue-router.js
  //
  //"vue": /\/deps_build\/vue\.js$/,     // causes "Generated an empty chunk: "vue""
  "vue-router": /\/deps_build-.{8}\/vue-router\.js$/,

  // Firebase
  //
  //  /work/tmp/.vite/deps_build-.../@firebase_app.js
  //  /work/tmp/.vite/deps_build-.../@firebase_performance.js
  //  /work/tmp/.vite/deps_build-.../@firebase_auth.js
  //  /work/tmp/.vite/deps_build-.../@firebase_firestore.js
  //
  "firebase-app": /\/deps_build-.{8}\/@firebase_app\.js$/,      // just 0.03 kB
  "firebase-auth": /\/deps_build-.{8}\/@firebase_auth\.js$/,    // just 0.03 kB
  "firebase-database": /\/deps_build-.{8}\/@firebase_database\.js$/,
  "firebase-firestore": /\/deps_build-.{8}\/@firebase_firestore\.js$/,
  "firebase-performance": /\/deps_build-.{8}\/@firebase_performance\.js$/,

  // ??? What are these (started showing up past Vite 3.0.0-alpha.2):
  //
  //  /work/tmp/.vite/deps_build-.../chunk-LYCR3OCH.js?v=158f2df3
  //  /work/tmp/.vite/deps_build-.../chunk-JC4IRQUL.js?v=158f2df3
  //  /work/tmp/.vite/deps_build-.../chunk-UWFB6V5R.js?v=158f2df3
  //  /work/tmp/.vite/deps_build-.../chunk-YY36X6P6.js?v=158f2df3
  //  /work/tmp/.vite/deps_build-.../chunk-XNLT5KZI.js?v=158f2df3
  //
  "mystery": /\/deps_build-.{8}\/chunk-[A-Z0-9]{8}\.js/,

  // Plausible
  //
  //  /work/tmp/.vite/deps_build-.../plausible-tracker.js
  //
  "plausible": /\/deps_build-.{8}\/plausible-tracker\.js$/,

  // Sentry
  //
  //  /work/tmp/.vite/deps_build-.../@sentry_browser.js
  //  /work/tmp/.vite/deps_build-.../@sentry_tracing.js
  //
  "sentry-browser": /\/deps_build-.{8}\/@sentry_browser\.js$/,
  "sentry-tracing": /\/deps_build-.{8}\/@sentry_tracing\.js$/,

  // Auth UI component
  //
  //  /work/tmp/.vite/deps_build-.../aside-keys.js
  //
  "aside-keys": /\/deps_build-.{8}\/aside-keys\.js$/,

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
