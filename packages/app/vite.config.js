// vite.config.js
//
import path, { join as pathJoin, dirname as pathDirname } from 'path'
import { readdirSync, statSync } from 'fs'
import { fileURLToPath } from 'url'

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
    const tmp = path.resolve(srcPath, s);
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

// Help Rollup in packaging.
//
// Want:
//  - 'init/**' as 'init' (only for development; ops replaces with its own)
//  - application in main chunk
//  - dependencies in their own, nice cubicles
//
// References:
//    -> https://rollupjs.org/guide/en/#outputmanualchunks
//
function manualChunks(id) {

  // ID's that flow through:
  //
  //  /Users/.../app/vitebox/init/main.js
  //  /Users/.../app/src/app.js
  //  /Users/.../app/node_modules/firebase/app/dist/index.esm.js
  //  vite/preload-helper
  //  /Users/.../aside-keys/packages/aside-keys/dist/bundle.js    # if you have 'npm link'ed to it
  //  /Users/.../app/src/App.vue?vue&type=style&index=0&scoped=true&lang.scss
  //
  //console.debug(`Chunking (ID): ${id}`);

  let name;
  for( const re of chunkTo ) {
    const tmp = id.match(re);   // [_, capture] | null
    if (tmp) {
      name = tmp[1] || "app";
      break;
    }
  }

  if (!name) {
    console.warn("Unexpected dependency found (not mapped in 'manualChunks'):", id);
    return;   // do NOT return a value -> let Rollup do its default
  } else {
    return name;
  }
}

// Regex's for grouping the chunks. If there is a capture group, that is used for the name. Otherwise, the default
// chunk.
//
// Note: Firebase (and thus its dependencies like 'tslib') is excluded (peer dependency).
//
const chunkTo = [     // Array of Regex
  /\/app\/src\//,               // app.js, App.vue?vue&type=style&index=0&scoped=true&lang.scss, ...
  /\/aside-keys\/dist\//,       // seen like this if 'npm link'ed
  /^vite\//,      // Vite runtime (small, ~600b)

  /\/node_modules\/@?(vue)\//,
  /\/node_modules\/(vue-router)\//,
];

export default {
  root: 'vitebox',

  resolve: {
    alias: { ...subAliases,
      '/@': srcPath
    }
  },

  // Means to pass build time values to the browser (in addition to '.env' files).
  define: {
    "LOCAL_PROJECT": process.env.GCLOUD_PROJECT
  },

  build: {
    // tbd. Is minification required? Ops build will do it for us, right?
    //minify: true,
    minify: false,
    sourcemap: true,    // "generate production source maps"
    target: 'esnext',   // assumes native dynamic imports
    //polyfillDynamicImport: false

    // Expose the code side, with a predictable export path.
    lib: {
      entry: path.resolve(srcPath, 'app.js'),
      formats: ['es']   // internal use only (ESM; no 'name' field needed)
    },

    rollupOptions: {
      external: [
        /^@?firebase\//,    // 'firebase/app', '@firebase/...'
        "/favicon.png"
      ],
      output: { manualChunks }
    },
    chunkSizeWarningLimit: 1000   // Firebase chunk is >700kB but we don't export it
  },

  plugins: [
    vue({ template: { compilerOptions: {
      isCustomElement: tag => tag.includes('-') && !forcedVueComponents.has(tag)
    }}})
  ],

  // This doesn't cut it, from config file (vite 2.0.0-beta.52). Using it as command line parameter does. Weird.
  clearScreen: false
}
