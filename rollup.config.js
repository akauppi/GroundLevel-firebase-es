//import alias from '@rollup/plugin-alias';
//import buble from '@rollup/plugin-buble';
//import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { eslint } from 'rollup-plugin-eslint';
//import bundleSize from 'rollup-plugin-filesize';
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

  //bundleSize(),

  // Needed for compiling '.vue' files.
  vue({
    template: {
      isProduction: production,   // note: could trust defaults to do the same, via 'process.env.NODE_ENV'
      compilerOptions: { preserveWhitespace: false }
    },
    css: true
  }),

  //buble(),

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

  // See -> https://vuejs.org/v2/guide/installation.html#Development-vs-Production-Mode
  //
  // Note: We need to replace it also for development. Value in non-prod does not matter.
  //
  // tbd. Try whether we still need this. May not, if Vue comes from CDN (not npm).
  //
  replace({
    'process.env.NODE_ENV': `"${ production ? 'production':'' }"`
  })
];

export default {
  external: [
    //'vue',
    'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js'
  ],
  plugins,
  input: 'src/entry.js',
  output: {
    file: 'public/bundle.esm.js',
    format: 'esm',
    sourcemap: true   // note: may be good to have source map even for production
  }
};
