/*
* functions/firebase.js
*
* Imported by the modules needing Firebase access.
*/
import { initializeApp } from 'firebase-admin/app'
export { getFirestore } from 'firebase-admin/firestore'

// Note: Once 'initializeApp' is called here, the re-exported 'getDatabase' and 'getFirestore' will "just work"
//    in upper modules (since they execute after this block).
//
/*const app =*/ initializeApp();
