/*
* Rollup config
*
* Strategy:
*   Provide ES6 modules. Firebase hosting uses HTTP/2. Let's measure how slow or fast the initial load is, without
*   bundling.
*
* HUGE thanks to Phil Walker for showing how it can be done!  Go Phil! :)
*   -> https://philipwalton.com/articles/using-native-javascript-modules-in-production-today/
*/

// To support CommonJS dependencies, enable any lines mentioning 'commonjs'.

//import alias from '@rollup/plugin-alias'
//import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
//import { terser } from 'rollup-plugin-terser'
import vue from 'rollup-plugin-vue'

import path from 'path'
import fs from 'fs'

// Antidote to these:
//  <<
//    "Unexpected token (Note that you need plugins to import files that are not JavaScript)
//      src/components/AppProfile.vue?vue&type=style&index=0&id=6f40e678&scoped=true&lang.scss (2:0)
//  <<
//
// Reported -> https://github.com/vuejs/rollup-plugin-vue/issues/364
//
import scss from 'rollup-plugin-scss'      // handles '.css' and '.scss'
const scssHackNeeded = true;    // still needed with: vue 3.0.0-beta.18, rollup-plugin-vue 6.0.0-beta.6

const publicDir = 'public';
const indexDevFile = 'index.html';
const indexProdFile = 'public/index.prod.html';

import { productize } from './tools/prod-index-filter'

/*
* Rollup plugin to get the chunks and their hashes (as by the 'manualChunks' policy), pass it on to a tool script
* that creates production index.html from the 'index.html' template.
*
* Based on 'modulepreloadPlugin' by Philip Walton
*   -> https://github.com/philipwalton/rollup-native-modules-boilerplate/blob/master/rollup.config.js#L63-L84
*/
const prodIndexPlugin = () => {
  return {
    name: 'prodIndex',
    generateBundle(options, bundle) {
      const files = new Set();   // Set of e.g. 'main.e40530d8.js', ...

      // Loop through all the chunks
      for (const [fileName, chunkInfo] of Object.entries(bundle)) {
        if (chunkInfo.isEntry || chunkInfo.isDynamicEntry) {
          //console.debug(`Chunk imports of ${fileName}:`, chunkInfo.imports);   // dependent modules

          [fileName, ...chunkInfo.imports]    // others than 'main' only show up in the imports
            .forEach( x => files.add(x) );
        }
      }

      const hashes = new Map();
      files.forEach( x => {
        const [_,c1,c2] = x.match(/^(.+)[.-](.+)\.js$/);
        hashes.set(c1,c2);
      });

      console.debug( "Working with module hashes:", hashes );

      const indexDev = fs.readFileSync(indexDevFile, 'utf8');
      const indexProd = productize(indexDev, hashes);

      // Note: Not using Rollup's 'this.emitFile' since there's no need (Q: what would be the use case for it?).
      fs.writeFileSync(indexProdFile, indexProd);
    },
  };
};

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
    //css: false,   // note: 'false' extracts styles as a separate '.css' file
  }),

  replace({ 'process.env.NODE_ENV': '"production"' }),

  scssHackNeeded && scss({    // Should not be needed in the long run!
    output: publicDir +'/dist/bundle.css'
  }),

  // enable for minified output (~600 vs. ~2090 kB)
  //terser(),

  prodIndexPlugin()
];

export default {
  plugins,
  input: {
    main: 'src/init.prod-rollup.js'   // becomes the 'main' chunk
  },

  output: {
    dir: 'public/dist',
    format: 'es',
    entryFileNames: '[name].[hash].js',

    // Pack imports within each node package, together. See Phil Walker's blog (README.md > References) for more details.
    //
    manualChunks(id) {
      if (id.includes('node_modules')) {

        // Find the directory name following the last `node_modules`. Usually this is the package, but it could also be the scope.
        const arr = id.split(path.sep);
        const tmp = arr[arr.lastIndexOf('node_modules') + 1];

        // Pack '@firebase' and 'firebase' in the same chunk.
        //
        return tmp.match(/^@?firebase$/) ? 'firebase'
          : tmp.match(/^@?vue$/) ? 'vue'    // avoids a "(!) Generated an empty chunk" warning, by Rollup
          : tmp;
      }
    },

    sourcemap: true   // have source map even for production
  }
};
