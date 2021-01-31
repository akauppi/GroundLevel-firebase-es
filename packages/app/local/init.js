/*
* local/init.js
*
* Prime the emulator with data and users.
*
* Firebase's solutions for backup deal with a compact, binary data format (import/export)[1]. This is suitable for
* production backups but less so for development.
*
* Instead, this code reads JSON from a file. It allows you to view and edit the data, as a human. 👐
*
* Note:
*   - needs to be launched with '--experimental-json-modules' (for reading 'firebase.json')
*     and '--harmony-top-level-await' (for being able to cut the chain on failure)
*
* [1]: "Firestore and Database Emulator: Initialization of an instance with a dataset" (Firebase Issues)
*       -> https://github.com/firebase/firebase-tools/issues/1167
*/
import { docs } from './docs.js'

import { createUsers } from './createUsers.js'

import admin from 'firebase-admin'

// Naming note: 'firebase emulator:exec' sets 'GCLOUD_PROJECT' implicitly. We don't use it, but naming dates from there.
//
const projectId = process.env["GCLOUD_PROJECT"];
if (!projectId) {
  throw new Error("No 'GCLOUD_PROJECT' env.var. set. PLEASE set it explicitly, e.g. like: 'GCLOUD_PROJECT=$(firebase use)'");
}

// Sniff the port
import firebaseJson from '../firebase.json'
const FIRESTORE_HOST = `localhost:${firebaseJson.emulators.firestore.port}`;

async function primeFirestore (adminApp) {

  // tbd. What is the way to inform Firebase admin SDK about Firestore emulation?  DO I still need this?
  //
  adminApp.firestore().settings({   // old way (but works)
    host: FIRESTORE_HOST,
    ssl: false
  });

  const fsAdmin = adminApp.firestore();
  const batch = fsAdmin.batch();

  for (const [docPath,value] of Object.entries(docs)) {
    batch.set( fsAdmin.doc(docPath), value );
  }
  await batch.commit();

  await adminApp.delete();   // clean the app; data remains

  console.info("Primed :)");
}

const adminApp = admin.initializeApp({
  projectId
});

// Using top level await ensures that a failure will cause the larger command ('npm run dev') to fail.
//
await Promise.all([
  primeFirestore(adminApp),
  createUsers()
]);
