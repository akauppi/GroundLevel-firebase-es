/*
* src/firebase.js
*
* Provide Firebase handles to application level.
*/
import { getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Design consideration: We could "hide" the database part in here.

const app = getApp();

const auth = getAuth(app);
const firestore = getFirestore(app);

export {
  auth,
  firestore
}
