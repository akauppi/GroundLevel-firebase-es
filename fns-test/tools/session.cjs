/*
* fns-test/tools/session.cjs
*
* COMMON JS VARIANT. NEEDED by the initialization script (run by plain 'node'). WHEN JEST ALLOWS US TO USE 'type: module',
* we can SCRAP THIS!!!
*
* Tools to:
*   - dig current Firestore projectId from '../.firebaserc' (needed for showing data in the Emulator UI)
*   - access the emulated Firestore data in Jest tests
*
* Usage:
*   - import 'projectId' to get the project ID
*   - import 'db' to get a handle to the primed data
*/
//import { strict as assert } from 'assert'
//import fs from 'fs'

//import * as firebase from 'firebase'

const assert = require('assert').strict;
const fs = require('fs');

const firebase = require('firebase');

// tbd. take this from a fake '../firebase.json' field (or env.var set in 'package.json')
const FIRESTORE_HOST = "localhost:6768";

const projectId = (function parseDotFirebaseRc() {
  const fn = "./.firebaserc";

  const raw = fs.readFileSync(fn);
  const o = JSON.parse(raw);

  const vs = Object.values(o["projects"]);
  //console.debug(vs);
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

assert( db.close === undefined );
db.close = async () => { await app.delete(); }

/*export {
  //projectId,
  db
}*/

module.exports = db
