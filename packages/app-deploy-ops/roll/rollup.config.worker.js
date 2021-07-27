/*
* Rollup config for building web worker(s)
*
* Imported by the main rollup config.
*/
import sizes from '@atomico/rollup-plugin-sizes'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

import {dirname} from 'path'
import {fileURLToPath} from 'url'

const myPath = dirname(fileURLToPath(import.meta.url));

const watch = process.env.ROLLUP_WATCH;

const loggingAdapterProxyHashes = [];   // [ esm_hash, iife_hash ]

const catchHashPlugin = (esm) => ({
  name: 'my-plugin',

  // Below, one can define hooks for various stages of the build.
  //
  generateBundle(_ /*options*/, bundle) {
    Object.keys(bundle).forEach( fileName => {
      // filename: "proxy.worker-520aaa52[.iife].js"
      //
      const [_,c1] = fileName.match(/^worker-([a-f0-9]+)(?:\.iife)?\.js$/) || [];
      if (c1) {
        loggingAdapterProxyHashes[esm?0:1] = c1;
        return;
      }
      console.warn("Unexpected (worker) bundle generated:", fileName);
    });
  }
});

const pluginsWorkerGen = (esm) => [
  resolve({
    //mainFields: ["esm2017", "module"],    // <-- no longer needed, right? (Firebase relic) #cleanup
    modulesOnly: true       // "inspect resolved files to assert that they are ES2015 modules"
  }),
  !watch && terser(),
  catchHashPlugin(esm),

  !watch && sizes(),
];

/*
* Create a Rollup config for building the proxy worker.
*
* Only Chromium-based browsers (Chrome, Edge, Opera) currently support modules as workers ('type: "module"') [1].
* However, the way our ESM build works (gathers all imports in the same chunk, does not use 'import' keyword) seems to
* work as-such also for Firefox (version 88 on macOS) and Safari (14.0.3 on macOS). IIFE production is not used, since
* not needed, but kept for the day it might.
*
* [1]: https://developer.mozilla.org/en-US/docs/Web/API/Worker#browser_compatibility
*/
function configWorkerGen(esm) { return {   // (boolean) => object
  input: './src/ops-adapters/central/cloudLogging/worker.js',
  output: {
    dir: myPath + '/out/worker',   // under which 'proxy.worker-{hash}.js' (including imports, tree-shaken-not-stirred)
    format: esm ? 'es':'iife',
    entryFileNames: `[name]-[hash]${ esm ? '':'.iife' }.js`,   // output ESM without extra indication; IIFE is an interim fix
    sourcemap: true,   // have source map even for production
  },

  plugins: pluginsWorkerGen(esm)
};}

export default configWorkerGen;
export { loggingAdapterProxyHashes }
