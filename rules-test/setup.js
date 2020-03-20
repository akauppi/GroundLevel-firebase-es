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

const { data } = require('./data');
assert( typeof data == "object" );

/*
* data: Object with the contents of the collection: { id: value, ... }
* auth: user-id (string) or 'null'
*/
module.exports.setup = async (auth) => {    // ({ uid: string [, email: string] }) => db

  // The test id (project id) is used e.g. for seeing coverage in
  //  -> http://localhost:6767/emulator/v1/projects/<test_id>:ruleCoverage.html
  //
  const testId = `test-${Date.now()}`;   // e.g. 'test-1583506734171'    <-- it's NOT our application level project id
    //
    // sessions persist "on a single emulator run"; the time stamp makes sure we get a clean sheet

  console.log( "Preparing for test id, auth:", testId, auth );

  // Q: There isn't a way in Firebase to make one "app", then augment its use by different
  //    authentication, is there? Since we need to
  //
  const app = await firebase.initializeTestApp({
    testId,
    auth
  });

  const db = app.firestore();

  // Write mock documents before rules
  if (data) {
    for (const k in data) {
      await db.doc(key).set(data[key]);
    }
  }

  // Apply rules
  await firebase.loadFirestoreRules({
    testId,
    rules: fs.readFileSync(rulesFilename, 'utf8')
  });

  return db;
};

// Note: If one calls this, coverage results are no longer available.
//
module.exports.teardown = async () => {
  Promise.all( firebase.apps().map(app => app.delete()) );
};
