/*
* Rollup config
*
* Strategy:
*   Provide ES modules. Firebase hosting uses HTTP/2. Let's measure how slow or fast the initial load is, without
*   bundling.
*
* HUGE thanks to Phil Walker for showing how it can be done!  Go Phil! :)
*   -> https://philipwalton.com/articles/using-native-javascript-modules-in-production-today/
*/
import { strict as assert } from 'assert'

// To support CommonJS dependencies, enable any lines mentioning 'commonjs'.

//import alias from '@rollup/plugin-alias'
//import analyze from 'rollup-plugin-analyzer'
//import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
import visualizer from 'rollup-plugin-visualizer';
import vue from 'rollup-plugin-vue'

import path from 'path'

// Antidote to these:
//  <<
//    "Unexpected token (Note that you need plugins to import files that are not JavaScript)
//      src/components/AppProfile.vue?vue&type=style&index=0&id=6f40e678&scoped=true&lang.scss (2:0)
//  <<
//
// Reported -> https://github.com/vuejs/rollup-plugin-vue/issues/364
//
import scss from 'rollup-plugin-scss'      // handles '.css' and '.scss'
const scssHackNeeded = true;    // still needed with: vue 3.0.0, rollup-plugin-vue 6.0.0-beta.10

const indexDev = 'index.template.html';
const indexProd = 'public/index.html';
const scssHackCss = scssHackNeeded ? 'public/dist/scss-hack.css' : undefined;

import { prodIndexPlugin } from './tools/prod-index-filter'

//import { version } from './package.json'
const { version } = require('./package.json');    // this works, 'import' didn't

/*
* Note: The order of the plugins does sometimes matter.
*/
const plugins = [

  resolve({
    mainFields: ['module'],  // insist on importing ES6, only (pkg.module)
    modulesOnly: true        // ES6 imports, only. Disable if you need to import CommonJS modules (you'll need 'commonjs', as well)
  }),
  //commonjs(),

  // Compile '.vue' files.
  // For options, see -> https://rollup-plugin-vue.vuejs.org/options.html#include
  //
  // Must be:
  //  - before 'typescript' plugin (if used) -> https://github.com/ayZagen/vue3-rollup-test/pull/1/files
  //
  vue({
    template: {
      isProduction: true,
      compilerOptions: { preserveWhitespace: false }
    },
    // Note: 'false' "extracts styles as a separate '.css' file". If you use it, also enable loading in 'index.html' (but see 'scssHackNeeded', below!)
    //css: false,
  }),

  // Fix mentions of 'process.env.NODE_ENV' (Vue.js 3.0.0 needs this!). Note: It would be nice if Vue found another way?? :)
  //
  replace({ 'process.env.NODE_ENV': '"production"' }),    // for Vue.js 3.0.0

  // Note: Because of needing this, the bundle file is ALWAYS needed to be read in, by 'index.html'.
  //
  scssHackCss && scss({    // Should not be needed in the long run!
    output: scssHackCss
  }),

  // enable for minified output (~600 vs. ~1432 kB)
  // as by: du -hk -I "*.map" public/dist/
  //
  terser(),

  prodIndexPlugin({ template: indexDev, out: indexProd, map: { version } }),

  // Enable for seeing more detailed info on the chunks
  //analyze(),

  // see -> https://www.npmjs.com/package/rollup-plugin-visualizer
  visualizer({
    sourcemap: true,        // seems to show the reduced sizes (e.g. 594k instead of 1.4M)
    template: 'sunburst',   // 'sunburst'|'treemap'|'network'
    brotliSize: true        // Show also Brotli compressed size (Firebase hosting supports it)
  })
];

export default {
  plugins,
  input: {
    main: 'init/main.js'   // becomes the 'main' chunk (regardless of filename)
  },

  output: {
    dir: 'public/dist',
    format: 'es',
    entryFileNames: '[name]-[hash].js',   // .."chunks created from entry points"; default is: '[name].js'

    // Pack imports within each node package, together. See Phil Walker's blog (README.md > References) for more details.
    //
    // Want:
    //  - initialization code as 'main' (includes root files of 'src' such as 'central.js', 'config.js')
    //  - application as 'app'
    //  - dependencies in their own, nice cubicles
    //
    // The division of 'main' and 'app' is a bit arbitrary. It does mean that dependencies used in the root (e.g. toaster,
    // performance monitoring like Airbrake) end up in the 'main' chunk. At the least, this provides an idea of the
    // relative weights of the template vs. one's actual app. Also, 'main' would likely remain fairly unchanging,
    // providing better client side caching.
    //
    // Ref -> https://rollupjs.org/guide/en/#outputmanualchunks
    //
    manualChunks(id) {
      const pathParts = id.split(path.sep);

      if (id.includes('node_modules')) {
        const idx = pathParts.lastIndexOf('node_modules') +1;   // index of package or scope

        const tmp = pathParts.slice(idx);   // [ package, ... ] | [ scope, package, ... ]

        const name = tmp[0].startsWith('@') ? `${tmp[0]}/${tmp[1]}` : tmp[0];   // e.g. "firebase" | "@firebase/functions"
        const scope = tmp[0].startsWith('@') ? tmp[0] : null;

        // Expected names (and their transformation)
        //
        const map = {
          '@app': 'app',  // application code
          '@vue': 'vue',
          'tslib': true,  // used by Firebase, but keep it separate
          'vue': true,
          'vue-router': true,

          // 'firebase': base Firebase stuff: app, (internal) logging, functions (< 10kB), util, ...
          '@firebase/app': 'firebase',        // ~26k
          '@firebase/component': 'firebase',  // ~13k
          '@firebase/functions': 'firebase',  // ~25k
          '@firebase/logger': 'firebase',     // ~10k
          '@firebase/util': 'firebase',       // ~20k

          // '@firebase/auth'
          '@firebase/auth': true,         // ~170kB

          // '@firebase/firestore' with exclusive dependencies
          //
          '@firebase/firestore': true,    // ~270kB
          '@firebase/webchannel-wrapper': '@firebase/firestore', // ~62kB

          // '@firebase/performance' and its direct (and exclusive) dependencies. This is an optional monitoring feature.
          //
          // NOTE: If '@firebase/performance' is imported dynamically, the chunk name 'index.esm.{hash}.js' is used,
          //    regardless what we give.
          //
          '@firebase/installations': '@firebase/performance',    // ~54kB
          '@firebase/performance': true,    // ~57kB (117kB with dependencies)
          'idb': '@firebase/performance'    // ~6kB
        };

        if (map[name]) {
          const tmp = map[name] === true ? name : map[name];

          // Flatten the chunk names (we wish all in one directory, just an opinion)
          return tmp.replace('/','-');

        } else if (scope && map[scope]) {   // put all subpackages in the given one
          return map[scope] === true ? scope : map[scope];

        } else {
          console.warn("Unexpected dependency found (not mapped in 'manualChunks'):", name);

          return;   // do NOT return a value -> let Rollup do its default
        }

      } else {    // Internal pieces
        // Note: We don't seem to be able to steer the name here. Just use 'main'.
        return "main";
      }
    },

    sourcemap: true,   // have source map even for production

    // tbd. Try different values. Can we make the official Firebase loading work, by tuning this??
    //  - "esModule"
    //  - "auto" (the new default, from Rollup > 26)
    //  - "default"
    //
    // -> https://rollupjs.org/guide/en/#outputinterop
    //interop: "default",

    intro: "const ROLLUP = true;"   // TESTING; gets prepended to each chunk
  },

  preserveEntrySignatures: false,   // "recommended setting for web apps" (suppresses a warning)
};
