/*
* fns-test/tools/fns.js
*
* Provide access to an emulator-facing Firebase client (Cloud Functions).
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

import { projectId } from './projectId.js'

//import firebaseJson from './firebase.json'
const firebaseJson = JSON.parse(
  fs.readFileSync('./firebase.json', 'utf8')
);

const FUNCTIONS_URL = "http://localhost:5001";    // not available in any Firebase config, to read. :(

/*
* Initialize access to Firestore and provide a handle.
*/
const app = firebase.initializeApp({
  projectId,
  auth: null    // unauth is enough
});

firebase.functions().useFunctionsEmulator(FUNCTIONS_URL);   // must be *after* '.initializeApp'

const fns = firebase.app().functions(/*"europe-west3"*/);

export {
  fns
}
