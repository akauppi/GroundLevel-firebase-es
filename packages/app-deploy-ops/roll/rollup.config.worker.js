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

let loggingAdapterProxyHash;

const catchHashPlugin = {
  name: 'my-plugin',

  // Below, one can define hooks for various stages of the build.
  //
  generateBundle(_ /*options*/, bundle) {
    Object.keys(bundle).forEach( fileName => {
      // filename: "proxy.worker-520aaa52.js"
      //
      const [_,c1] = fileName.match(/^proxy.worker-([a-f0-9]+)\.js$/) || [];
      if (c1) {
        loggingAdapterProxyHash = c1;
        return;
      }
      console.warn("Unexpected bundle generated:", fileName);
    });
  }
};

const pluginsWorker = [
  resolve({
    mainFields: ["esm2017", "module"],
    modulesOnly: true       // "inspect resolved files to assert that they are ES2015 modules"
  }),
  //!watch && terser(),
  catchHashPlugin,

  !watch && sizes(),
];

const configWorker = {
  input: './adapters/logging/proxy.worker.js',
  output: {
    dir: myPath + '/out/worker',   // under which 'proxy.worker-{hash}.js' (including imports, tree-shaken-not-stirred)
    format: 'es',   // "required"
    entryFileNames: '[name]-[hash].js',   // .."chunks created from entry points"; default is: '[name].js'

    sourcemap: true,   // have source map even for production
  },

  plugins: pluginsWorker
}

export default configWorker;
export { loggingAdapterProxyHash }
