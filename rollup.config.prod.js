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

//import alias from '@rollup/plugin-alias';
//import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
//import { terser } from 'rollup-plugin-terser';
import vue from 'rollup-plugin-vue';

import path from 'path';
import fs from 'fs';

// Antidote to these:
//  <<
//    "Unexpected token (Note that you need plugins to import files that are not JavaScript)
//      src/components/AppProfile.vue?vue&type=style&index=0&id=6f40e678&scoped=true&lang.scss (2:0)
//  <<
//
import scss from 'rollup-plugin-scss';      // handles '.css' and '.scss'

const publicDir = 'public';

/*** disabled (make BIGGER, BETTER)
/ **
 * A Rollup plugin to generate a list of import dependencies for each entry
 * point in the module graph. This is then used by the template to generate
 * the necessary `<link rel="modulepreload">` tags.
 * @return {Object}
 * /
const modulepreloadPlugin = () => {
  return {
    name: 'modulepreload',
    generateBundle(options, bundle) {
      // A mapping of entry chunk names to their full dependency list.
      const modulepreloadMap = {};

      // Loop through all the chunks to detect entries.
      for (const [fileName, chunkInfo] of Object.entries(bundle)) {
        if (chunkInfo.isEntry || chunkInfo.isDynamicEntry) {
          modulepreloadMap[chunkInfo.name] = [fileName, ...chunkInfo.imports];
        }
      }

      fs.writeFileSync(
        path.join(publicDir, 'modulepreload.json'),
        JSON.stringify(modulepreloadMap, null,2)
      );
    },
  };
};
***/

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

  scss({    // Should not be needed in the long run!
    output: publicDir +'/dist/bundle.css'
  }),

  // enable for minified output (~600 vs. ~2090 kB)
  //terser(),

  //modulepreloadPlugin()
];

export default {
  plugins,
  input: {
    main: 'src/main.js'
  },

  output: {
    dir: 'public/dist',
    format: 'es',
    entryFileNames: '[name].[hash].js',

    // Pack imports within each node package, together. See Phil Walker's blog (README.md > References) for more details.
    //
    manualChunks(id) {
      if (id.includes('node_modules')) {
        // Return the directory name following the last `node_modules`.
        // Usually this is the package, but it could also be the scope.
        const arr = id.split(path.sep);
        const tmp = arr[arr.lastIndexOf('node_modules') + 1];

        // Pack '@firebase' and 'firebase' to the same chunk.
        // Also possible: to leave something in the default chunk, return empty.
        //
        return tmp.match(/^@?firebase$/) ? 'firebase'
          : tmp;
      }
    },

    sourcemap: true   // have source map even for production
  }
};
