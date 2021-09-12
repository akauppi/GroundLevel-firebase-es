//
// vite.config.js
//
// Two modes:
//  - for 'npm run dev:...', compile on-the-fly and use files from 'vitebox'
//  - for 'npm run build', stay in the main folder
//
import path, { dirname, join as pJoin } from 'path'
import { readdirSync, statSync } from 'fs'
import { fileURLToPath } from 'url'

import vue from '@vitejs/plugin-vue'

const myPath = dirname(fileURLToPath(import.meta.url))
const srcPath = pJoin(myPath, 'src');

const DEV = process.env["NODE_ENV"] !== "production";
  //
  // true:  hosting, on-the-fly 🪰
  // false: building for shipment; 'dist/'; no 'vitebox' files are needed!! 🚢

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
* Map '@ops/goo' to 'vitebox/ops/goo.js' (for 'npm run dev:...' only!)
*/
const opsAliases_DEV = DEV && (() => {
  const opsPath = pJoin(myPath, 'vitebox/ops');

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

  ...(DEV ? {    // 'npm run dev:{local|online}'
    // Decides where 'index.html' is (and root for other dir configs)
    root: 'vitebox',
    envDir: '..',     // actual 'app' dir

    // With 2.4.x, this was a way to point up from 'vitebox', but creates lots of warnings on 2.5.6:
    //  <<
    //    files in the public directory are served at the root path.
    //    Instead of /@vite/client, use /@vite/client.
    //  <<
    //
    // ..so replaced with a symbolic link from 'vitebox/public' -> '../public'.
    //
    //publicDir: '../public'    // relative to 'vitebox'
  } : {
    // regular root
  }),

  resolve: {
    alias: { ...subAliases,
      '/@': srcPath,
      ...(opsAliases_DEV || {}),
    },

    // Let's stick to *only* 'module' for a while; this can be completely removed once we know things are stable.
    //
    // Until Firebase 9.0.0-beta.1, we needed to override the 'mainFields' (since 'auth' was not providing a "module"
    // field). Now the Vite defaults are fine.
    //
    // With 9.0.0-beta.1, '@firebase/...' packaging varies from subpackage to subpackage, but they all now carry "module"
    // which is enough (and part of Vite default 'resolve.mainFields' list).
    //
    // With 9.0.0-beta.7, auth started working when this setting was disabled.
    //
    //mainFields: ["module"]    // KEEP for a while
  },

  // Means to pass build time values to the browser
  //
  // Note: IF using in production, one needs to provide eg. the quotes, since it's a literal replace. This makes sense
  //    for using the mechanism as a macro (to inject code). Not so nice for strings.
  //
  define: {
    "_VERSION": "\"0.0.0\""
  },

  build: {
    ...(!DEV ? {
      //outDir: "dist"    // also the default (relative to 'app' folder)
    }:{}),

    minify: false,
    sourcemap: true,    // "generate production source maps"    tbd. do we need them for local development (or does Vite always provide them?); does ops create them, anyways?
    target: 'esnext',   // assumes native dynamic imports (default for Vite 2.3.0+)
    //polyfillDynamicImport: false

    // Expose the code side, with a predictable export path.
    lib: {
      entry: path.resolve(srcPath, 'app.js'),
      formats: ['es']   // internal use only (ESM; no 'name' field needed)
    },

    rollupOptions: {
      external: [
        /^@?firebase\//,    // don't try packing these - 'app-deploy-ops' provides them (of the same version)
        //"/favicon.png"
        ...(DEV ? [] : ['@ops/central', '@ops/perf'])
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

  server: {
    // Vite 2.3.1 (still in 2.4.4): "The fsServe restrictions are going to be enabled by default in a future version."
    //    -> https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#231-2021-05-12
    fs: {
      strict: true    // restrict access to the work directory
    },

    // Allows viewing from other devices, eg. a tablet.
    host: true
  },

  // Clearing the screen is considered distracting, though one can PgUp to see what was there just prior to Vite launching.
  clearScreen: false
}
