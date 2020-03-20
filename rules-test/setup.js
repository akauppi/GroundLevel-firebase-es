/*
* rules-test/setup.js
*
* Sets up the database with
*   - certain data
*   - given auth uid (or 'null')
*
* Adapted from:
*   - Testing Firestore Security Rules With the Emulator (article, Oct 2018)
*     -> https://fireship.io/lessons/testing-firestore-security-rules-with-the-emulator/
*/
const firebase = require('@firebase/testing');
const fs = require('fs');

// NOTE: Sync this with what's in 'firebase.json'
const rulesFilename = 'dut.rules';

// tbd. consider using the same 'testId' for all the auth variations. Would that work?

const assert = require('assert').strict;

import { data } from './data';
assert( typeof data == "object" );

/*
* data: Object with the contents of the collection: { id: value, ... }
* auth: user-id (string) or 'null'
*/
async function setup(auth) {    // ({ uid: string [, email: string] } | undefined) => db

  // The test id (project id) is used e.g. for seeing coverage in
  //  -> http://localhost:6767/emulator/v1/projects/<test_id>:ruleCoverage.html
  //
  const testId = `test-${auth ? auth.uid : 'noauth'}-${Date.now()}`;   // e.g. 'test-abc-1583506734171'
    //
    // sessions persist "on a single emulator run"; the time stamp makes sure we get a clean sheet

  console.log( "Preparing for test id, auth:", testId, auth );

  const dbNormal = await firebase.initializeTestApp({
    projectId: testId,
    auth
  }).firestore();

  // Using admin API to set the initial data - bypasses rules (though they are not up, yet, either).
  //
  const dbAdmin = firebase.initializeAdminApp({
    projectId: testId
  }).firestore();

  const batch = dbAdmin.batch();

  Object.entries(data).forEach( ([docPath,value]) => {
    batch.set( dbAdmin.doc(docPath), value );
  });
  await batch.commit();

  await firebase.loadFirestoreRules({
    projectId: testId,
    rules: fs.readFileSync(rulesFilename, 'utf8')
  });

  return dbNormal;
}

// Note: If one calls this, coverage results are no longer available.
//
async function teardown() {
  Promise.all( firebase.apps().map(app => app.delete()) );
}

export {
  setup, teardown
}
