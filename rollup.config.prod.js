/*
* Rollup config
*
* Note: Linting is done separately, not via a plugin. This helps separate concerns and allows easier exchange
*     of the bundling tool, if need be.
*
* Strategy:
*   Provide ES6 modules. Firebase hosting uses HTTP/2. Let's measure how slow or fast the initial load is, without
*   bundling.
*/

// To support CommonJS dependencies, enable any lines mentioning 'commonjs'.

//import alias from '@rollup/plugin-alias';
//import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import fileSize from 'rollup-plugin-filesize';
import vue from 'rollup-plugin-vue';

/*
* Note: The order of the plugins does sometimes matter.
*/
const plugins = [
  // Needed for 'import "@/..."' to point to the source directory
  // note: currently (with Vite) not using them
  /*
  alias({
    entries: {
      ['@']: __dirname + '/src'
    }
  }),*/

  resolve(),

  // Compile '.vue' files.
  // For options, see -> https://rollup-plugin-vue.vuejs.org/options.html#include
  //
  // Must be:
  //  - before 'typescript' plugin (if used) -> https://github.com/ayZagen/vue3-rollup-test/pull/1/files
  //
  vue({
    template: {
      isProduction: true,
      //compilerOptions: { preserveWhitespace: false }
    },
    //css: false,   // note: 'false' extracts styles as a separate '.css' file
  }),

  // needed
  replace({ 'process.env.NODE_ENV': '"production"' }),

  fileSize()   // tbd. is it useful?
];

export default {
  plugins,
  input: 'src/main.js',

  output: {
    dir: 'public/dist/',
    format: 'esm',
    // EXPERIMENTAL: testing '.preserveModules' (disable '.file' if you use this)
    //preserveModules: true,

    // tbd. Do we need to use 'globals'?
    //
    // Note: "If I remember correctly globals only works on iife modules and by extension umd ones"
    //    -> https://stackoverflow.com/questions/49947250/how-do-rollup-externals-and-globals-work-with-esm-targets/50427603#50427603
    //
    globals: {
      firebaseui: "firebaseui"
    },

    sourcemap: true   // have source map even for production
  }
};
