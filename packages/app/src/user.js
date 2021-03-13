/*
* src/user.js
*
* Takes care of the different user handling between LOCAL (self-claimed user, for development) and real world
* (Firebase auth). This way, other parts of the code don't need to do if/else's.    // <-- tbd. revise comment
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

import { onAuthStateChanged } from '@firebase/auth'
import { auth } from '/@firebase'

import { assert } from '/@tools/assert'

// Fed either by Firebase auth changes or the router (LOCAL mode)
//
const authRef = ref();   // Ref of undefined | null | { displayName: string, photoURL: string, ... }  ; 'undefined' until auth is warmed up

// Start tracking the user (turn a callback into Vue 'ref').
//
onAuthStateChanged(auth, user => {

  authRef.value = user;    // null | { ..Firebase User object }

  /*** disabled
  // DEBUG: Compare with 'Auth.currentUser'
  //
  const currentUser = auth.currentUser;
  if (user ? !currentUser : currentUser) {
    console.error("[FIREBASE INTERNAL MISMATCH]:", {user: user?.uid, currentUser: currentUser?.uid})
  } else {
    console.info("*** Users in sync:", {user: user?.uid, currentUser: currentUser?.uid})
  }
  ***/
},
  // Documentation does NOT state what will happen if we don't provide an error handler. So let's provide one. #firebase
  //
  (err) => {
    central.fatal("Auth failed:", err);   // never seen?
    throw err;
});

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
*
* Note: It's good to have two level reactivity in Vue ('ref' and then 'computed'); this allows the exposed 'Ref' to be
*       read-only. It is the only way the author knows that this can be achieved.
*/
const userRef2 = computed( () => {   // ComputedRef of undefined | null | { uid: string, displayName: string, isAnonymous: Boolean, photoURL: string }
  const v = authRef.value;  // undefined | false | { displayName: string, uid: string, ... }

  if (v) {
    const o = v;
    return {    // expose a controlled subset (minimalistic)
      uid: o.uid,
      displayName: o.displayName,
      isAnonymous: o.isAnonymous,
      photoURL: o.photoURL
    }
  } else {
    return v;   // undefined|null
  }
});

/*
* Asking the current user, when the caller knows there must be one.
*/
function getCurrentUserWarm() {   // () => null | { uid: string, displayName: string, isAnonymous: Boolean, photoURL: string }
  const v = userRef2.value;
  assert(v !== undefined, "Too early! Asked for current user but we don't know them, yet!");  // if this happens, need to rethink code flow

  return v;
}

/*
* Validator that can be useful for Vue props.
*/
function uidValidator(v) {    // (String) => Boolean
  return v.match(/^[a-zA-Z0-9]+$/);    // e.g. "dev", "7wo7MczY0mStZXHQIKnKMuh1V3Y2"
}

export {
  userRef2,
  getCurrentUserWarm,
  isReadyProm,
  uidValidator
}
