//
// vite.config.js
//
// Two modes:
//  - for 'npm run dev{|:local|:online}', compile on-the-fly and use files from 'vitebox'
//  - for 'npm run build', use ... (tbd. production!!!)
//
import path, { dirname, join as pJoin } from 'path'
import { readdirSync, statSync } from 'fs'
import { fileURLToPath } from 'url'

import vue from '@vitejs/plugin-vue'

const myPath = dirname(fileURLToPath(import.meta.url))
const srcPath = pJoin(myPath, 'src');

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

// Help Rollup in packaging.
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

function configGen({ _ /*command*/, mode }) {
  //console.log("!!!", {command, mode});    // "serve"|"build", "dev_local"|"development"|"production"

  const DEV_MODE = (mode === 'production') ? null :
    (mode === 'dev_local' && 'local') || (mode === 'dev_online' && 'online') || fail(`Unexpected mode: ${mode}`);

  return {
    ...(DEV_MODE ? {    // 'npm run dev:{local|online}'
      // Decides where 'index.html' is (and root for other dir configs)
      root: 'vitebox',
      envDir: '..',     // actual 'app' dir

      cacheDir: '/tmp/.vite',   // so 'node_modules' remains read-only

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

    css: {
      devSourceMap: true    // experimental feature of Vite 2.9
    },

    esbuild: false,   // "set to 'false' to disable esbuild transforms."    // (then, why do we have 'esbuild', at all?? tbd.)

    resolve: {
      alias: {
        ...subAliases,
        '/@': srcPath
      }
    },

    build: {
      ...(!DEV_MODE ? {
        outDir: "dist"    // also the default (relative to 'app' folder)
      } : {}),

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
        output: {manualChunks}
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
      vue({
        template: {
          compilerOptions: {
            isCustomElement: tag => tag.includes('-') && !forcedVueComponents.has(tag)
          }
        }
      })
    ],

    server: {
      port: DEV_MODE !== 'online' ? 3000:3001,
      strictPort: true,

      // Allows viewing from other devices, eg. a tablet.
      host: true
    },

    // Clearing the screen is considered distracting, though one can PgUp to see what was there just prior to Vite launching.
    clearScreen: false
  }
}

function fail(msg) { throw new Error(msg) }

export default configGen
