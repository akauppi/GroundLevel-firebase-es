/*
* Rollup config
*
* Note: Linting is done separately. This helps separate concerns and allows easier exchange of the bundling tool,
*     if we so choose.
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

// Antidote to these:
//  <<
//    "Unexpected token (Note that you need plugins to import files that are not JavaScript)
//      src/components/AppProfile.vue?vue&type=style&index=0&id=6f40e678&scoped=true&lang.scss (2:0)
//  <<
//
//import css from 'rollup-plugin-css-only';
import scss from 'rollup-plugin-scss';      // handles '.css' and '.scss'

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

  resolve({
    mainFields: ['module'],  // insist on importing ES6, only (pkg.module)
    //modulesOnly: true        // ES6 imports, only. Disable if you need to import CommonJS modules (you'll need 'commonjs', as well)
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
  scss(),   // NOTE: antidote for rollup-vue-plugin or Vue.js 3 (beta) problem; see TRACK.md

  fileSize()   // tbd. is it useful?
];

export default {
  plugins,
  input: 'src/main.js',

  output: {
    //file: 'public/dist/bundle.js',
    dir: 'public/dist/',
    format: 'es',

    // tbd. this gives error:
    //
    // EXPERIMENTAL: testing '.preserveModules' (disable '.file' if you use this)
    //
    // PROBLEM: Enabling this causes:
    //  <<
    //    [!] Error: Invalid substitution ".vue?vue&type=template&id=7ba5bd90&scoped=true" for placeholder "[extname]" in "output.entryFileNames" pattern, can be neither absolute nor relative path.
    //  <<
    preserveModules: true,

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
