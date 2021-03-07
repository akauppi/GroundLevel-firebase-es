/*
* rollup/tools/prod-index-filter.js
*
* Creates a production version of 'index.html', based on comments within a template.
*
* Index syntax:
*   - leave everything, except:
*
*     ${PRELOADS}       // replaced by a modulepreloading code for the chunks produced by Rollup
*
*     ${VERSION}        // replaced by the 'version' from 'package.json'
*
*     <script ... src=".../mod.#..."         // '#' gets replaced by the hash for 'mod'
*/
import { strict as assert } from 'assert'
import fs from 'fs'

/*
* Create a block of:
*   <<
*     <link rel="modulepreload" href="dist/@vue-6ed1e3f4.js">     <-- tbd. update with non-vue sample
*     ...
*   <<
*
* Note: 'app' chunk is NOT preloaded. Doing so would allow the browser to compile (and likely run the root source),
*     when we wish to dynamically load it in. Also, we refer to it from HTML anyways, so there is no speedup increase.
*     tbd. ^-- review comment
*/
function preloadsArr(modFiles) {   // array of "dist/{mod}-{hash}.js" -> array of "<link rel...>"

  console.debug("MODFILES:", modFiles);

  const ret = modFiles
    .filter( fn => ! fn.includes("/main-"))   // skip boot chunk
    .map( fn => `<link rel="modulepreload" href="${fn}">` );
  return ret;
}

/*
*/
function productize(contents, hashes, { version }) {    // (String, Map<String,String>, { version: String }) -> String    // may throw
  assert(version, "No '.version'");

  const modFiles = Array.from( hashes.entries() ).map( ([key,value]) => `dist/${key}-${value}.js` );

  const preloads = preloadsArr(modFiles);   // ["<link ...>", ...]

  // Regex note: '.' for "chars within the same line" and '[\s\S]' for "chars, possibly including newline".

  // The rest are per-line replacements.
  //
  const outArr = contents.split('\n').map( s => {
    // '${PRELOADS}'
    const s2 = s.replace(/^(\s*)\${PRELOADS}\s*$/, (_,c1) => preloads.map(x => c1+x).join('\n') );
    if (s2 !== s) return s2;    // note: may (does) contain newlines

    // '${VERSION}'
    const s3 = s.replace(/\${VERSION}/, version );
    if (s3 !== s) return s3;

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
* Rollup plugin to get the chunks and their hashes (as by the 'manualChunks' policy), pass it on to a tool script
* that creates production 'index.html' from a template.
*
* Based on 'modulepreloadPlugin' by Philip Walton
*   -> https://github.com/philipwalton/rollup-native-modules-boilerplate/blob/master/rollup.config.js#L63-L84
*/
const prodIndexPlugin = ({ template, out, map }) => {    // ({ template: String (filename), out: String (filename), map { version: str } }) => { ...Rollup plugin object... }
  return {
    name: 'prodIndex',
    generateBundle(options, bundle) {
      const files = new Set();   // Set of e.g. 'main-e40530d8.js', ...

      // Loop through all the chunks
      for (const [fileName, chunkInfo] of Object.entries(bundle)) {
        if (chunkInfo.isEntry || chunkInfo.isDynamicEntry) {
          console.debug(`Chunk imports of ${fileName}:`, chunkInfo.imports);   // dependent modules

          [fileName, ...chunkInfo.imports]    // others than 'main' only show up in the imports
            .forEach( x => files.add(x) );
        }
      }

      const hashes = new Map();
      files.forEach( x => {
        const [_,c1,c2] = x.match(/^(.+)-(.+)\.js$/);
        hashes.set(c1,c2);
      });

      console.debug( "Working with module hashes:", hashes );

      const templateText = fs.readFileSync(template, 'utf8');
      const prodText = productize(templateText, hashes, map);

      // Note: Not using Rollup's 'this.emitFile' since there's no need (Q: what would be the use case for it?).
      fs.writeFileSync(out, prodText);
    },
  };
};

export { prodIndexPlugin }
