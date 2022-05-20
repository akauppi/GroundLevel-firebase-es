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
  "": [
    /\/app\/src\//,

    // vite/preload-helper
    /^vite\/preload-helper$/,      // Vite runtime (small, ~600b)

    // plugin-vue:export-helper
    /^plugin-vue:export-helper/,  // very small, ~180b

    // TypeScript runtime
    /\/node_modules\/tslib\//,    // needed by Firebase and Sentry (15.2k)
  ],

  "vue": /\/node_modules\/@?vue\//,
  "vue-router": /\/node_modules\/vue-router\//,
  "aside-keys": /\/node_modules\/aside-keys\//,

  // Firebase
  //
  // @firebase/{auth|firestore|app|util|logger|component|webchannel-wrapper}
  "firebase-auth": /\/node_modules\/@firebase\/auth\//,
  "firebase": [
    /\/node_modules\/@firebase\/(?:app|util|logger|component)\//,
    /\/node_modules\/idb\//     // needed by '@firebase/{app|installations|messaging}' (place in the same chunk) (9.89k)
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

  // There should not be others. Production builds (where this code is involved) are banned with 'npm link'ed or
  // 'file://') 'aside-keys'.
};

export { manualChunks };
