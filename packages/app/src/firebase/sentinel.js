/*
* src/firebase/sentinel.js
*
* Provide sentinel values for Firebase Firestore queries.
*
* Note: We handle them slightly differently than the @exp API. It has all sentinels as functions (e.g. 'delete()'),
*   whereas we provide constants. This may be confusing - TESTING HOW IT FEELS in the code.
*/
import { serverTimestamp, documentId } from 'firebase/firestore'

// Firebase @exp 'serverTimestamp' is a function that always creates the same sentinel. Let's just pick the sentinel. :)
//
const serverTimestampSentinel = serverTimestamp();
const documentIdSentinel = documentId();

export {
  serverTimestampSentinel,
  documentIdSentinel
}
