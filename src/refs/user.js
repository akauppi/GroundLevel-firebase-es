/*
* src/refs/user.js
*
* For reflecting user sign-in status and details in the UI.
*
* Usage:
*   <<
*     <x v-if="user">    <-- if user is signed in
*       {{ user.displayName }}
*     </x>
*   <<
*
*   'user' is either:
*     - null  // auth has not been established (initial state, should not last long)
*     - { displayName: string, uid: string, ... }   // authenticated
*     - false   // not signed in
*
* References:
*   - Firebase User object documentation
*     -> https://firebase.google.com/docs/reference/js/firebase.User.html
*/
import { onAuthStateChanged } from '../util/auth.js';

import { ref } from 'vue';

console.debug("Loading 'user.js'");   // this should happen just once - REMOVE when ensured

const user = ref(null);   // until auth has been established: like Schrödinger's feline

onAuthStateChanged(o => {   // (firebase user object) => ()
  if (o !== null) {
    if (true) {   // expose *all* of the Firebase user object to the application (may be initially good, bad later
                  // since we don't know which fields the caller really is using?)
      console.log(o);   // DEBUG

      user.value = { ...o };
    } else {      // expose a controlled subset (minimalistic)
      user.value = {
        displayName: o.displayName,
        uid: o.uid
      };
    }
  } else {
    user.value = false
  }

  // DEBUG
  const tmp = user.value ? (({ displayName, uid }) => ({ displayName, uid }))(user.value)   // pick
      : user.value;   // 'false'
  console.log('\'user\' updated: ', tmp);
});

export { user }
