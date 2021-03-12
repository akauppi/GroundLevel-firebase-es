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
*     <link rel="modulepreload" href="/ops/firebase-6ba65e97.js">
*     ...
*     <link rel="preload" href="/app.es-36e1fd10.js">   <-- notice NO 'modulepreload'
*     <link rel="modulepreload" href="/app/vue-143a5898.js">
*     ...
*   <<
*
* Note:
*   It's important that application chunks are 'preload'ed, not _module_preloaded. They are loaded dynamically,
*   once the environment (especially Firebase) is initialized. 'modulepreload' can be used on anything else,
*   including all libraries.
*
* modfiles:
*   entries like 'dist/{mod}-{hash}.js'
*/
function preloadsArr(modFiles) {   // (Array of string) => Array of "<link rel...>"

  const isAppChunk = (fn) => fn.includes('/app.');  // keep an eye on this; might vary..

  // Note: The 'crossorigin' attribute is needed. Without it, Chrome gives warnings in the browser console.
  //
  //    "..attribute needs to be set to match the resource's CORS and credentials mode, even when the fetch is not
  //    cross-origin"  From -> https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content
  //
  const ret = modFiles
    .filter( fn => ! fn.includes("/ops/init-"))   // skip boot chunk
    .map( fn => {
      return isAppChunk(fn)
        ? `<link rel="preload" as="script" crossorigin href="${fn}">`
        : `<link rel="modulepreload" href="${fn}">`;
    });
  return ret;
}

/*
* Bake a meaningful index.html out of the template and hashes.
*/
function tunnel(template, hashes) {    // (string, Map of string -> string) => string    // may throw

  const modFiles = Array.from( hashes.entries() ).map( ([key,value]) =>
    `/${key}-${value}.js`
  );

  const preloads = preloadsArr(modFiles);   // ["<link ...>", ...]

  /*
  * Apply templating to an uncommented 'ROLL' block.
  *
  * - replace '${PRELOADS}' with commands to preload the modules (with correct hashes for this build)
  * - replace '{mod}-#.js' with the correct hash for that file
  */
  function rollBlock(a) {   // (string) => string
    const lines = a.split('\n');

    const arr = lines.map( s => {
      // '${PRELOADS}'
      const s2 = s.replace(/^(\s*)\${PRELOADS}\s*$/, (_,c1) => preloads.map(x => c1+x).join('\n') );
      if (s2 !== s) return s2;

      // '/{file}-#.js' -> '/{file}-{hash}.js'
      //
      // Example:
      //  <<
      //    import { init } from './main-#.js'
      //  <<
      //
      // Note: expects '-' delimiter in Rollup 'output.entryFileNames'
      //
      const s3 = s.replaceAll(/['"]\/([\w\d]+)-#\.js['"]/g,
        (match,c1) => {   // e.g. match="'/main-#.js'", c1="main"
          const hash = hashes.get(c1);
          if (!hash) throw new Error( "No hash for: "+c1 );

          return match.replace('#',hash);
        }
      );
      if (s3 !== s) return s3;

      return s;   // unchanged
    });

    return arr.join('\n');
  }

  // Regex note: '.' for "chars within the same line" and '[\s\S]' for "chars, possibly including newline".

  const s0 = template;

  // UNROLL blocks (remove)
  //
  const s1 = s0.replace(/^\s*<!--UNROLL\s.*-->[\s\S]+?^\s*<!--\s+-->\s*\n/gm,"");  // "<!-- UNROLL block REMOVED -->\n"

  // ROLL blocks (uncomment)
  //
  // If the '<!--ROLL' has a tail, that is placed as a comment in the output.
  //
  // Replacements (eg. '${PRELOADS)' are only applied to the ROLL block contents.
  //
  const s2 = s1.replace(/^\s*<!--ROLL\s*\n([\s\S]+?)^\s*-->\s*\n/gm, (_,c1) => `\n${ rollBlock(c1) }\n` );
  const s3 = s2.replace(/^(\s*)<!--ROLL +(.*?)\s*\n([\s\S]+?)^\s*-->\s*\n/gm, (_,c1,c2,c3) => `${c1}<!-- ${c2} -->\n${ rollBlock(c3) }\n` );

  return s3;
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
      const files = new Set();    // note: using a Set automatically takes care of duplicates

      Object.entries(bundle).forEach( ([fileName, chunkInfo]) => {
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

          [fileName, ...chunkInfo.imports].forEach( (s) => { files.add(s); } );
            // others than 'main' only show up in the imports
        }
      });

      const hashes = new Map(
        Array.from(files).map( (x) => {
          const [_,c1,c2] = x.match(/^(.+)-([a-f0-9]+)\.js$/);
          return [c1,c2];
        })
      );

      //console.debug( "Working with module hashes:", hashes );

      const templateText = readFileSync(template, 'utf8');
      const targetText = tunnel(templateText, hashes);

      // Note: Not using Rollup's 'this.emitFile' since there's no need
      writeFileSync(out, targetText);
    }
  };
};

export { tunnelPlugin }
