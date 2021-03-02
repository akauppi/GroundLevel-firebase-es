/*
* back-end/test-rules/tools/clearAndPrime.cjs
*
* Using 'firebase-admin' library, clear the existing data and replace with given.
*
* NOTE: Once Jest 'globalSetup' can use ES modules, we should make this one.
*/
//import { strict as assert } from 'assert'
const assert = require('assert').strict;

const PRIME_ROUND = !global.afterAll;   // are we called from 'globalSetup'
assert(PRIME_ROUND);

// import { clearAll, prime } from 'firebase-jest-testing/fireStore'
const cjsTools = require('firebase-jest-testing/cjs'); const { clearFirestoreData, prime } = cjsTools;

// We just know it (from 'firebase-jest-testing')   #later: once we're in ESM, let's make an API that exposes it?
//
const projectId = "rules-test";

/*
* Clear a database and prime it with data
*
* Note: It is enough to call this once, per Jest test run (via 'globalSetup').
*/
async function clearAndPrime(docs) {    // ({ <docPath>: { <field>: <value> } }) => Promise of ()
  await clearFirestoreData({projectId});
  await prime(projectId, docs);

  console.debug("Cleared and primed!");
}

//export { cleanAndPrime }
module.exports = clearAndPrime;
