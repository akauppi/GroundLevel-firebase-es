/*
* tools/prod-index-update.js
*
* Create 'public/index.prod.html', based on 'index.html' and a set of bundles created / to be created by Rollup.
*
* Usage:
*   <<
*     ...
*   <<
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
*     <script ... src=".../mod.#..."         // '#' gets replaced by the hash for 'mod'
*/

import fs from 'fs';
import path from 'path';

/*
* Create a block of:
*   <<
*     <link rel="modulepreload" href="dist/@vue-6ed1e3f4.js">
*     ...
*   <<
*/
function preloadsArr(modFiles) {   // array of "dist/{mod}[-.]{hash}.js" -> array of "<link rel...>"

  const ret = modFiles.map( fn => `<link rel="modulepreload" href="${fn}">` );
  return ret;
}

/*
*
*/
function productize(contents, hashes) {    // (String, Map<String,String>) -> String    // may throw
  console.debug(hashes);
  console.debug(hashes.get("main"));

  const errors = new Array();

  const modFiles = Array.from( hashes.entries() ).map( ([key,value]) => `dist/${key}${key !== "main" ? '-':'.'}${value}.js` );

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

  // '${PRELOADS}'
  //
  // Note: A bit difficult playing with the white space and regex. '\s' matches also newlines. Is there a way to
  //      "match white space but not newlines" other than '[ \t]'?
  //
  const s4 = s3.replace(/^([ \t]*)\$\{PRELOADS\}[ \t]*$/gm, (_,c1) => preloads.map(x => c1+x).join('\n') );

  // Hashes
  //
  // Any '/{file}[.-]#.js' to be filled in the hash.
  //
  // Example: <script type="module" src="/dist/main.#.js"></script>
  //
  // Note: For some reason, Rollup uses '.' for main but '-' for others. We act as we don't mind.. :? (maybe it's us..)
  //
  const s5 = s4.replace(/(?<=<script [^>]*src=")[^>]*\/([\w\d]+)[.-]#.js(?=")/gm,  // yay for anchorbacks and -forwards! ⚓️
    (match,c1) => {   // c1: e.g. "main"
      const hash = hashes.get(c1)
      if (!hash) throw new Error( "No hash for: "+c1 );

      return match.replace('#',hash);
    }
  );

  return errors.length == 0 ? s5
    : new Error( `ERROR(s) in filtering: ${errors.join()}` );
}

/*** EARLY WORK
// If run from command line:
//
// Usage:
//  <<
//    $ node tools/prod-index-filter.js index.js     # picks up hashes from public/dist/*-{hash}.js
//  <<
//
const index = process.argv[2];

if (index) {
  // Provide some (fake) hashes
  //
  const hashes = new Map([
    ["@vue", "6ed1e3f4"],
    ["firebase", "1a5e90d9"],
    ["main", "586873f5"],
    ["tslib", "42f2fcab"],
    ["vue", "77959f83"],
    ["vue-router", "7aecbdce"]
  ]);

  const contents = fs.readFileSync(index, 'utf8');

  let out;
  try {
    out = productize(contents, hashes);
  }
  catch(err) {
    console.error(err.message);
    process.exit(-10);
  }

  process.stdout.write(out);
}
***/

export { productize }
