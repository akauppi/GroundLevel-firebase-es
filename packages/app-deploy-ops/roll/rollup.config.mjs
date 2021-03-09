/*
* Rollup config
*
* Used by:
*   $ npm run build:rollup
*
* Note:
*   The '.mjs' extension tells Rollup not to transpile this configuration to CommonJS.
*     See -> https://rollupjs.org/guide/en/#using-untranspiled-config-files
*/
import { strict as assert } from 'assert'

import resolve from '@rollup/plugin-node-resolve'
//import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
import visualizer from 'rollup-plugin-visualizer'

import { tunnelPlugin } from './tools/tunnel-plugin.js'
import { manualChunks } from '../manualChunks.js'

import {dirname} from "path";
import {fileURLToPath} from "url";
const myPath = dirname(fileURLToPath(import.meta.url));

/*const sourceHtml = myPath + '../index.html';
const targetHtml = myPath + '/out/index.html';
*/
const inHtml = myPath + '/../index.html';
const outHtml = myPath + '/out/index.html';

const watch = process.env.ROLLUP_WATCH;

/*
* Note: The order of the plugins does sometimes matter.
*/
const plugins = [
  resolve({
    mainFields: ['module'],  // insist on importing ES6 only (default: '["module", "main"]')
    modulesOnly: true        // "inspect resolved files to assert that they are ES2015 modules"
  }),

  // enable for minified output (~720 vs. ~1492 kB)
  !watch && terser(),

  tunnelPlugin({
    template: inHtml,
    out: outHtml
  }),

  // see -> https://www.npmjs.com/package/rollup-plugin-visualizer
  !watch && visualizer({
    sourcemap: true,        // seems to show the reduced sizes (e.g. 594k instead of 1.4M)
    template: 'sunburst',   // 'sunburst'|'treemap'|'network'
    brotliSize: true        // Show also Brotli compressed size (Firebase hosting supports it)
  })
];

export default {
  input: {    // tbd. check implications to filtering if we do it like this; or 'input: "../init/main.js"'
    main: 'src/main.js'
  },

  output: {
    dir: myPath + '/out',
    format: 'es',
    entryFileNames: '[name]-[hash].js',   // .."chunks created from entry points"; default is: '[name].js'

    manualChunks,
    sourcemap: true,   // have source map even for production

    //intro: "const ROLLUP = true;"   // TESTING; gets prepended to each chunk
  },

  plugins,
  preserveEntrySignatures: false,   // "recommended setting for web apps" (suppresses a warning)
};
