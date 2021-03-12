// vite.config.js
//
import path, { join as pJoin, dirname as pDirname } from 'path'
import { readdirSync, statSync } from 'fs'
import { fileURLToPath } from 'url'

import vue from '@vitejs/plugin-vue'

const srcPath = pJoin( pDirname(fileURLToPath(import.meta.url)), 'src');

/*
* For an absolute path 'p', provide the immediate subdirectories within it.
*/
function getSubDirsSync(p) {    // (path-string) -> Array of string
  return readdirSync(p).filter( function (x) {
    return statSync(pJoin(p,x)).isDirectory();   // note: seems '.isDirectory' might need an absolute path (did not try without)
  });
}

/*
* Each subdir of 'srcPath' gets its own alias (eg. '/@auth' -> '<root>/src/auth/')
*/
const subAliases = (() => {
  const pairs = getSubDirsSync(srcPath).map( s => {   // [string,path-string]
    const tmp = path.resolve(srcPath, s);
    return [`/@${s}`, tmp];
  });

  return Object.fromEntries(pairs);
})();

// Naming pattern we use for Vue vs. web components:
//  - 'router-[view|link]' must be treated as Vue components (comes from a library)
//  - 'any-thing' are web components (they seem to follow that pattern, always)
//  - 'ThisThing' are our self-made Vue components
//
const forcedVueComponents = new Set([
  "router-view",
  "router-link"
]);

// Help Rollup in packaging.
//
// Want:
//  - 'init/**' as 'init' (only for development; ops replaces with its own)
//  - application in main chunk
//  - dependencies in their own, nice cubicles
//
// References:
//    -> https://rollupjs.org/guide/en/#outputmanualchunks
//
function manualChunks(id) {
  let name;
  for( const x of chunkTo ) {
    const [re,s] = Array.isArray(x) ? x : [x,"default"];    // 's' is the name override (if no capture block)
      //
      // ^-- note: default name doesn't get applied (vite uses "app" instead); don't know why..

    const tmp = id.match(re);   // [_, capture] | null
    if (tmp) {
      name = (tmp[1] || s).replace('/','-');    // flattening output names ('/'->'-') is just for us humans
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

// Regex's for grouping the chunks. If there is a capture group, that is used for the name. Otherwise, explicit name or
// "default".
//
const chunkTo = [     // Array of Regex
  // /Users/.../app/src/app.js    # ..and others
  //
  /\/app\/src\//,

  // vite/preload-helper
  /^vite\/preload-helper$/,      // Vite runtime (small, ~600b)

  // /Users/.../node_modules/vue/dist/vue.runtime.esm-bundler.js
  // /Users/.../node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js
  // /Users/.../node_modules/vue-router/dist/vue-router.esm-bundler.js
  // /Users/.../node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
  // /Users/.../node_modules/@vue/shared/dist/shared.esm-bundler.js
  // /Users/.../node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
  //
  /\/node_modules\/@?(vue)\//,
  /\/node_modules\/(vue-router)\//,

  // Dependencies, when brought from npm registry (no 'npm link'):
  //
  // /Users/.../app/node_modules/aside-keys/dist/bundle.js
  //
  /\/node_modules\/(aside-keys)\//,

  // ORDER MATTERS: keep this ABOVE the app's own library handling.
  //
  // Dependencies (DEVELOPMENT ONLY!), when brought in via 'npm link'. It doesn't matter how we name these, since they
  // will not be there for production builds.
  //
  // /Users/.../packages/aside-keys/dist/bundle.js
  // /Users/.../packages/aside-keys/node_modules/firebase/auth/dist/index.esm.js
  // /Users/.../packages/aside-keys/node_modules/@firebase/auth/dist/esm5/index.js
  // /Users/.../packages/aside-keys/node_modules/@firebase/app/dist/index.esm5.js
  // /Users/.../packages/aside-keys/node_modules/tslib/tslib.es6.js
  // /Users/.../packages/aside-keys/node_modules/@firebase/util/dist/index.esm.js
  // /Users/.../packages/aside-keys/node_modules/@firebase/auth/dist/esm5/index-392613a3.js
  // /Users/.../packages/aside-keys/node_modules/@firebase/logger/dist/index.esm.js
  // /Users/.../packages/aside-keys/node_modules/@firebase/component/dist/index.esm.js
  //
  /\/packages\/(aside-keys)\/(?!node_modules)/,     // aside itself - the library
  [/\/packages\/aside-keys\/node_modules\/(@?firebase|tslib)\//, 'aside-keys-npm-linked-deps-dev-only'],

  // NOTE:
  //  'firebase/performance' (that we want to leak to 'app-deploy-ops') is "51.69kb / brotli: 8.50kb".
  //  IF we build it as a separate chunk, app-deploy-ops build chokes in a circular dependency (this MAY or may not
  //    be a Firebase @exp (0.900.15) packaging bug???)
  //  MERGING WORKS!!! 🥁🤹‍️🎪🌋🎉

  // Pack some packages separately:
  //  - auth to see its size implication (will be needed always)
  //  - firestore also because it can be lazy loaded (needed only after authentication)
  //
  ///\/node_modules\/@?(firebase)\/(?!(auth|firestore|performance))/,   // misc firestore packages
  /\/node_modules\/@?(firebase)\/(?!(auth|firestore))/,   // misc firestore packages + performance
  /\/node_modules\/@?(firebase\/auth)\//,
  /\/node_modules\/@?(firebase\/firestore)\//,
    // firebase/{auth|app|firestore}
    // @firebase/{auth|app|firestore|util|logger|component|webchannel-wrapper|...}

  /\/node_modules\/(tslib)\//,    // used by Firebase, but place in its own chunk

  /*** disabled (unless we can solve the circular dependency??)
  // Things kept for the 'ops':
  //
  // /Users/.../app/node_modules/firebase/performance/dist/index.esm.js
  // /Users/.../app/node_modules/@firebase/performance/dist/index.esm.js
  // /Users/.../app/node_modules/idb/lib/idb.mjs       # used by 'firebase/performance', only
  //
  /\/node_modules\/@?(firebase\/performance)\//,
  [/\/node_modules\/idb\//, 'firebase-performance']
  ***/
];

export default {
  root: 'vitebox',

  resolve: {
    alias: { ...subAliases,
      '/@': srcPath
    },

    // We'd prefer all dependencies to use 'exports' but at least:
    //
    //  - Firebase (0.900.16) has "esm2017" (non-standard convention) for _some_ submodules ("module" for others):
    //    - "esm2017": auth, ...
    //    - "module": firestore, ...
    //
    // This makes sure we get the latest, instead of eg. Firebase "esm5" (which, by the way, is a misnomer - EcmaScript
    // modules came in ES6).
    //
    mainFields: ["esm2017", "module"]
  },

  // Means to pass build time values to the browser (in addition to '.env' files).
  //
  // Note: IF using in production, one needs to provide eg. the quotes, since it's a literal replace. This makes sense
  //    for using the mechanism as a macro (to inject code). Not so nice for strings.
  //
  define: {
    "_LOCAL_PROJECT": process.env.GCLOUD_PROJECT,   // only used by init (dev)
    "_VERSION": "\"0.0.0\""
  },

  build: {
    // tbd. Is minification required? Ops build will do it for us, right?
    //minify: true,
    minify: false,
    sourcemap: true,    // "generate production source maps"
    target: 'esnext',   // assumes native dynamic imports
    //polyfillDynamicImport: false

    // Expose the code side, with a predictable export path.
    lib: {
      entry: path.resolve(srcPath, 'app.js'),
      formats: ['es']   // internal use only (ESM; no 'name' field needed)
    },

    rollupOptions: {
      external: [
        "/favicon.png"
      ],
      output: { manualChunks }
    },

    //cssCodeSplit: false,    // false: "all CSS in the entire project will be extracted into a single CSS file"
    //chunkSizeWarningLimit: 800    // default: 500
  },

  plugins: [
    vue({ template: { compilerOptions: {
      isCustomElement: tag => tag.includes('-') && !forcedVueComponents.has(tag)
    }}})
  ],

  // This doesn't cut it, from config file (vite 2.0.0-beta.52). Using it as command line parameter does. Weird.
  clearScreen: false
}
