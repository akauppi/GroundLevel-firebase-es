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

  const SERVE_PORT = BUILD ? null : (process.env["PORT"] || fail("Missing 'PORT' env.var."));

  // Note: If you wish to read '.env' files, see -> https://vitejs.dev/config/#environment-variables
  //
  //    They are considered for 'import.meta.env.VITE_...' (in browser) automatically.

  const DEV_MODE = (mode === 'production') ? null :
    (mode === 'dev_local') ? 'local' : (mode === 'dev_online') ? 'online' : fail(`Unexpected mode: ${mode}`);
  const PROD = !DEV_MODE;

  /*
  * Chunk visualizer for production builds.
  */
  const visualizer = (BUILD && PROD) && await (import("rollup-plugin-visualizer")).then( mod => mod.visualizer );

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

        plugins: [ ... BUILD ? [
          // Visualizer is an add-on brought in the 'docker-compose.yml' ('build' target). https://github.com/btd/rollup-plugin-visualizer
          //
          visualizer({    // Provided in the 'tools/vite.dc' Docker image
            //filename: './stats.html',
            sourcemap: true,
            template: 'sunburst',
            brotliSize: true
          })
        ] : []]
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

    server: {
      // Allows viewing from other devices, eg. a tablet.
      host: true,
      strictPort: true,

      ...(SERVE_PORT ? {   // for production, just for debugging
        port: SERVE_PORT
      } : {})
    },

    // Clearing the screen is considered distracting, though one can PgUp to see what was there just prior to Vite launching.
    clearScreen: false
  }
}

function fail(msg) { throw new Error(msg) }

export default configGen
