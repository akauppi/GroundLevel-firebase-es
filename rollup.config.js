import vue from 'rollup-plugin-vue';
import buble from '@rollup/plugin-buble';
import { eslint } from 'rollup-plugin-eslint';
import bundleSize from 'rollup-plugin-filesize';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
//import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';

//import pkg from './package.json';

//const external = Object.keys(pkg.dependencies);   // Q: what's the purpose of this?
const extensions = ['.js', '.vue'];

// Taking production from lack of 'rollup -w'.
//
const watching = process.env.ROLLUP_WATCH;
const production = !watching;

const globals = {
  //vue: 'Vue'
};

const lintOpts = {
  extensions,
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
  bundleSize(),
  vue({   // for compiling '.vue' files
    template: {
      isProduction: production,
      compilerOptions: { preserveWhitespace: false }
    },
    css: true
  }),
  buble(),
  watching && livereload('public'),

  // Note: DOES NOT WORK. Not even if placed topmost.
  // Track -> https://stackoverflow.com/questions/59984656/bringing-in-vue-via-npm-and-rollup
  alias({
    entries: {
      //'x-vue-runtime': 'vue/dist/vue.runtime.esm.js',
      vue: 'vue/dist/vue.esm.js'   // runtime + compiler
    }
  }),
  // See -> https://vuejs.org/v2/guide/installation.html#Development-vs-Production-Mode
  //
  // Note: We need to replace it always, also for development. Value in non-prod does not matter.
  //
  replace({
    'process.env.NODE_ENV': `"${ production ? "production":"" }"`  // JSON.stringify('production')
  })
];

export default {
  external: ['vue'],
  //external,
  plugins,
  input: 'src/entry.js',
  output: {
    globals,
    file: 'public/bundle.esm.js',
    format: 'esm',
    sourcemap: true   // note: may be good to have source map even for production
  }
};
