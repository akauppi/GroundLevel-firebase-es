/*
* local/init.js
*
* Prime the emulator with data.
*
* Firebase's solutions for backup deal with a compact, binary data format (import/export)[1]. This is suitable for
* production backups but less so for development.
*
* Instead, this code reads JSON from a file. It allows you to view and edit the data, as a human. 👐
*
* [1]: "Firestore and Database Emulator: Initialization of an instance with a dataset" (Firebase Issues)
*       -> https://github.com/firebase/firebase-tools/issues/1167
*
* Note:
*   When coding this, also tried with Firebase admin library ('firebase-admin'), but got this working first
*   ('@firebase/testing').
*
* ‼️ WARNING ‼️
*   If using ES6 imports ('package.json' having 'type': "module"), YOU WON'T GET ERROR MESSAGES. Switch to 'require'
*   (elaborate) if there are quirks.
*/

/* ES6 loading - 'type': "module" in package.json */
import { docs } from './data.js';
import firebase from '@firebase/testing';     // note: must be imported like this, not 'import * as firebase ..'
import { __ } from '../.__.js'; const { projectId } = __;

/* CommonJS - for error messages! *
const docs = require('./data.js');
const projectId = "vue-rollup-example"    // must match that in '.firebaserc'
const firebase = require('@firebase/testing');
*/

const adminApp = firebase.initializeAdminApp({
  projectId
});

const fsAdmin = adminApp.firestore();

(async () => {    // Node 14 - no top-level-await
  const batch = fsAdmin.batch();

  for (const [docPath,value] of Object.entries(docs)) {
    batch.set( fsAdmin.doc(docPath), value );
  }

  console.debug("Priming...");
  await batch.commit();
  console.debug("Primed :)");

  await adminApp.delete();   // clean the app; data remains
})();
