/*
* tools/prod-index-filter.js
*
* Only applies to ROLLUP production builds; not Vite.
*
* Provide a production version of 'index.html', based on comments within it.
*
* Index syntax:
*   - leave everything, except:
*
*     <!--DEV ...-->     // such a block is for development and gets removed
*     ...
*     <!-- -->
*
*     <!--[DEV,]PROD[,] ...   // such a block is for production. It gets uncommented. Whole first line gets removed (commentary).
*     ...
*     -->
*
*     ${PRELOADS}       // gets replaced by a modulepreloading code for the chunks produced by Rollup
*
*     ${VERSION}        // gets replaced by the 'version' from 'package.json'
*
*     <script ... src=".../mod.#..."         // '#' gets replaced by the hash for 'mod'
*/
import { strict as assert } from 'assert'
import fs from "fs"

/*
* Create a block of:
*   <<
*     <link rel="modulepreload" href="dist/@vue-6ed1e3f4.js">
*     ...
*   <<
*
* Note: 'main' chunk is NOT preloaded. Doing so would allow the browser to compile (and likely run the root source),
*     when we wish to dynamically load it in. Also, we refer to it from HTML anyways, so there is no speedup increase.
*/
function preloadsArr(modFiles) {   // array of "dist/{mod}-{hash}.js" -> array of "<link rel...>"

  console.debug("MODFILES:", modFiles);

  const ret = modFiles
    .filter( fn => ! fn.includes("/main-"))   // skip main chunk
    .map( fn => `<link rel="modulepreload" href="${fn}">` );
  return ret;
}

/*
*/
function productize(contents, hashes, { version }) {    // (String, Map<String,String>, { version: String }) -> String    // may throw
  assert(version, "No '.version'");

  const errors = new Array();

  const modFiles = Array.from( hashes.entries() ).map( ([key,value]) => `dist/${key}-${value}.js` );

  const preloads = preloadsArr(modFiles);   // ["<link ...>", ...]

  // Regex note: '.' for "chars within the same line" and '[\s\S]' for "chars, possibly including newline".

  // DEV blocks (remove)
  //
  const s1 = contents.replace(/^\s*<!--DEV\s.*-->[\s\S]+?^\s*<!--\s+-->\s*\n/gm,"");  // "<!-- DEV block REMOVED -->\n"

  // DEV,PROD blocks (keep the inside)
  //
  const s2 = s1.replace(/^\s*<!--DEV,PROD[,\s].*-->\s*(\n[\s\S]+?)^\s*<!-- -->\s*\n/gm,"$1\n");

  // PROD blocks (uncomment)
  //
  // If the '<!--PROD' has a tail, that is placed as a comment in the output.
  //
  const s3a = s2.replace(/^\s*<!--PROD\s*\n([\s\S]+?)^\s*-->\s*\n/gm, "\n$1\n");
  const s3 = s3a.replace(/^(\s*)<!--PROD +(.*?)\s*\n([\s\S]+?)^\s*-->\s*\n/gm, "$1<!-- $2 -->\n$3\n" );

  // tbd. #rework: For the rest, might be better to go through them line by line, since they don't span multiple lines. (simpler regex)

  // '${PRELOADS}'
  //
  // Note: A bit difficult playing with the white space and regex. '\s' matches also newlines. Is there a way to
  //      "match white space but not newlines" other than '[ \t]'?
  //
  const s4 = s3.replace(/^([ \t]*)\${PRELOADS}[ \t]*$/gm, (_,c1) => preloads.map(x => c1+x).join('\n') );

  // '${VERSION}'
  //
  const s5 = s4.replace(/\${VERSION}/gm, version );

  // Hashes
  //
  // Any '{file}-#.js' to be filled in the hash.
  //
  // Example:
  //  <<
  //    import { init } from './main-#.js'
  //  <<
  //
  // Note: Here, we expect '-' delimiter in Rollup 'output.entryFileNames'.
  //
  const s6 = s5.replace(/'[^']+\/([\w\d]+)-#\.js'/gm,
    (match,c1) => {   // e.g. match="'/main-#.js'", c1="main"
      const hash = hashes.get(c1)
      if (!hash) throw new Error( "No hash for: "+c1 );

      return match.replace('#',hash);
    }
  );

  return errors.length == 0 ? s6
    : new Error( `ERROR(s) in generation of production 'index': ${errors.join()}` );
}

/*
* Rollup plugin to get the chunks and their hashes (as by the 'manualChunks' policy), pass it on to a tool script
* that creates production index.html from the 'index.html' template.
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
