/*
* functions/firebase.js
*
* Imported by the modules needing a Firebase (eg. Firestore) handle.
*/
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Note: 'initializeApp' and 'getFirestore' need to be in the same module, to have their execution order correct
//    (inner modules would execute first, unless we play with dynamic imports).
//
/*const app =*/ initializeApp();
const firestore = getFirestore();

export {
  firestore
}
