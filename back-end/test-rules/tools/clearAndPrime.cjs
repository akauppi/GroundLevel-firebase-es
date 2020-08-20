/*
* back-end/test-rules/tools/clearAndPrime.cjs
*
* Using '@firebase/testing' library, clear the existing data and replace with given.
*
* NOTE: Once this is possible using ES modules, we can consider placing it as part of 'firebase-jest-testing'.
*     For now, it remains within the sample.
*/
//import { strict as assert } from 'assert'
const assert = require('assert').strict;

const PRIME_ROUND = !global.afterAll;   // are we called from 'globalSetup'
assert(PRIME_ROUND);

// import { clearAll, dbAdmin } from 'firebase-jest-testing/firestoreTesting/admin'   // something like so, later..
const firestoreTestingAdmin = require('../hack-cjs/firestoreTestingAdmin.cjs');

/*
* Clear a database and prime it with data
*
* Note: It is enough to call this once, per Jest test run (via 'globalSetup').
*/
async function clearAndPrime(projectId, docs) {    // (string, { <docPath>: { <field>: <value> } }) => Promise of ()
  assert(PRIME_ROUND);

  const fst = firestoreTestingAdmin(projectId);
  fst.clearAll();   // clear any earlier data

  const {db} = fst;

  const batch = db.batch();

  for (const [docPath,value] of Object.entries(docs)) {
    batch.set( db.doc(docPath), value );
  }
  await batch.commit();

  /*await*/ const ignore = db.app.delete();    // clean the app; data remains (free running Promise)
}

module.exports = clearAndPrime;
