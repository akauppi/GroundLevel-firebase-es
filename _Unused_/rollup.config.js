//import alias from '@rollup/plugin-alias';
//import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
//import { eslint } from 'rollup-plugin-eslint';
import fileSize from 'rollup-plugin-filesize';
//import { terser } from "rollup-plugin-terser";
import vue from 'rollup-plugin-vue';
import css from 'rollup-plugin-css-only';

// Vite automatically converts CommonJS modules. Flip here whether you want to allow them.
const allowCommonJS = false;

/*
* Note: The order of the plugins sometimes matters.
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
    browser: true,
    //mainFields: ['module'],  // insist on importing ES6, only (pkg.module)
    modulesOnly: allowCommonJS ? false:true
  }),

  // Compiles '.vue' files.
  // For options, see -> https://rollup-plugin-vue.vuejs.org/options.html#include
  //
  // Must be:
  //  - before 'typescript' plugin (if used) -> https://github.com/ayZagen/vue3-rollup-test/pull/1/files
  //
  vue({
    /*template: {
      isProduction: true,
      compilerOptions: { preserveWhitespace: false }
    },*/
    //css: false,   // note: 'false' extracts styles as a separate '.css' file
  }),
  css,    // needed, see -> https://github.com/vuejs/rollup-plugin-vue/issues/322   // <-- check if no longer needed, once Vue 3 is out of beta

  /***
  eslint({
    extensions: ['.js', '.vue'],
    exclude: ['**\/*.json'],    // tbd. remove \
    cache: true,
    throwOnError: true
  }),
  ***/

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
    preserveModules: true,

    paths: {
      //vue: 'vue/dist/vue.esm-browser.js',    // 450 kB
      vue: 'vue/dist/vue.esm-browser.prod.js',    // 100 kB

      //"vue-router": 'vue-router/dist/vue-router.esm.js'
    },

    /***
    // tbd. Do we need to use 'globals'?
    //
    // Note: "If I remember correctly globals only works on iife modules and by extension umd ones"
    //    -> https://stackoverflow.com/questions/49947250/how-do-rollup-externals-and-globals-work-with-esm-targets/50427603#50427603
    //
    globals: {
      //firebase: "firebase",
      firebaseui: "firebaseui"
    },
    ***/

    sourcemap: true   // have source map even for production
  }
};
