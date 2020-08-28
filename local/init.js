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
*/
import { docs } from './docs.js'
import admin from 'firebase-admin'

let projectId = process.env["GCLOUD_PROJECT"];    // set by 'firebase emulator:exec' (or explicitly)

if (!projectId) {
  const msg = "No 'GCLOUD_PROJECT' env.var. set. PLEASE set it explicitly, e.g. like: 'GCLOUD_PROJECT=$(firebase use)'";
  console.error(msg);
  throw new Error(msg);
}

// Sniff the port
import firebaseJson from '../firebase.json'
const firestoreHost = `localhost:${firebaseJson.emulators.firestore.port}`;

// Note: For dev mode, we can do the priming in the background (not wait for the Promise to return). This is rather
//    instantaneous, anyways. The down side is that errors will not cause the server not to load.
//
//    If you wish to wait until the priming has happened, use top level await (requires '--harmony-top-level-await').
//
(async () => {
  const adminApp = admin.initializeApp({
    projectId
  });

  adminApp.firestore().settings({
    host: firestoreHost,
    ssl: false
  });

  const fsAdmin = adminApp.firestore();

  const batch = fsAdmin.batch();

  for (const [docPath,value] of Object.entries(docs)) {
    batch.set( fsAdmin.doc(docPath), value );
  }

  await batch.commit();
  console.debug("Primed :)");

  await adminApp.delete();   // clean the app; data remains
})();
