/*
* src/firebase/index.js
*
* Provide Firebase handles to application level.
*/
import { getApp } from '@firebase/app'
import { getAuth } from '@firebase/auth'
import { getFirestore, doc, collection } from '@firebase/firestore'

// Design consideration: We could "hide" the database part in here.

const app = getApp();

// Note. 'getAuth' uses `indexedDBLocalPersistence` for persisting the authentication values. For a larger discussion,
//    see 'DEVS.md'.
//
const auth = getAuth(app);
const db = getFirestore(app);

// Helper that reduces the amount of imports needed in application code.
//
function dbDoc(collectionPath, documentId) {
  return doc( collection(db, collectionPath), documentId );
}

export {
  auth,
  db,
  dbDoc
}
