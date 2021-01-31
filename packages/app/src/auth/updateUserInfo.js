/*
* src/firebase/updateUserInfo.js
*
* Maintain 'userInfo' collection.
*
* It is enough to just 'import' this file, to have the 'userInfo' collection track the user's UI info.
*/
import { assert } from '/@/assert'

import firebase from 'firebase/app'
import '@firebase/firestore'

import { ContextError } from "/@xListen/ContextError"   // #rework

const db = firebase.firestore();

import { authRef } from '/@firebase/authRef'

import { watchEffect } from 'vue'

/*
* Updates the UI specific info about the user to a project-independent collection. Cloud Functions will distribute the
* information further, to projects where the user is involved.
*
* tbd. Consider doing this as a sub-collection write.
*/
watchEffect(async () => {
  const auth = authRef.value;

  if (auth) {
    const uid = auth.uid;
    const o = {
      displayName: auth.displayName,
      photoURL: auth.photoURL
    }

    console.debug("UserInfo: going to write:", uid, o);

    try {
      await db.doc(`userInfo/${uid}`).set(o);
    }
    catch(err) {
      throw new ContextError("Writing userInfo", err, { o });
    }

    console.debug("UserInfo written");
  }
});

export { }
