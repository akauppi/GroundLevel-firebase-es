// vite.config.js
//
import { resolve as pathResolve, join as pathJoin, dirname as pathDirname } from 'path'
import { readdirSync, statSync } from 'fs'
import { fileURLToPath } from 'url';

import vue from '@vitejs/plugin-vue'

const srcPath = pathJoin( pathDirname(fileURLToPath(import.meta.url)), 'src');

/*
* For an absolute path 'p', provide the immediate subdirectories within it.
*/
function getSubDirsSync(p) {    // (path-string) -> Array of string
  return readdirSync(p).filter( function (x) {
    return statSync(pathJoin(p,x)).isDirectory();   // note: seems '.isDirectory' might need an absolute path (did not try without)
  });
}

/*
* Each subdir of 'srcPath' gets its own alias (eg. '/@auth' -> '<root>/src/auth/')
*/
const subAliases = (() => {
  const pairs = getSubDirsSync(srcPath).map( s => {   // [string,path-string]
    const tmp = pathResolve(srcPath, s);
    return [`/@${s}`, tmp];
  });

  return Object.fromEntries(pairs);
})();

// Naming pattern we use for Vue vs. web components:
//  - 'router-[view|link]' must be treated as Vue components (comes from a library)
//  - 'any-thing' are web components (they seem to follow that pattern, always)
//  - 'ThisThing' are our self-made Vue components
//
const forcedVueComponents = new Set([
  "router-view",
  "router-link"
]);

export default {
  root: 'vitebox',

  alias: {
    '/@': srcPath,
    ...subAliases
  },

  build: {
    minify: true,
    target: 'esnext',   // assumes native dynamic imports
    //polyfillDynamicImport: false
  },

  // Means to pass build time values to the browser (in addition to '.env' files).
  define: {
    "LOCAL_PROJECT": process.env.GCLOUD_PROJECT
  },

  plugins: [
    vue({ template: { compilerOptions: {
      isCustomElement: tag => tag.includes('-') && !forcedVueComponents.has(tag)
    }}})
  ],

  // This doesn't cut it, from config file (vite 2.0.0-beta.52). Using it as command line parameter does. Weird.
  clearScreen: false
}
