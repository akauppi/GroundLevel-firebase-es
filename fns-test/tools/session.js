/*
* fns-test/tools/session.js
*
* ES 6 (main) VARIANT. Use by the Jest tests.
*
* Tools to:
*   - dig current Firestore projectId from '../.firebaserc' (needed for showing data in the Emulator UI)
*   - access the emulated Firestore data in Jest tests
*
* Usage:
*   - import 'projectId' to get the project ID
*   - import 'db' to get a handle to the primed data
*/
import { strict as assert } from 'assert'
import fs from 'fs'

// This gives:
// <<
//    Error [ERR_UNSUPPORTED_DIR_IMPORT]: Directory import '/Users/asko/Git/GroundLevel-es6-firebase-web/fns-test/node_modules/firebase/app' is not supported resolving ES modules imported from /Users/asko/Git/GroundLevel-es6-firebase-web/fns-test/tools/session.js
// <<
//import * as firebase from 'firebase/app'
//import "firebase/firestore"

import firebase from 'firebase/app/dist/index.cjs.js'
import "firebase/firestore/dist/index.cjs.js"

assert(firebase.initializeApp);
assert(firebase.firestore);

// Note: Importing JSON is still experimental (Node 14.7); can be enabled with '--experimental-json-modules'
//
//import firebaseJson from './firebase.json'
const firebaseJson = JSON.parse(
  fs.readFileSync('./firebase.json', 'utf8')
);

const FIRESTORE_HOST = `localhost:${ firebaseJson.emulators.firestore.port }`    // "6768"

const projectId = (() => {
  const o = JSON.parse(
    fs.readFileSync('./.firebaserc', 'utf8')
  );
  const vs = Object.values(o["projects"]);
  assert(vs.length === 1);

  return vs[0];
})();

/*
* Initialize access to Firestore and provide a handle.
*/
const app = firebase.initializeApp({
  projectId,
  auth: null    // unauth is enough
});

const db = firebase.firestore();
db.settings({         // affects all subsequent use (and can be done only once)
  host: FIRESTORE_HOST,
  ssl: false
});

export {
  db
}
