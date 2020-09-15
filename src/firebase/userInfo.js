/*
* src/database/userInfo.js
*
* Functions to deal with 'userInfo' collection.
*
* Note: It is enough to just 'import' this file, to have the 'userInfo' collection track the user's UI info.
*/
assert(firebase.firestore)

const db = firebase.firestore();

import { authRef } from './authRef'

import { watchEffect } from 'vue'

/*
* Sets the UI parts of a user so that people working with them in a project can view display name and an image.
*
* These info are written to a project-independent collection. This way, any login will update (if the data has changed)
* the data in the projects (there's a background mechanism for that).
*/
watchEffect(async () => {
  const auth = authRef.value;

  if (auth) {
    const uid = auth.uid;
    const o = {
      name: auth.displayName,
      photoURL: auth.photoURL
    }

    console.debug("UserInfo: going to write:", uid, o);
    await db.doc(`userInfo/${uid}`).set(o);
    console.debug("UserInfo written");
  }
});

export { }
