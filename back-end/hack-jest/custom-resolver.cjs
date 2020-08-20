/*
* back-end/hack-jest/custom-resolver.cjs
*
* The aim: Be able to load 'firebase-jest-testing' as if Jest could load an ES module with 'exports' (2.6.x cannot).
*     THen, we'd just remove this custom resolver, once the support is there. :)   #right
*
* References:
*   - Configuring Jest > resolver (Jest docs)
*     -> https://jestjs.io/docs/en/configuration#resolver-string
*/
const assert = require('assert').strict;

const fjtPkg = require("firebase-jest-testing/package.json");
const pkgName = fjtPkg.name;   // "firebase-jest-testing"

assert(pkgName === 'firebase-jest-testing');

const exps = fjtPkg.exports;

const tmp = Object.entries(exps).map( ([k,v]) => {
  return [
    k.replace(/^\./, 'firebase-jest-testing' ),
    v.replace(/^\.\//, `${pkgName}/`)
  ];
});

const lookup = new Map(tmp);
  // e.g. 'firebase-jest-testing' -> 'firebase-jest-testing/src/index.js'

/*lookup.forEach((v,k) => {   // DEBUG
  console.debug("MAPPED:", k+" -> "+v);
});*/

const res = ( request, options ) => {   // (string, { ..see above.. }) => ...

  if (request.startsWith(pkgName)) {    // "firebase-jest-testing"
    const hit = lookup.get(request);
    //console.debug("Transfer:", request+" -> "+hit);

    if (!hit) throw new Error("No 'exports' lookup for: "+ request);    // better than assert (causes the right module to be mentioned in the error message)

    return options.defaultResolver( hit, options );   // turned to requiring the file
  } else {
    return options.defaultResolver( request, options );
  }
};

module.exports = res;
