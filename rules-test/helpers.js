/*
* rules-test/helpers.js
*
* Tools for access rule tests.
*
* Adapted from:
*   - Testing Firestore Security Rules With the Emulator (article, Oct 2018)
*     -> https://fireship.io/lessons/testing-firestore-security-rules-with-the-emulator/
*/
const firebase = require('@firebase/testing');
const fs = require('fs');

const USER = process.env.USER;
const rulesFilename = 'firestore.rules';

module.exports.setup = async (auth, data) => {
  const projectId = `test-${Date.now()}`;   // e.g. 'test-1583506734171'
    //
    // sessions persist "on a single emulator run"; the time stamp makes sure we get a clean sheet

  const app = await firebase.initializeTestApp({
    projectId,
    auth
  });

  const db = app.firestore();

  // Write mock documents before rules
  if (data) {
    for (const key in data) {
      const ref = db.doc(key);
      await ref.set(data[key]);
    }
  }

  // Apply rules
  await firebase.loadFirestoreRules({
    projectId,
    rules: fs.readFileSync(rulesFilename, 'utf8')
  });

  return db;
};

module.exports.teardown = async () => {
  Promise.all(firebase.apps().map(app => app.delete()));
};

