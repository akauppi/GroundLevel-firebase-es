/*
* src/firebase/index.js
*
* Provide Firebase handles to application level.
*/
import { getFirestore, doc, collection } from '@firebase/firestore'

// Design consideration: We could "hide" the database part in here.

const db = getFirestore();

// Helper that reduces the amount of imports needed in application code.
//
function dbDoc(collectionPath, documentId) {

  // Collection path seems to need to end with '/' (observed in Firestore debug log; 'firebase-tools' 9.10.0)
  //
  if (!collectionPath.endsWith('/')) {    // tbd. change to assert, perhaps? (would be best if Firebase client failed on it)
    console.warn("Adding '/' to collection path:", collectionPath);
    collectionPath = collectionPath+'/';
  }

  return doc( collection(db, collectionPath), documentId );
}

export {
  db,
  dbDoc
}
