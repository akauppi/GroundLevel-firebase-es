/*
* fns-test/tools/firebase.js
*
* Provide access to an emulator-facing Firebase client (Firestore, Cloud Functions, ...).
*
* - digs current Firestore projectId from '../.firebaserc' (needed for showing data in the Emulator UI)
*/
import { strict as assert } from 'assert'

// Note: Importing JSON is still experimental (behind '--experimental-json-modules'). We read JSON as files, until it's unflagged.
import fs from 'fs'

// This gives:
// <<
//    Error [ERR_UNSUPPORTED_DIR_IMPORT]: Directory import '/Users/asko/Git/GroundLevel-es6-firebase-web/fns-test/node_modules/firebase/app' is not supported resolving ES modules imported from /Users/asko/Git/GroundLevel-es6-firebase-web/fns-test/tools/session.js
// <<
//import * as firebase from 'firebase/app'
//import "firebase/firestore"
//import "firebase/functions"

import firebase from 'firebase/app/dist/index.cjs.js'
import "firebase/firestore/dist/index.cjs.js"
import "firebase/functions/dist/index.cjs.js"

//import firebaseJson from './firebase.json'
const firebaseJson = JSON.parse(
  fs.readFileSync('./firebase.json', 'utf8')
);

const FIRESTORE_HOST = `localhost:${ firebaseJson.emulators.firestore.port }`    // "6768"
const FUNCTIONS_URL = "http://localhost:5001";    // not available in any Firebase config, to read. :(

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

firebase.functions().useFunctionsEmulator(FUNCTIONS_URL);   // must be *after* '.initializeApp'

const fns = firebase.app().functions(/*"europe-west3"*/);

export {
  db,
  fns
}
