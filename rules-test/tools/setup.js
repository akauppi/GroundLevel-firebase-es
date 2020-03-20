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

  Object.entries(data).forEach( ([docPath,value]) => {
    batch.set( dbAdmin.doc(docPath), value );
  });
  await batch.commit();

  // Engage the rules
  await firebase.loadFirestoreRules({
    projectId: sessionId,
    rules: fs.readFileSync(rulesFilename, 'utf8')
  });

  const apps = [dbAdmin];

  return {
    sessionId: sessionId,

    withAuth: (auth) => {
      const app = firebase.initializeTestApp({
        projectId: sessionId,
        auth
      });
      apps.push(app);

      return app.firestore();
    },
    teardown: () => {   // tbd. close the particular apps created, no others
      apps.forEach( app => app.delete() );
    }
  };
}

export {
  setup
}
