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
import { assert } from '/@tools/assert'

import { setDoc } from 'firebase/firestore'

import { userRef2 } from '/@/user'
import { watch } from 'vue'

import { dbD } from '/@data/common'

/*
* Updates the UI specific info about the user to a project-independent collection. Cloud Functions will distribute the
* information further, to projects where the user is involved.
*
* tbd. Consider doing this as a sub-collection write.
*/
watch( userRef2, (user) => {  // undefined | null | { ..Firebase user object }

  if (user) {
    const uid = user.uid;
    const o = {
      displayName: user.displayName,
      photoURL: user.photoURL
    }
    console.debug(`UserInfo: going to write: ${uid} ->`, o);

    /*const tail =*/ setDoc( dbD(`userInfo/${uid}`), o )
      .then(_ => {
        console.debug("UserInfo written");
      })
      .catch(err => {
        throw new Error(`Writing userInfo/${uid}: ${err}`);
      });
  }
});

export { }
