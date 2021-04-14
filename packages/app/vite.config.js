// vite.config.js
//
import path, { dirname, join as pJoin } from 'path'
import { readdirSync, statSync } from 'fs'
import { fileURLToPath } from 'url'

import vue from '@vitejs/plugin-vue'

const myPath = dirname(fileURLToPath(import.meta.url))
const srcPath = pJoin(myPath, 'src');
const opsPath = pJoin(myPath, 'vitebox/ops');
const fakePath = pJoin(myPath, 'vitebox/fake');

const DEV_MODE = !! process.env.GCLOUD_PROJECT;

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
  const pairs = getSubDirsSync(srcPath).map( s => {
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

/*
* Each file in 'opsPath' gets its own alias (eg. '@ops/central' -> '<root>/vitebox/ops/central.js')
*/
const opsAliases = (() => {
  const pairs = readdirSync(opsPath).map( s => {    // e.g. 'central.js'
    const [_,c1] = s.match(/(.+)\.js$/) || [];    // pick
    if (c1) {
      const tmp = path.resolve(opsPath, s);
      return [`@ops/${c1}`, tmp];
    }
  }).filter( x => x !== undefined ); // Array of ['@ops/...', '...path...']

  return Object.fromEntries(pairs);
})();

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

// Regex's for grouping the chunks.
//
const chunkTo = [     // Array of Regex
  // /Users/.../app/src/app.js    # ..and others
  //
  /\/app\/src\//,

  // vite/preload-helper
  /^vite\/preload-helper$/,      // Vite runtime (small, ~600b)

  /\/node_modules\/@?(vue)\//,
  /\/node_modules\/(vue-router)\//,
  /\/node_modules\/(aside-keys)\//,

  // There should not be others. Production builds (where this code is involved) are banned with 'npm link'ed 'aside-keys';
  // Firebase is marked as a peer dependency, and provided by the upper level.
];

export default {
  root: 'vitebox',

  resolve: {
    alias: { ...subAliases,
      '/@': srcPath,
      ...opsAliases,

      // Redirect '@firebase/performance' if we don't have a real, online project to work against.
      ...(DEV_MODE ? { '@firebase/performance': fakePath + '/@firebase-performance' } : {})
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
    "_VERSION": "\"0.0.0\""
  },

  build: {
    // tbd. Is minification required? Ops build will do it for us, right?
    //minify: true,
    minify: false,
    sourcemap: true,    // "generate production source maps"    tbd. do we need them for local development (or does Vite always provide them?); does ops create them, anyways?
    target: 'esnext',   // assumes native dynamic imports
    //polyfillDynamicImport: false

    // Expose the code side, with a predictable export path.
    lib: {
      entry: path.resolve(srcPath, 'app.js'),
      formats: ['es']   // internal use only (ESM; no 'name' field needed)
    },

    rollupOptions: {
      external: [
        /^@?firebase\//,    // don't try packing these - we've made them 'peerDependency'
        //"/favicon.png"
        ...Object.keys(opsAliases)    // "@ops/central" et.al.
      ],
      output: { manualChunks }
    },

    // Note:
    //    Documentation says 'true' would have: "..CSS imported in async chunks will be inlined into the async chunk
    //    itself and inserted when the chunk is loaded."
    //
    //    This is not so (Vite 2.0.5). Why is 'app.css' there, then? (expecting the CSS to be baked into .js)
    //
    //cssCodeSplit: true,   // true: creates 'app.css'
    cssCodeSplit: false,   // false: creates 'style.css'
  },

  plugins: [
    vue({ template: { compilerOptions: {
      isCustomElement: tag => tag.includes('-') && !forcedVueComponents.has(tag)
    }}})
  ],

  // This doesn't cut it, from config file (vite 2.0.0-beta.52). Using it as command line parameter does. Weird.
  clearScreen: false
}
