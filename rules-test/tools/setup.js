/*
* rules-test/tools/setup.js
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

const assert = require('assert').strict;

/*
* Set up an emulated Firestore session, with data and security rules.
*/
async function setup(sessionId, data) {    // (string, { <document-path>: { <field>: any }}) => { sessionId: string, withAuth: ({ uid: string [, email: string] } | undefined) => db }

  // Using admin API to set the initial data - bypasses rules (though they are not up, yet, either).
  //
  const dbAdmin = firebase.initializeAdminApp({
    projectId: sessionId
  }).firestore();

  const batch = dbAdmin.batch();

  for (const [docPath,value] of Object.entries(data)) {
    console.debug("Setting: ", docPath, value);  // DEBUG
    batch.set( dbAdmin.doc(docPath), value );
  }
  await batch.commit();

  /* disabled
  // TEST: did we get it through (yes we did); DEBUG
  for (const [docPath,_] of Object.entries(data)) {
    const v = await dbAdmin.doc(docPath).get();
    console.debug("Read back: ", docPath, v);
  }
  */
  
  const dbs = [dbAdmin];

  return {
    sessionId: sessionId,

    withAuth: (auth) => {
      const db = firebase.initializeTestApp({
        projectId: sessionId,
        auth
      }).firestore();
      dbs.push(db);

      return db;
    },
    teardown: async () => {   // tbd. close the particular apps created, no others
      const proms = dbs.map( db => db.app.delete() );
      return Promise.all(proms);
    }
  };
}

export {
  setup
}
