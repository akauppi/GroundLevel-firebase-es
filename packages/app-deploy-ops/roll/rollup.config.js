/*
* Rollup config for the main build
*
* Used by:
*   $ npm run build:rollup
*/
import sizes from '@atomico/rollup-plugin-sizes'
import alias from '@rollup/plugin-alias'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
import { visualizer } from 'rollup-plugin-visualizer'

import { tunnelPlugin } from './tools/tunnel-plugin.js'
import { manualChunks } from '../vite-and-roll/manualChunks.js'
import { aliases } from '../vite-and-roll/aliases.js'

import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { proxyPairs, envPairs } from './injectPairs'

const myPath = dirname(fileURLToPath(import.meta.url));

const templateHtml = myPath + '/../index.html';
const targetHtml = myPath + '/out/index.html';

const watch = process.env.ROLLUP_WATCH;

//function fail(msg) { throw new Error(msg) }

/*
* Note: The order of the plugins does sometimes matter.
*/
const plugins = [
  alias({
    entries: {
      ...aliases
    }
  }),

  nodeResolve({
    //mainFields: ["module"],   // Can be used to steer, which fields Rollup picks (default: ['module', 'main']) for modules not using 'exports'.

    modulesOnly: false,       // "inspect resolved files to assert that they are ES2015 modules"
      //
      // 'false' because of 'raygun4j' (2.22.3); UMD packaging only
  }),

  // Inject build-time knowledge to the sources.
  //
  // Using 'JSON.stringify' for the values feels safer than just `'${v}'` - though we know the contents to be replaced
  //
  // 'preventAssignment: true':
  //    "Prevents replacing strings where they are followed by a single equals sign."
  //    We want this, but it also mitigates a warning (@rollup/plugin-replace 2.4.2, still in 3.0.0):
  //      <<
  //        'preventAssignment' currently defaults to false. It is recommended to set this option to `true`, as the next major version will default this option to `true`.
  //      <<
  //
  // NOTE:
  //    The 'include' parameter is very PICKY to get 'src/...' instead of './src' or 'myPath + ...' (and DOES NOT COMPLAIN
  //    if you provide paths it won't cope with!!). Don't be clever.
  //
  replace({   // targeted injection to:
    include: 'src/ops-adapters/cloudLogging/index.js',
    values: Object.fromEntries( proxyPairs.map( ([k,v]) =>
      [`import.meta.env.${k}`, JSON.stringify(v)]
    )),
    preventAssignment: true
  }),

  replace({   // general (all files; not adapters)
    include: 'src/**/*.js',
    exclude: 'src/ops-adapters/**',
    values: Object.fromEntries( envPairs.map( ([k,v]) =>
      [`import.meta.env.${k}`, JSON.stringify(v)]
    )),
    preventAssignment: true
  }),

  // enable for minified output (reduces the Brotli output sizes by ~x2: 193kB -> 104kB)
  !watch && terser(),

  tunnelPlugin(templateHtml, targetHtml),

  // '@atomico' reporter shows yellow at 90% of the threshold; red for exceeding. Unfortunately, the threshold applies
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
    sourcemap: true     // have source map even for production
  },
  plugins,
  preserveEntrySignatures: false,   // "recommended setting for web apps" (and mitigates a warning)
}
