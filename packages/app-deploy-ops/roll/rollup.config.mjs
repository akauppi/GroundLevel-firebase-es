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

import sizes from '@atomico/rollup-plugin-sizes'
import alias from '@rollup/plugin-alias'
import resolve from '@rollup/plugin-node-resolve'
//import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
import visualizer from 'rollup-plugin-visualizer'

import { tunnelPlugin } from './tools/tunnel-plugin.js'
import { manualChunks } from '../vite-and-roll/manualChunks.js'
import { opsAliases } from '../vite-and-roll/opsAliases.js'

import {dirname} from 'path'
import {fileURLToPath} from 'url'
import { readdirSync } from 'fs'

const myPath = dirname(fileURLToPath(import.meta.url));

const templateHtml = myPath + '/../index.html';
const targetHtml = myPath + '/out/index.html';

const watch = process.env.ROLLUP_WATCH;

/*
* List the '@firebase/auth', '@firebase/app', ... subpackages, so that access to *any* of those is deduplicated.
* (we cannot give a regex to dedupe)
*
* tbd. Is there a setting to dedupe *all* node libraries? Could do that. :)
*/
const allFirebaseSubpackages = [
  ...readdirSync("./node_modules/@firebase").map( x => `@firebase/${x}` ),
  ...readdirSync("./node_modules/firebase").map( x => `firebase/${x}` )
];

/*
* Note: The order of the plugins does sometimes matter.
*/
const plugins = [
  alias({
    entries: Object.entries(opsAliases).map( ([k,v]) => ({ find: k, replacement: v }) )   // plugin's syntax
  }),

  resolve({
    mainFields: ["esm2017", "module"],  // insist on importing ES6 only; "esm2017" is Firebase specific.

    modulesOnly: true,       // "inspect resolved files to assert that they are ES2015 modules"

    dedupe: allFirebaseSubpackages    // this is IMPORTANT: without it, '@firebase/...' get packaged in all weird ways 🙈
  }),

  // enable for minified output (reduces the Brotli output sizes by ~x2: 193kB -> 104kB)
  !watch && terser(),

  tunnelPlugin(templateHtml, targetHtml),

  // '@atomico' reporter shows yellow at 90% of the threshold; red for exceeding. Unfortunatly, the threshold applies
  // both to total and chunk sizing, which isn't really meaningful.
  //
  // "Good enough for now". You can replace this reporter.
  //
  // Note: The limit seems to apply to Gzip size (not Brotli, being an afterthought).
  //
  !watch && sizes(240),

  // see -> https://www.npmjs.com/package/rollup-plugin-visualizer
  !watch && visualizer({
    filename: 'roll/stats.html',
    sourcemap: true,        // true: shows more useful sizes (e.g. "347.96KB" vs. "1.01MB")
    template: 'sunburst',   // 'sunburst'|'treemap'|'network'
    brotliSize: true,       // Show also Brotli compressed size (Firebase hosting supports it)
  })
];

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

  preserveEntrySignatures: false,   // "recommended setting for web apps" (and mitigates a warning)
};
