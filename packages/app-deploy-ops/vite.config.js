// vite.config.js
//

// Help Rollup in packaging (deploy & ops)
//
// Want:
//  - 'init/**' as 'init'
//  - 'index.html'
//  - dependencies in their own, nice cubicles
//
// References:
//    -> https://rollupjs.org/guide/en/#outputmanualchunks
//
function manualChunks(id) {

  // ID's that flow through:
  //
  //  /Users/.../app-deploy-ops/index.html
  //  /Users/.../app-deploy-ops/index.html?html-proxy&index=0.js
  //  /Users/.../app-deploy-ops/init/main.js
  //    ...
  //  /Users/.../app-deploy-ops/node_modules/firebase/app/dist/index.esm.js
  //  /Users/.../app-deploy-ops/node_modules/@firebase/auth/dist/auth.esm.js
  //    ...
  //  /Users/.../app/vitebox/dist/app.es.js
  //  vite/preload-helper
  //    ...
  //  /Users/.../app/vitebox/dist/vue.js
  //
  console.debug(`Chunking (ID): ${id}`);

  // Guard: Firebase should come from us; not the app
  //
  if (id.match( /\/app\/.+\/firebase\.js$/ )) {
    throw new Error(`No. We don't want to see this: ${id}`);
  }

  let name;
  for( const x of chunkTo ) {
    const [re,s] = x instanceof RegExp ? [x,"ops"] : x;

    const tmp = id.match(re);   // [_, capture] | null
    if (tmp) {
      name = tmp[1] ? tmp[1].replace('/','-') : s;
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

// Regex's for grouping the chunks. If there is a capture group, that is used for the name. Otherwise, the default
// chunk or a replacement name.
//
// Note: Unlike the chunking in 'app', we wish to be able to do renaming here.
//
const chunkTo = [     // Array of (Regex | [Regex, string])
  /\/index\.html/,    // index.html, index.html?html-proxy&index=0.js
  /\/init\//,

  /^(vite)\//,      // Vite runtime

  // Libraries that come with the app
  //
  /\/app\/.+\/(.+?)\.js$/,    // app.es, vue, vue-router, ...

  // Libraries
  //
  // Place Firebase libraries in small pieces. This helps us see their respective sizes.
  //
  // /\/node_modules\/(firebase)/,
  /\/node_modules\/(tslib)\//,                // used only by Firebase
  /\/node_modules\/(idb)\//,                  // used by Firebase performance
  /\/node_modules\/@(firebase\/auth)\//,
  /\/node_modules\/@(firebase\/firestore)\//,
  /\/node_modules\/@(firebase\/functions)\//,
  /\/node_modules\/@(firebase\/performance)\//,

  [/\/node_modules\/@firebase\/(?:installations|component|logger|util|webchannel-wrapper)\//, 'firebase-misc'],
];

export default {
  build: {
    // Note: We use 'public' as the output directory (not the way Vite does, which is input of static assets).
    //    To avoid confusing Vite, 'publicDir' is set to a non-existing directory name.
    outDir: "public",
    publicDir: "nosuch",

    rollupOptions: {
      output: { manualChunks }
    },

    minify: true,
    target: 'esnext',   // assumes native dynamic imports
    //polyfillDynamicImport: false
  },

  clearScreen: false    // having it here doesn't matter
}
