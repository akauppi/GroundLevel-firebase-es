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
import { manualChunks } from '../vite-and-roll/manualChunks.js'

import {dirname} from "path"
import {fileURLToPath} from "url"
import { readdirSync } from 'fs'

const myPath = dirname(fileURLToPath(import.meta.url));

const templateHtml = myPath + '/../index.html';
const targetHtml = myPath + '/out/index.html';

const watch = process.env.ROLLUP_WATCH;

/*
* Note: The order of the plugins does sometimes matter.
*/
const plugins = [

  resolve({
    mainFields: ["esm2017", "module"],  // insist on importing ES6 only; "esm2017" is Firebase specific.

    modulesOnly: true,       // "inspect resolved files to assert that they are ES2015 modules"

    dedupe: allFirebaseSubpackages()    // this is IMPORTANT: without it, '@firebase/...' get packaged in all weird ways 🙈
  }),

  // enable for minified output (~720 vs. ~1492 kB)
  //DISABLED: !watch && terser(),

  // DOES NOT WORK right: 'stats.roll.html' only has "100%"
  //
  // see -> https://www.npmjs.com/package/rollup-plugin-visualizer
  /*!watch &&*/ visualizer({
    sourcemap: true,        // seems to show the reduced sizes (e.g. 594k instead of 1.4M)
    template: 'sunburst',   // 'sunburst'|'treemap'|'network'
    brotliSize: true,       // Show also Brotli compressed size (Firebase hosting supports it)
    filename: 'stats.roll.html'
  }),

  tunnelPlugin(templateHtml, targetHtml)
];

/*
* List the '@firebase/auth', '@firebase/app', ... subpackages, so that access to *any* of those is deduplicated.
* (we cannot give a regex to dedupe)
*
* tbd. Is there a setting to dedupe *all* node libraries? Could do that. :)
*/
function allFirebaseSubpackages() {
  const xs= readdirSync("./node_modules/@firebase");
  return xs.map( x => `@firebase/${x}` );
}

export default {
  input: './src/main.js',
  output: {
    dir: myPath + '/out',
    format: 'es',   // "required"
    entryFileNames: '[name]-[hash].js',   // .."chunks created from entry points"; default is: '[name].js'

    manualChunks,
    sourcemap: true,   // have source map even for production

    //intro: "const ROLLUP = true;"   // TESTING; gets prepended to each chunk
  },

  plugins,

  preserveEntrySignatures: false,   // "recommended setting for web apps" (suppresses a warning)  <-- tbd. does it though?
};
