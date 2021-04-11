/*
* rollup/tools/tunnel-plugin.js
*
* Converts an 'index.html' template to being suitable for Rollup build output.
*
* Index syntax:
*
*   <!--ROLL [...]    <-- rest of the line will be retained as a comment
*   this will be visible
*   -->
*
*   <!--UNROLL [...] -->
*   this will be removed
*   <!-- -->
*
*   Within 'ROLL' blocks, replaces:
*
*     - ${PRELOADS}     // by 'modulepreload' and 'preload' lines, for the chunks produced by Rollup.
*     - '.../mod-#.js"  // '#' by the hash for 'mod'
*     - ${INCLUDE filepath}  // replace by the contents of such file
*/
import { strict as assert } from 'assert'
import { readFileSync, writeFileSync } from 'fs'

/*
* Create a block of:
*   <<
*     <link rel="modulepreload" href="/ops/firebase-6ba65e97.js">
*     ...
*     <link rel="prefetch" as="script" href="/app.es-36e1fd10.js">
*     <link rel="modulepreload" href="/app/vue-143a5898.js">
*     ...
*   <<
*
* For those chunks that want Firebase to have been initialized (the 'app', 'central' and its adapters), only fetching
* is requested.
*/
function preloadsArr(arr) {   // (Array of [string,Boolean]) => Array of "<link rel...>"

  const ret = arr.map( ([fn,eager]) => {
    return !eager ? `<link rel="prefetch" as="script" href="${fn}">`
                  : `<link rel="modulepreload" href="${fn}">`;
  });
  return ret;
}

/*
* Bake a meaningful 'index.html' out of the template and hashes.
*/
function tunnel(template, map) {    // (string, Map of string -> boolean) => string    // may throw

  const preloads = preloadsArr( Array.from(map) );   // ["<link ...>", ...]

  /*
  * Provides a hash string for the file, e.g. 'main' -> 'cb47984b'.
  *
  * Note: We really, only need this for 'main-#.js'. #overcomplex
  */
  function hashFor(s) {   // (string) => string   ; may throw
    let found;
    for (const k of map.keys()) {
      const [_,c1,c2] = k.match(/^(.+?)-([a-f0-9]+)\.js$/) || [];    // JS trick: '|| []' allows us to handle did-not-match case
      if (c1 === s) {
        found = c2;
        break;
      }
    }

    if (!found) throw new Error( `No hash for: ${s}` );
    return found;
  }

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

      // '${INCLUDE filepath}'
      const s3 = s.replace(/^(\s*)\${INCLUDE\s+(.+)}\s*$/, (_,c1,c2) => {
        const tmp = readFileSync(c2);     // tbd. test that gives nice error on non-existing file
        return `${c1}${tmp}`;
      } );
      if (s3 !== s) return s3;

      // '${...}'; catch use of non-existing commands (or typos)
      s.match(/^\s*\${(.+?)}/, (_,c1) => {
        throw new Error(`No such command: {${c1}}`)
      } );

      // '/{file}-#.js' -> '/{file}-{hash}.js'
      //
      // Example:
      //  <<
      //    import { init } from './main-#.js'
      //  <<
      //
      // Note: expects '-' delimiter in Rollup 'output.entryFileNames'
      //
      const s4 = s.replaceAll(/['"]\/([\w\d]+)-#\.js['"]/g,
        (match,c1) => {   // e.g. match="'/main-#.js'", c1="main"
          const hash = hashFor(c1);
          return match.replace('#',hash);
        }
      );
      if (s4 !== s) return s4;

      return s;   // unmatched
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
* Rollup plugin to convert 'template' to 'out', injecting the hashes for this build.
*
* Based on 'modulepreloadPlugin' by Philip Walton
*   -> https://github.com/philipwalton/rollup-native-modules-boilerplate/blob/master/rollup.config.js#L63-L84
*/
function tunnelPlugin(template, out) {    // (string (filename), string (filename)) => { ...Rollup plugin object... }
  return {
    name: 'tunnel',
    generateBundle(options, bundle) {
      const map1 = new Map();    // Map of <fileName> -> Boolean   ; value 'false' for prefetch (lazy); 'true' for modulepreload (eager)

      Object.entries(bundle).forEach( ([fileName, info]) => {
        const condition = info.isEntry || info.isDynamicEntry;    // skip libraries

        // Collect dependencies + their lazy-ness.
        //
        function add(fn, eager) {
          const was = map1.get(fn);

          // If a library is used both eagerly and lazily, eager wins.
          if (was === undefined || eager) {
            map1.set(fn, eager);
          }
        }

        if (condition) {
          const eager = !info.isDynamicEntry;
          add(fileName, eager);

          // Handling dependencies of a lazy-loading module (the app itself).
          //
          // Some of those might require lazy-loading (availability of 'central', and Firebase being initialized):
          //  - logging adapters
          //
          // Others might be generic in nature, and completely fine being eager-loaded (which improves performance,
          // presumably):
          //  - Firebase
          //  - UI framework
          //  - ...other app libs
          //
          // There can be many approaches taken here. One is to prefer performance (that is, eager loading) and
          // separately white list the dependencies we *know* must only be fetched, not loaded.
          //
          // The other (conservative one) would keep everything below the app in the import tree as lazy, leading to:
          //
          // Check out the output in 'roll/out/index.html' to see, which of the modules are 'modulepreload'ed, which
          // only fetched.
          //
          //  - adapters needs to be fetched
          //
          //console.log("!!!", { fileName, info: { ...info, code: undefined, map: undefined } });

          const lazyLoad = [    // we _know_ that these must be lazy loaded ('main' calls them dynamically)
            /^adapters-/,
            /^ops-/,
            /^central-/     // 'ops' is sometimes called this, due to Rollup bug
          ];

          info.imports.forEach( (s) => {
            const b = !lazyLoad.some( re => s.match(re) );
            add(s,b);
          } );
        }
      });

      //console.debug( "Working with modules:", map1 );

      const templateText = readFileSync(template, 'utf8');
      const targetText = tunnel(templateText, map1);

      // Note: Not using Rollup's 'this.emitFile' since there's no need
      writeFileSync(out, targetText);
    }
  };
}

export { tunnelPlugin }
