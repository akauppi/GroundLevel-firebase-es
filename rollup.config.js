import vue from 'rollup-plugin-vue';
import buble from 'rollup-plugin-buble';
import { eslint } from 'rollup-plugin-eslint';
import bundleSize from 'rollup-plugin-filesize';
import resolve from 'rollup-plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';

import pkg from './package.json';

const external = Object.keys(pkg.dependencies);
const extensions = ['.js', '.vue'];

// Taking production from lack of 'rollup -w'.
//
const watching = process.env.ROLLUP_WATCH;
const production = !watching;

const globals = { vue: 'Vue' };

const lintOpts = {
  extensions,
  exclude: ['**/*.json'],
  cache: true,
  throwOnError: true
};

const plugins = [
  resolve(),
  eslint(lintOpts),
  bundleSize(),
  vue({
    template: {
      isProduction: production,
      compilerOptions: { preserveWhitespace: false }
    },
    css: true
  }),
  buble(),
  watching && livereload('public')
];

export default {
  external,
  plugins,
  input: 'src/entry.js',
  output: {
    globals,
    file: 'public/bundle.esm.js',
    //format: 'umd'
    format: 'esm'
  }
};
