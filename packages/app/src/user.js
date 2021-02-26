/*
* src/user.js
*
* Takes care of the different user handling between LOCAL (self-claimed user, for development) and real world
* (Firebase auth). This way, other parts of the code don't need to do if/else's.
*
* Note:
*   Only a few places in the app might be interested in user changes. For a single web page (component), the user is
*   there, and often provided as a prop. They don't change.
*
* References:
*   - Firebase User object documentation
*     -> https://firebase.google.com/docs/reference/js/firebase.User.html
*/
import { computed, ref, watchEffect } from 'vue'

import { onAuthStateChanged } from 'firebase/auth'

import { assert } from './assert'
import { localUserRef } from "./router"

const LOCAL = import.meta.env.MODE === 'dev_local';

// Fed either by Firebase auth changes or the router (LOCAL mode)
//
const authRef = ref();   // Ref of undefined | null | { displayName: string, photoURL: string, ... }  ; 'undefined' until auth is warmed up

// Start tracking the user (turn a callback into Vue 'ref').
//
if (LOCAL) {
  watchEffect( () => {    // pass user from router
    const user = localUserRef.value;
    authRef.value = user;
  });

} else {    // real world
  /*const tailProm = */ (async () => {
    const auth = await import('/@/firebase').then(mod => mod.auth);

    onAuthStateChanged(auth, user => {
      assert(user !== undefined, "[INTERNAL] Mom! Firebase auth gave 'undefined'!")

      authRef.value = user;    // null | { ..Firebase User object }

    });   // ops catches possible errors (never seen)
  })();
}

const isReadyProm = new Promise( (resolve /*,reject*/) => {
  const unsub = watchEffect(() => {
    if (authRef.value !== undefined) {  // auth is awake
      unsub();
      resolve();
    }
  });
});

/*
* Expose only certain user fields.
*
* For the application level that can see users change back and forth. For pages, get the user by props.
*/
const userRef2 = computed( () => {   // Ref of undefined | null | { displayName: string, uid: string }
  const a = authRef.value;  // undefined | false | { displayName: string, uid: string, ... }

  if (a) {
    const o = a;
    return {    // expose a controlled subset (minimalistic)
      uid: o.uid,
      displayName: o.displayName,
      isAnonymous: o.isAnonymous,
      photoURL: o.photoURL
    }
  } else {
    return a    // undefined|null
  }
});

/*
* Asking the current user, by a page.
*/
function getCurrentUserWarm() {   // () => null | { uid: string, displayName: string, isAnonymous: Boolean, photoURL: string }
  const v = userRef2.value;
  assert(v !== undefined, "Too early! Asked for current user but we don't know them, yet!");  // if this happens, need to rethink code flow

  return v;
}

export {
  userRef2,
  getCurrentUserWarm,
  isReadyProm
}
