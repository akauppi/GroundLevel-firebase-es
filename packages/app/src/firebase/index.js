/*
* src/firebase/index.js
*
* Provide Firebase handles to application level.
*/
import { getAuth } from '@firebase/auth'
import { getFirestore, doc, collection } from '@firebase/firestore'

// Design consideration: We could "hide" the database part in here.

//const auth = getAuth();
const db = getFirestore();

// Helper that reduces the amount of imports needed in application code.
//
function dbDoc(collectionPath, documentId) {
  return doc( collection(db, collectionPath), documentId );
}

export {
  //auth,
  db,
  dbDoc
}
