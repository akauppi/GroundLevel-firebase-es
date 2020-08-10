/*
* fns-test/tools/db.js
*
* Provide access to an emulator-facing Firebase client for Firestore.
*
* Usage: On applications where 'db' is used, the caller must release the Firebase app as such:
*   <<
*     db.app.delete();
*   <<
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

import firebase from 'firebase/app/dist/index.cjs.js'
import "firebase/firestore/dist/index.cjs.js"

import { projectId } from './projectId.js'

//import firebaseJson from './firebase.json'
const firebaseJson = JSON.parse(
  fs.readFileSync('./firebase.json', 'utf8')
);

const FIRESTORE_HOST = `localhost:${ firebaseJson.emulators.firestore.port }`    // "6768"

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
