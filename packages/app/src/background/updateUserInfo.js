/*
* src/background/updateUserInfo.js
*
* Maintains the 'userInfo' collection.
*
* When the user authenticates, some of their data is persisted in Firestore, to provide "beef" for the
* other users to see member name, picture.
*
* tbd. Study if there's a Cloud Functions trigger for people authenticating with the service. If there is, we can
*     move this to the back end.
*
* This code is completely separate from the web app. It listens to Firebase auth directly.
*/
//import { assert } from '/@/assert'

import firebase from 'firebase/app'
import '@firebase/firestore'
import '@firebase/auth'

import { userRef2 } from '/@/user'
import { watch } from 'vue'

import { ContextError } from "/@xListen/ContextError"   // #rework

const LOCAL = import.meta.env.MODE === 'dev_local';

if (LOCAL) {
  throw new Error("'updateUserInfo' is not for the LOCAL mode");
}

const db = firebase.firestore();

/*
* Updates the UI specific info about the user to a project-independent collection. Cloud Functions will distribute the
* information further, to projects where the user is involved.
*
* tbd. Consider doing this as a sub-collection write.
*/
watch(
  () => userRef2,
  user => {   // undefined | null | { ..Firebase user object }
    if (user === undefined) return;   // skip

    if (user) {
      const uid = user.uid;
      const o = {
        displayName: user.displayName,
        photoURL: user.photoURL
      }
      console.debug(`UserInfo: going to write: ${uid} ->`, o);

      const prom = db.doc(`userInfo/${uid}`).set(o);

      prom.then( _ => {
          console.debug("UserInfo written");
        })
        .catch( err => {
          throw new ContextError("Writing userInfo", err, { o });
        });
    }
  }
);

export { }
