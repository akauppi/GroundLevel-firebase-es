// COPY of 'firebaseTesting.js' from 'firebase-jest-testing', until Jest 'globalSetup' can take ES modules...
/*
* sample.rules/tools/firebaseTestingAdmin.cjs
*
* Provide a layer above '@firebase/testing'. Also takes care of providing the 'FIRESTORE_EMULATOR_HOST' to it,
* to keep 'package.json' lighter. We are only interested in working against an emulated Firestore instance.
*
* Usage:
*   - '--harmony-top-level-await' node flag needed (if ESM)
*/
//import { strict as assert } from 'assert'
const assert = require('assert').strict;

//import { firebaseJson } from './config.js'
const firebaseJson = require('./config.cjs');

// Set 'FIRESTORE_EMULATOR_HOST', to guide '@firebase/testing' (unless already set)
//
const tmp = process.env["FIRESTORE_EMULATOR_HOST"];
if (!tmp) {
  process.env["FIRESTORE_EMULATOR_HOST"] = `localhost:${firebaseJson.emulators.firestore.port}`;   // "localhost:6767"

  //console.debug("FIRESTORE_EMULATOR_HOST:", process.env["FIRESTORE_EMULATOR_HOST"]);
}

// Load _dynamically_ so that the changed env.setting applies.
//
//const firebase= await import('@firebase/testing');
const firebase= require('@firebase/testing');   // CommonJS: just keep this below setting the env.

function firestoreTestingAdmin(projectId) {
  const app = firebase.initializeAdminApp({
    projectId
  });

  const db = app.firestore();
  assert (db._settings.host.includes('localhost'));    // just confirming, setting 'FIRESTORE_EMULATOR_HOST' should have made this happen

  return {
    clearAll () {
      firebase.clearFirestoreData({ projectId });
      console.debug(`Data cleared for projectId '${projectId}'.`);
    },
    db
  }
}

module.exports = firestoreTestingAdmin;
