/*
* hack-jest/jestResolver.cjs
*
* To be used until imports of ES native modules with multiple 'exports' works (presumably, in Jest 28).
*
* !!! EXPERIMENTAL !!!
*
* Note: It's really CHEAP that we don't use the 'exports' in the package itself, but this works, and eventually
*    Jest will support 'exports' for real. Also, we've narrowed down to only those entries that we need.
*
* References:
*   - Configuring Jest > resolver (Jest docs)
*     -> https://jestjs.io/docs/en/configuration#resolver-string [1]
*/

// Add mappings to any libraries you use which 'export' more than the default ('.') entry point (Jest 27 takes care of that).
//
const entries = Object.entries({
  // firebase-jest-testing
  "firebase-jest-testing/firestoreAdmin": "./src/firestoreAdmin/index.js",
  "firebase-jest-testing/firestoreAdmin/setup": "./src/firestoreAdmin/setup/index.js",
  "firebase-jest-testing/firestoreRules": "./src/firestoreRules/index.js",
  "firebase-jest-testing/firebaseClientLike": "./src/firebaseClientLike/index.js",

  // firebase-admin
  "firebase-admin/app": "./lib/esm/app/index.js",
  "firebase-admin/firestore": "./lib/esm/firestore/index.js"

}).map( ([k,v]) => {
  const arr = k.match(/(.+?)\//);   // pick the node_modules name
  const name = arr[1] || fail("No '/' in key");
  return [
    k,
    v.replace(/^\.\//, `${name}/`)
  ]
});

const lookup = new Map(entries);

const res = ( request, options ) => {   // (string, { ..see above.. }) => ...

  const hit = lookup.get(request);
  if (hit) {
    return options.defaultResolver( hit, options );   // turned to requiring the file
  } else {
    return options.defaultResolver( request, options );
  }
};

module.exports = res;
