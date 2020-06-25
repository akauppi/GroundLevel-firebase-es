/*
* local/init.js
*
* Prime the emulator with data.
*
* Note:
*   The official solution by Firebase is to use the export/import features (see https://github.com/firebase/firebase-tools/issues/1167 ).
*   This stores the data in a compact but unreadable (for humans) format.
*
* Our approach is to read JSON data from a file. This allows you to hand edit it to your liking.
*
* Note:
*   When coding this, also tried with Firebase admin library ('firebase-admin'). Got it working first with
*   '@firebase/testing' - which may be more suitable to development.
*
* !WARNING!
*   If using ES6 imports ('package.json' having 'type': "module"), YOU WON'T GET ERROR MESSAGES. Switch to 'require'
*   (elaborate) if there are quirks.
*/

/* ES6 loading - 'type': "module" in package.json */
import { docs } from './data.js';
import firebase from '@firebase/testing';
import tmp from '../__.js'; const { projectId } = tmp;

/* CommonJS - for error messages! *
*
const docs = require('./data.js');
const projectId = "vue-rollup-example"    // must match that in '.firebaserc'

const firebase = require('@firebase/testing');
*/

/*
* tbd. Wait until emulator has started - allows us to use 'concurrently' instead of 'start-server-and-test'.
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
