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

  watching && livereload('public')
];

export default {
  external: [
    'vue',
    'vue-router' //,
    //'firebase-ui',
    //'firebase-ui.css'
  ],
  plugins,
  input: 'src/entry.js',

  // Note: Samples normally use 'iife' format for output, but we target ES6-capable browsers only, so _should_ be able
  //    to use 'esm'.
  //
  output: {
    file: 'public/bundle.esm.js',

    // EXPERIMENTAL: testing '.preserveModules' (disabled '.file' if you use this)
    //dir: 'public/dist',
    //preserveModules: true,

    format: 'esm',

    paths: {
      // Vue.js
      //    latest versions -> https://cdn.jsdelivr.net/npm/vue/
      vue: 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js',

      // Vue router
      //    latest versions -> https://cdn.jsdelivr.net/npm/vue-router/
      "vue-router": 'https://cdn.jsdelivr.net/npm/vue-router@3.1.5/dist/vue-router.esm.browser.js',

      // Firebase UI
      //    latest versions -> https://github.com/firebase/firebaseui-web/releases
      //
      // Note: Make the CSS URL match in 'SignIn.vue'
      //
      //"firebase-ui": 'https://www.gstatic.com/firebasejs/ui/4.4.0/firebase-ui-auth.js',
      //"firebase-ui.css": 'https://www.gstatic.com/firebasejs/ui/4.4.0/firebase-ui-auth.css'
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
