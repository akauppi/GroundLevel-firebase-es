//
// vite.config.js
//
// Note:
//    This is run _only within DC_ environment.
//
// Two modes:
//  - for 'npm run dev{|:local|:online}', compile on-the-fly and use files from 'dev'
//  - for 'npm run build', use ... (tbd. production!!!)
//
import path, { dirname, join as pJoin } from 'path'
import { readdirSync, statSync } from 'fs'
import { fileURLToPath } from 'url'

import vue from '@vitejs/plugin-vue'

import { manualChunks } from './rollup.chunks.js'

const myPath = dirname(fileURLToPath(import.meta.url))
const srcPath = pJoin(myPath, 'src');

// CI may skip the visualizer
//
const NO_VISUALIZER = process.env["VITE_VISUALIZER"] === "false";

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

/**
 * @return {import('vite').UserConfig}
 */
async function configGen({ command, mode }) {
  //console.log("!!!", {command, mode});    // "serve"|"build", "dev_local"|"dev_online"|"production"

  const BUILD = command === "build";
  const SERVE_PORT = BUILD ? null : process.env["PORT"] || fail("Missing 'PORT' env.var.");

  // Note: If you wish to read '.env' files, see -> https://vitejs.dev/config/#environment-variables
  //
  //    They are considered for 'import.meta.env.VITE_...' (in browser) automatically.

  const DEV_MODE = (mode === 'production') ? null :
    (mode === 'dev_local') ? 'local' : (mode === 'dev_online') ? 'online' : fail(`Unexpected mode: ${mode}`);
  const PROD = !DEV_MODE;

  /*
  * Chunk visualizer for manually made production builds.
  *
  * Note: uses an add-on brought in 'build-extras' Docker target. https://github.com/btd/rollup-plugin-visualizer
  */
  const visualizer =
    (BUILD && PROD && !NO_VISUALIZER) ? await (import("rollup-plugin-visualizer")).then( mod => mod.visualizer({    // Provided in the 'tools/vite.dc' Docker image
      //filename: './stats.html',
      sourcemap: true,
      template: 'sunburst',
      brotliSize: true
    })) : undefined;

  return {
    ...(DEV_MODE ? {    // 'npm run dev:{local|online}'
      // Decides where 'index.html' is (and root for other dir configs)
      root: 'dev',
      envDir: '..',     // actual 'app' dir (DC has '.env' there)

      cacheDir: '../tmp/.vite',  // so 'node_modules' remains read-only (also persists the cache)

      // "Files in this directory are served as '/' during dev"
      publicDir: false

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
      // Production
      root: 'prod',
      envDir: '..',     // actual 'app' dir

      cacheDir: '../tmp/.vite',     // tbd. to not use the development caches, set to '/tmp/.vite' or '../tmp/.vite.prod'
    }),

    css: {
      devSourceMap: true    // experimental feature of Vite 2.9
    },

    esbuild: false,   // "set to 'false' to disable esbuild transforms."    // (then, why do we have 'esbuild', at all?? tbd.)

    resolve: {
      alias: {
        ...subAliases,
        '/@': srcPath,

        ...(PROD ? {
          '/@firebase.config.json': `${myPath}/firebase.config.js`   // DC maps this
        }: {})

        // EXP Counteracting this:
        //  <<
        //    $ npm run dev
        //      ...
        //      Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'vite' imported from /work/node_modules/@vitejs/plugin-vue/dist/index.mjs
        //  <<
        //
        //!!! 'vite': `${ process.env["NODE_PATH"] }/vite`
      }
    },

    build: PROD ? {
      minify: false,
      sourcemap: true,    // "generate production source maps"    tbd. do we need them for local development (or does Vite always provide them?); does ops create them, anyways?
      target: 'esnext',   // assumes native dynamic imports (default for Vite 2.3.0+)
      //polyfillDynamicImport: false

      outDir: "../dist",
      emptyOutDir: true,
      assetsDir: '.',   // relative to 'outDir'

      rollupOptions: {
        output: {manualChunks},
        plugins: [ ... visualizer ? [ visualizer ] : [] ]
      },

      // Note:
      //    Documentation says 'true' would have: "..CSS imported in async chunks will be inlined into the async chunk
      //    itself and inserted when the chunk is loaded."
      //
      //    This is not so (Vite 2.0.5). Why is 'app.css' there, then? (expecting the CSS to be baked into .js)
      //
      //cssCodeSplit: true,   // true: creates 'app.css'
      cssCodeSplit: false,   // false: creates 'style.css'
    } : {},

    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: tag => tag.includes('-') && !forcedVueComponents.has(tag)
          }
        }
      })
    ],

    server: SERVE_PORT ? {
      host: true,   // needed for the DC port mapping to work
      strictPort: true,
      port: SERVE_PORT
    } : undefined,

    // Clearing the screen is considered distracting, though one can PgUp to see what was there just prior to Vite launching.
    clearScreen: false
  }
}

function fail(msg) { throw new Error(msg) }

// Note: Adding 'optimizeDeps: { disabled: false }' causes the set of manual chunks to change (it was like that in 3.0
//    alphas and betas):
//    <<
//      Unexpected dependency found (not mapped in 'manualChunks'): /work/tmp/.vite/deps_build-645163e3/@firebase_app.js
//      Unexpected dependency found (not mapped in 'manualChunks'): /work/tmp/.vite/deps_build-645163e3/@firebase_performance.js
//      Unexpected dependency found (not mapped in 'manualChunks'): /work/tmp/.vite/deps_build-645163e3/vue.js
//      Unexpected dependency found (not mapped in 'manualChunks'): /work/tmp/.vite/deps_build-645163e3/@firebase_auth.js
//      Unexpected dependency found (not mapped in 'manualChunks'): /work/tmp/.vite/deps_build-645163e3/aside-keys.js
//      Unexpected dependency found (not mapped in 'manualChunks'): /work/tmp/.vite/deps_build-645163e3/@sentry_browser.js
//      Unexpected dependency found (not mapped in 'manualChunks'): /work/tmp/.vite/deps_build-645163e3/@sentry_tracing.js
//      Unexpected dependency found (not mapped in 'manualChunks'): /work/tmp/.vite/deps_build-645163e3/plausible-tracker.js
//      Unexpected dependency found (not mapped in 'manualChunks'): /work/tmp/.vite/deps_build-645163e3/vue-router.js
//      Unexpected dependency found (not mapped in 'manualChunks'): /work/tmp/.vite/deps_build-645163e3/@firebase_firestore.js
//      Unexpected dependency found (not mapped in 'manualChunks'): /work/tmp/.vite/deps_build-645163e3/@firebase_database.js
//      Unexpected dependency found (not mapped in 'manualChunks'): /work/tmp/.vite/deps_build-645163e3/chunk-XSOXVSLP.js?v=29a23a98
//      Unexpected dependency found (not mapped in 'manualChunks'): /work/tmp/.vite/deps_build-645163e3/chunk-JC4IRQUL.js?v=29a23a98
//      Unexpected dependency found (not mapped in 'manualChunks'): /work/tmp/.vite/deps_build-645163e3/chunk-2TWQDNTD.js?v=29a23a98
//      Unexpected dependency found (not mapped in 'manualChunks'): /work/tmp/.vite/deps_build-645163e3/chunk-4FQYRAM2.js?v=29a23a98
//      Unexpected dependency found (not mapped in 'manualChunks'): /work/tmp/.vite/deps_build-645163e3/chunk-LL3PPPOH.js?v=29a23a98
//    <<
//
//    We don't necessarily want that. Revisit if it becomes default in Vite 4.
/*
export default a => configGen(a).then( o => ({ ...o,

  // Extras because we don't need CommonJS dependencies.
  // See -> https://vitejs.dev/guide/migration.html#experimental
  //
  optimizeDeps: { disabled: false },
  build: { ...o.build, commonjsOptions: { include: [] }}
}))
*/

export default configGen
