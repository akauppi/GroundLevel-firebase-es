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
*     - ${PRELOADS}       // by 'modulepreload' and 'preload' lines, for the chunks produced by Rollup.
*     - '.../mod-#.js"    // '#' by the hash for 'mod'
*/
import { strict as assert } from 'assert'
import { readFileSync, writeFileSync } from 'fs'

/*
* Create a block of:
*   <<
*     <link rel="modulepreload" href="/ops/firebase-6ba65e97.js">
*     ...
*     <link rel="preload" as="script" crossorigin href="/app.es-36e1fd10.js">
*     <link rel="modulepreload" href="/app/vue-143a5898.js">
*     ...
*   <<
*
* The caller informs, whether a chunk is loaded dynamically. If it is, it's best to not precompile it (especially
* important for the app chunk, which relies on the 'center', Firebase et.al. environment to be set up for it).
*/
function preloadsArr(arr) {   // (Array of [string,Boolean]) => Array of "<link rel...>"

  // Note: The 'crossorigin' attribute is needed. Without it, Chrome gives warnings in the browser console.
  //
  //    "..attribute needs to be set to match the resource's CORS and credentials mode, even when the fetch is not
  //    cross-origin"  From -> https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content
  //
  const ret = arr
    //??? .filter( ([fn,_]) => ! fn.includes("/ops/init-"))   // skip boot chunk    // tbd. revise this line
    .map( ([fn,dynamic]) => {
      return dynamic ? `<link rel="preload" as="script" crossorigin href="${fn}">`
                     : `<link rel="modulepreload" href="${fn}">`;
    });
  return ret;
}

/*
* Bake a meaningful 'index.html' out of the template and hashes.
*
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
          const hash = hashFor(c1);
          return match.replace('#',hash);
        }
      );
      if (s3 !== s) return s3;

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
      const map1 = new Map();    // Map of <fileName> -> Boolean   ; value 'true' if used as dynamic import (even once)

      Object.entries(bundle).forEach( ([fileName, info]) => {
        const condition = info.isEntry || info.isDynamicEntry;    // skip libraries

        function add(fn, dynamic) {
          map1.set(fn, map1.get(fn) || dynamic);
        }

        if (condition) {
          add(fileName, info.isDynamicEntry);
          info.imports.forEach( (s) => { add(s,false); } );   // libraries should be stateless in their loading; can be 'modulepreload'ed
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
