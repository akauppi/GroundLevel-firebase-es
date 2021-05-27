/*
* Rollup config
*
* Used by:
*   $ npm run build:rollup
*/
import { strict as assert } from 'assert'

import sizes from '@atomico/rollup-plugin-sizes'
import alias from '@rollup/plugin-alias'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
import { visualizer } from 'rollup-plugin-visualizer'

import { tunnelPlugin } from './tools/tunnel-plugin.js'
import { manualChunks } from '../vite-and-roll/manualChunks.js'
import { aliases } from '../vite-and-roll/aliases.js'

import {dirname} from 'path'
import {fileURLToPath} from 'url'
import { readdirSync } from 'fs'

import workerConfigGen, { loggingAdapterProxyHashes } from './rollup.config.worker.js'

const myPath = dirname(fileURLToPath(import.meta.url));

const templateHtml = myPath + '/../index.html';
const targetHtml = myPath + '/out/index.html';

const watch = process.env.ROLLUP_WATCH;

/*
* List the '@firebase/auth', '@firebase/app', ... subpackages, so that access to *any* of those is deduplicated
* (cannot give a regex to dedupe).
*/
const allFirebaseSubpackages = [
  ...readdirSync("./node_modules/@firebase").map( x => `@firebase/${x}` )
];

/*
* Note: The order of the plugins does sometimes matter.
*/
const plugins = [
  alias({
    entries: Object.entries(aliases).map( ([k,v]) => ({ find: k, replacement: v }) )   // plugin's syntax
  }),

  resolve({
    mainFields: ["module"],  // insist on importing ES6 only (tbd. remove at some point; Rollup defaults work with Firebase, since 9.0.0-beta.1?)
    modulesOnly: true,       // "inspect resolved files to assert that they are ES2015 modules"

    dedupe: allFirebaseSubpackages    // this is IMPORTANT: without it, '@firebase/...' get packaged in all weird ways 🙈
                                      // tbd. is there a way to dedupe *any* Rollup packages?
  }),

  // Inject build-time knowledge to the sources, at some places.
  //
  // NOTE: The replaced strings _must_ begin with 'process.env.' (or '__...'); otherwise the plugin quietly leaves them
  //    unchanged!
  //
  replace({
    include: ['adapters/cloudLogging/proxy.js'],
    values: {
      'process.env.PROXY_WORKER_HASH': () => {    // () => string
        const arr = loggingAdapterProxyHashes;
        assert(arr && arr[0], "Worker hash (ESM) not available, yet!");
        return JSON.stringify(arr);
      },
      /*'process.env.PROXY_WORKER_HASH_IIFE': () => {    // () => string
        const arr= loggingAdapterProxyHashes;
        assert(arr && arr[1], "Worker hash (IIFE) not available, yet!");
        return JSON.stringify(arr);
      }*/
    },

    // Mitigate warning (@rollup/plugin-replace 2.4.2):
    //  <<
    //    'preventAssignment' currently defaults to false. It is recommended to set this option to `true`, as the next major version will default this option to `true`.
    //  <<
    preventAssignment: true   // likely not needed with plugin 2.5.x
  }),

  // enable for minified output (reduces the Brotli output sizes by ~x2: 193kB -> 104kB)
  //TEMP disabled: !watch && terser(),

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

export default [
  // Worker config(s) need(s) to be first; the main config needs hashes from it.
  workerConfigGen(true),
  //workerConfigGen(false),   // DISABLED: also Safari (14.0.3) and Firefox (88) seem fine with ESM code (kept for maybe needing to support older versions)
  {
    input: './src/main.js',
    output: {
      dir: myPath + '/out',
      format: 'es',   // "required"
      entryFileNames: '[name]-[hash].js',   // .."chunks created from entry points"; default is: '[name].js'

      manualChunks,
      sourcemap: true     // have source map even for production
    },

    plugins: plugins,

    preserveEntrySignatures: false,   // "recommended setting for web apps" (and mitigates a warning)
  }
];
