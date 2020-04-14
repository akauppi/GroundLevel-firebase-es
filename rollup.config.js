import alias from '@rollup/plugin-alias';
//import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { eslint } from 'rollup-plugin-eslint';
import fileSize from 'rollup-plugin-filesize';
import livereload from 'rollup-plugin-livereload';
import { terser } from "rollup-plugin-terser";
import vue from 'rollup-plugin-vue';

// Taking production from lack of 'rollup -w'.
//
const watching = process.env.ROLLUP_WATCH;
const production = !watching;

const lintOpts = {
  extensions: ['.js', '.vue'],
  exclude: ['**/*.json'],
  cache: true,
  throwOnError: true
};

const plugins = [
  // Needed for 'import "@/..."' to point to the source directory (Q: do Vue CLI projects get this, automatically? #help)
  alias({
    entries: {
      ['@']: __dirname + '/src'
    }
  }),

  resolve({
    mainFields: ['module'],  // insist on importing ES6, only (pkg.module)
    modulesOnly: true        // ES6 imports, only. Disable if you need to import CommonJS modules (you'll need 'commonjs', as well)
  }),
  //commonjs(),

  eslint(lintOpts),

  // Compiles '.vue' files.
  // For options, see -> https://rollup-plugin-vue.vuejs.org/options.html#include
  //
  vue({
    template: {
      isProduction: production,   // note: could trust defaults to do the same, via 'process.env.NODE_ENV'
      compilerOptions: { preserveWhitespace: false }
    },
    //css: false,   // note: 'false' extracts styles as a separate '.css' file

    // Avoid sourcemap errors when watching
    //    -> https://github.com/vuejs/rollup-plugin-vue/issues/238
    needMap: false
  }),

  // Note: If you bring in Vue or vue-router via 'npm' (not CDN), you'll need this to tell the bundle whether it's
  //    production or not.
  //
  replace({ 'process.env.NODE_ENV': production ? '"production"':'""' }),

  watching && livereload({
    watch: 'public/**'
  }),

  production && fileSize(),   // tbd. where does this pick the minimized etc. sizes?  (could we just print out from terser?)
  production && terser()
];

export default {
  external: [
    'vue',
    //'vue-router'
  ],
  plugins,
  input: 'src/entry.js',

  // Note: Samples normally use 'iife' format for output, but we target ES6-capable browsers only, so _should_ be able
  //    to use 'esm'.
  //
  output: {
    file: 'public/dist/bundle.esm.js',
    //dir: 'public/dist',
    format: 'esm',
    // EXPERIMENTAL: testing '.preserveModules' (disable '.file' if you use this)
    //preserveModules: true,

    paths: {
      // Vue.js
      //    latest versions -> https://cdn.jsdelivr.net/npm/vue/
      vue: 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js',

      // Vue router
      //    latest versions -> https://cdn.jsdelivr.net/npm/vue-router/
      //"vue-router": 'https://cdn.jsdelivr.net/npm/vue-router@3.1.6/dist/vue-router.esm.browser.js'
    },

    // tbd. Do we need to use 'globals'?
    //
    // Note: "If I remember correctly globals only works on iife modules and by extension umd ones"
    //    -> https://stackoverflow.com/questions/49947250/how-do-rollup-externals-and-globals-work-with-esm-targets/50427603#50427603
    //
    globals: {
      firebase: "firebase",
      firebaseui: "firebaseui"
    },

    sourcemap: true   // note: may be good to have source map even for production
  },

  watch: {
    clearScreen: true
  }
};
