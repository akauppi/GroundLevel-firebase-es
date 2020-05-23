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
import { onAuthStateChanged } from '../firebase/auth.js';
import { ref } from 'vue';

const user = ref(null);   // until auth has been established

onAuthStateChanged(o => {   // (firebase user object) => ()
  if (o !== null) {
    user.value = {    // expose a controlled subset (minimalistic)
      displayName: o.displayName,
      uid: o.uid
    };
  } else {
    user.value = false
  }

  // DEBUG
  const tmp = user.value ? (({ displayName, uid }) => ({ displayName, uid }))(user.value)   // pick
      : user.value;   // 'false'
  console.log('\'user\' updated: ', tmp);
});

export { user }
