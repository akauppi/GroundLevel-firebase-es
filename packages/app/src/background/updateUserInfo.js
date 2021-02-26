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
import { assert } from '/@/assert'

import { setDoc } from '/@/firebase'

import { userRef2 } from '/@/user'
import { watchEffect } from 'vue'

import { dbD } from '/@data/common'

/*
* Updates the UI specific info about the user to a project-independent collection. Cloud Functions will distribute the
* information further, to projects where the user is involved.
*
* tbd. Consider doing this as a sub-collection write.
*/
watchEffect( () => {
  const user = userRef2.value;  // undefined | null | { ..Firebase user object }

  if (user) {
    const uid = user.uid;
    const o = {
      displayName: user.displayName,
      photoURL: user.photoURL
    }
    console.debug(`UserInfo: going to write: ${uid} ->`, o);

    const prom = setDoc(dbD(`userInfo/${uid}`), o);

    prom.then(_ => {
      console.debug("UserInfo written");
    })
    .catch(err => {
      throw new Error(`Writing userInfo: ${err}`);
    });
  }
});

export { }
