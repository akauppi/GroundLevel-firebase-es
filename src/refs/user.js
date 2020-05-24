/*
* src/refs/user.js
*
* Reflect the Firebase user status, but strip fields that our app does not need.
*
* Usage:
*   <<
*     <x v-if="user.value">    <-- if user is signed in
*       {{ user.displayName }}
*     </x>
*   <<
*
*   'user' is either:
*     - null  // auth has not been established (initial state, should not last long)
*     - { displayName: string, uid: string }   // authenticated
*     - false   // not signed in
*
* References:
*   - Firebase User object documentation
*     -> https://firebase.google.com/docs/reference/js/firebase.User.html
*/
import { fbUser } from '../firebase/auth.js';
import { computed } from 'vue';

const user = computed( () => {   // { displayName: string, uid: string }
  if (fbUser.value) {
    const o = fbUser.value;
    return  {    // expose a controlled subset (minimalistic)
      displayName: o.displayName,
      uid: o.uid
    };
  } else {
    return fbUser.value;    // false|null
  }
});

export { user }
