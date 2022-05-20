/*
* Rollup config for proxy worker
*
* This is a preceding build to the main build. They are separated so that the main build has the hash of our
* output file, before the build (to be able to inject it to the code).
*
* Pros:
*   - clear separation; cleaner config files
*
* Cons:
*   - this build is left outside of 'npm run watch' (you have to manually recompile, if you change the worker code,
*     which should be rare)
*/
import sizes from '@atomico/rollup-plugin-sizes'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

import { dirname } from 'path'
import { fileURLToPath } from 'url'

const myPath = dirname(fileURLToPath(import.meta.url));

const watch = process.env.ROLLUP_WATCH;

const plugins = [
  nodeResolve({
    //mainFields: ["esm2017", "module"],    // <-- no longer needed, right? (Firebase relic) #cleanup
    modulesOnly: true       // "inspect resolved files to assert that they are ES2015 modules"
  }),
  !watch && terser(),

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
const workerConfigGen = (esm) => ({   // (boolean) => object
  input: './src/ops-adapters/cloudLogging/worker.js',
  output: {
    dir: myPath + '/out/worker',   // under which 'proxy.worker-{hash}.js' (including imports, tree-shaken-not-stirred)
    format: esm ? 'es':'iife',
    entryFileNames: `[name]-[hash]${ esm ? '':'.iife' }.js`,   // output ESM without extra indication; IIFE is an interim fix
    sourcemap: true,   // have source map even for production
  },

  plugins
});

export default [
  workerConfigGen(true),
  //workerConfigGen(false),   // DISABLED: also Safari (14.0.3) and Firefox (88) seem fine with ESM code (kept for maybe needing to support older versions)
];
