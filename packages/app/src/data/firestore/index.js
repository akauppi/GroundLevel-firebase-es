/*
* src/firebase/firestore.js
*
* Provide Firestore handles to application level.
*
* The idea is that *this* code interfaces with the upstream Firebase library, and not the rest. Avoids confusion of
* imports from '@firebase/' vs. './firebase/'.
*/
import {getFirestore, doc, collection, serverTimestamp, documentId} from '@firebase/firestore'

const db = getFirestore();

// Helper that reduces the amount of imports needed in application code.
//
function dbDoc(collectionPath, documentId) {  // (string, string) => DocumentRef

  // Collection path seems to need to end with '/' (observed in Firestore debug log; 'firebase-tools' 9.10.0)
  //
  // Note: would be best if Firebase client failed on it.
  //
  (!collectionPath.endsWith('/'))
    || fail(`Collection path must end in '/': ${collectionPath}` );

  return doc( collection(db, collectionPath), documentId );
}

// Firebase 9.x 'serverTimestamp' is a function that always creates the same sentinel.
//
const serverTimestampSentinel_EXP = serverTimestamp();
const documentIdSentinel_EXP = documentId();

function fail(msg) { throw new Error(msg) }

export {
  dbDoc,
  serverTimestampSentinel_EXP,
  documentIdSentinel_EXP
}
