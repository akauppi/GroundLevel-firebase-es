/*
* rollup/tools/tunnel-plugin.js
*
* Takes in 'index.html' (aimed for Vite), and expands the template comment strings so we have a Rollup-only build.
*
* Index syntax:
*
*   <!--ROLL [...]    <-- rest of the line will be retained as a comment
*   this will be visible
*   -->
*
*   <!--VITE [...] -->
*   this will be removed
*   <!-- -->
*
*   Within 'ROLL' blocks, replaces:
*
*     - ${PRELOADS}       // by a modulepreloading code for the chunks produced by Rollup
*
*     - '.../mod-#.js"    // '#' by the hash for 'mod'
*/
import { strict as assert } from 'assert'
import { readFileSync, writeFileSync } from 'fs'

/*
* Create a block of:
*   <<
*     <link rel="modulepreload" href="dist/...">     <-- tbd. update with a real value
*     ...
*   <<
*
* Note:
*   Not all chunks are necessarily 'modulepreloaded' (that means they are not only preloaded, but compiled at will,
*   as well). Bare 'preload' only loads, and is suitable for dynamic imports (e.g. the 'app' chunk).
*
* modfiles:
*   entries like 'dist/{mod}-{hash}.js'
*/
function preloadsArr(modFiles) {   // (Array of string) => Array of "<link rel...>"

  console.debug("MODFILES:", modFiles);

  const ret = modFiles
    .filter( fn => ! fn.includes("/main-"))   // skip boot chunk
    .map( fn => `<link rel="modulepreload" href="${fn}">` );
  return ret;
}

/*
*/
function tunnel(contents, hashes) {    // (string, Map of string -> string) => string    // may throw

  const modFiles = Array.from( hashes.entries() ).map( ([key,value]) =>
    `dist/${key}-${value}.js`
  );

  const preloads = preloadsArr(modFiles);   // ["<link ...>", ...]

  // Regex note: '.' for "chars within the same line" and '[\s\S]' for "chars, possibly including newline".

  // The rest are per-line replacements.
  //
  const outArr = contents.split('\n').map( s => {
    // '${PRELOADS}'
    const s2 = s.replace(/^(\s*)\${PRELOADS}\s*$/, (_,c1) => preloads.map(x => c1+x).join('\n') );
    if (s2 !== s) return s2;    // note: may (does) contain newlines

    // Hashes
    //
    // Any '{file}-#.js' to be filled in the hash.
    //
    // Example:
    //  <<
    //    import { init } from './main-#.js'
    //  <<
    //
    // Note: expects '-' delimiter in Rollup 'output.entryFileNames'
    //
    const s4 = s.replaceAll(/'[^']+\/([\w\d]+)-#\.js'/g,      // can there be multiple, per line?
      (match,c1) => {   // e.g. match="'/main-#.js'", c1="main"
        const hash = hashes.get(c1)
        if (!hash) throw new Error( "No hash for: "+c1 );

        return match.replace('#',hash);
      }
    );
    return (s4 !== s) ? s4 : s;
  });

  return outArr.join('\n');
}

/*
* Rollup plugin to get the chunks and their hashes (as by the 'manualChunks' policy). Used from Rollup config.
*
* Based on 'modulepreloadPlugin' by Philip Walton
*   -> https://github.com/philipwalton/rollup-native-modules-boilerplate/blob/master/rollup.config.js#L63-L84
*/
const tunnelPlugin = ({ template, out /*, map*/ }) => {    // ({ string (filename), string (filename), {} }) => { ...Rollup plugin object... }
  return {
    name: 'tunnel',
    generateBundle(options, bundle) {
      const files /* Array of string */ = Object.entries(bundle).map( ([fileName, chunkInfo]) => {
        //console.debug('!!!', fileName, chunkInfo);
          //
          // fileName: 'main-d2008ed0.js'
          // chunkInfo : {    // ..has tremendously much data, including sources
          //    isDynamicEntry: false,
          //    isEntry: true,
          //    imports: [ '@local/app' ],
          //    ...
          //  }

        if (chunkInfo.isEntry || chunkInfo.isDynamicEntry) {
          //console.debug(`Chunk imports of ${fileName}:`, chunkInfo.imports);   // dependent modules
          /*
          Chunk imports of main-f045957a.js: [
            'app.es-1b83be53.js',
            'app/firebase-4bf9f9b4.js',
            'app/vue-bd57f6db.js',
            'app/firebase-auth-b5c3554d.js',
            'app/tslib-f75ffd46.js',
            'app/firebase-firestore-ecc2601c.js',
            'app/aside-keys-a858bef9.js',
            'app/vue-router-66ef5042.js',
            'app/firebase-performance-79caec35.js'
          ]
          Chunk imports of app.es-1b83be53.js: [
            'app/vue-bd57f6db.js',
            'app/firebase-4bf9f9b4.js',
            'app/firebase-auth-b5c3554d.js',
            'app/firebase-firestore-ecc2601c.js',
            'app/aside-keys-a858bef9.js',
            'app/vue-router-66ef5042.js',
            'app/firebase-performance-79caec35.js',
            'app/tslib-f75ffd46.js'
          ]
          */

          return [fileName, ...chunkInfo.imports];    // others than 'main' only show up in the imports
        }
      } ).flatMap(x => x);    // merges the values to one Array

      /***
      const hashes = new Map(
        files.map( (x) => {
          const [_,c1,c2] = x.match(/^(.+)-(.+)\.js$/);
          return [c1,c2];
        })
      );

      console.debug( "Working with module hashes:", hashes );
      ***/
      /*** disabled
      const templateText = readFileSync(template, 'utf8');
      const targetText = tunnel(templateText, hashes);

      // Note: Not using Rollup's 'this.emitFile' since there's no need
      writeFileSync(out, targetText);
      ***/
    }
  };
};

export { tunnelPlugin }
