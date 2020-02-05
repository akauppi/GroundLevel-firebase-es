//import alias from '@rollup/plugin-alias';
//import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { eslint } from 'rollup-plugin-eslint';
import fileSize from 'rollup-plugin-filesize';
import livereload from 'rollup-plugin-livereload';
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
  resolve({
    mainFields: ['module']  // insist on importing ES6, only (pkg.module)
  }),
  //commonjs(),

  eslint(lintOpts),

  // not really needed
  production && fileSize(),

  // Needed for compiling '.vue' files.
  vue({
    template: {
      isProduction: production,   // note: could trust defaults to do the same, via 'process.env.NODE_ENV'
      compilerOptions: { preserveWhitespace: false }
    },
    css: true,

    // Avoid sourcemap errors when watching
    //    -> https://github.com/vuejs/rollup-plugin-vue/issues/238
    needMap: false
  }),

  watching && livereload('public'),

  /*
  // Note: DOES NOT WORK. Not even if placed topmost.
  // Track -> https://stackoverflow.com/questions/59984656/bringing-in-vue-via-npm-and-rollup
  alias({
    entries: {
      //'x-vue-runtime': 'vue/dist/vue.runtime.esm.js',
      //vue: 'vue/dist/vue.esm.js'   // runtime + compiler
      'x-vue-cdn': 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js'
    }
  }), */
];

export default {
  external: [
    'vue',
    //'firebase',
    //'firebaseui',
  ],
  plugins,
  input: 'src/entry.js',

  // Note: Samples normally use 'iife' format for output, but we target ES6-capable browsers only, so _should_ be able
  //    to use 'esm'.
  //
  output: {
    file: 'public/bundle.esm.js',

    // EXPERIMENTAL: testing '.preserveModules' (disabled '.file' if you use this)
    //dir: 'public/bundle',
    //preserveModules: true,

    format: 'esm',

    paths: {
      // latest versions -> https://cdn.jsdelivr.net/npm/vue/
      vue: 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js'
    },

    // tbd. Do we need to use 'globals'?
    //
    // Note: "If I remember correctly globals only works on iife modules and by extension umd ones"
    //    -> https://stackoverflow.com/questions/49947250/how-do-rollup-externals-and-globals-work-with-esm-targets/50427603#50427603
    //
    //globals: { },

    sourcemap: true   // note: may be good to have source map even for production
  },

  watch: {
    clearScreen: true
  }
};
