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
import { __ } from '../.__.js'; const { projectId } = __;

// Note: For dev mode, we can do the priming in the background (not wait for the Promise to return). This is rather
//    instantaneous, anyways. The down side is that errors will not cause the server not to load.
//
(async () => {
  const adminApp = admin.initializeApp({
    projectId
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
