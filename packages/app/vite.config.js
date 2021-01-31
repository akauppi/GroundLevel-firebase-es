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

export default {    // note: entries in alphabetical order
  root: 'vitebox',

  alias: {
    '/@': srcPath,
    ...subAliases
  },

  build: {
    minify: true
  },

  // Means to pass build time values to the browser (in addition to '.env' files).
  define: {
    "LOCAL_PROJECT": process.env.GCLOUD_PROJECT
  },

  // WITHOUT THIS, VITE GIVES A RED DREADING DIALOG (2.0 beta)!!!
  //
  // Note: The error recommends including 'firebase/app' but in order for also '@firebase/firestore' etc. to work,
  //      excluding 'firebase' seems to be the right step. 👣
  //
  optimizeDeps: {
    exclude: [ 'firebase' ]
  },

  plugins: [
    vue()
  ],

  // This doesn't cut it, from config file (vite 2.0.0-beta.52). Using it as command line parameter does. Weird.
  clearScreen: false
}
