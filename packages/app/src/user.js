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

import { onAuthStateChanged, getAuth } from '@firebase/auth'
const auth = getAuth();

import { countLogins } from "/@central/counters.js"

function fail(msg) { throw new Error(msg) }

// Fed either by Firebase auth changes or the router (LOCAL mode)
//
const authRef = ref();   // Ref of undefined | null | { displayName: string, photoURL: string, ... }  ; 'undefined' until auth is warmed up

// Start tracking the user (turn a callback into Vue 'ref').
//
onAuthStateChanged( auth, user => {

  authRef.value = user;    // null | { ..Firebase User object }

  if (user) {
    countLogins();
  }
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
* For subscribers only needing the user id (Sentry, central logging/metrics)
*/
const userIdRef = computed( () => {   // ComputedRef of null | string
  const v = authRef.value;  // undefined | false | { uid: string, ... }

  (v !== undefined) || fail("INTERNAL: 😰");

  if (v) {
    const { uid } = v;
    uid || fail("Auth object without '.uid'");

    return uid;
  } else {
    return null;
  }
});

/*
* Get current user's info.
*
* If needed, wait until Firebase Auth has figured it out (using a Promise avoids an "unknown" state).
*/
async function getCurrentUser() {   // () => Promise of (null | { uid: string, displayName: string, isAnonymous: Boolean, photoURL: string })
  await isReadyProm;

  const v = userRef2.value;
  (v !== undefined) || fail("INTERNAL ERROR: 'undefined' as user");   // if it happens, it's a bug. Rethink the pending.

  return v;
}

/*
* Get current user's id. (as above, just simpler)
*/
async function getCurrentUserId() {   // () => Promise of (null | string)
  return (await getCurrentUser())
    ?.uid;
}

/*
* Non-await version of 'getCurrentUserId' when the code *knows* that the Firebase auth dance must have already taken
* place. E.g. UI that only shows for a logged in user; central logging and monitoring.
*/
function getCurrentUserId_sync() {    // () => null | string
  const tmp = auth.currentUser;

  // Note: The JSDoc states 'auth.currentUser' can only be 'null' or string. It at least used to have 'undefined',
  //    as well, so look out for that.

  (tmp !== undefined) || fail("'auth.currentUser' is undefined");
  return tmp?.uid;
}

/*
* Validator that can be useful for Vue props.
*/
function uidValidator(v) {    // (String) => Boolean
  return v.match(/^[a-zA-Z0-9]+$/);    // e.g. "dev", "7wo7MczY0mStZXHQIKnKMuh1V3Y2"
}

/*
* Watch the logging in/out.
*/
function watchUid(f) {    // ( (string|null) => () ) => ()

  watchEffect( () => {
    const v = userIdRef.value;
    if (v === undefined) return;

    f(v);
  })
}

export {
  userRef2,
  getCurrentUser,
  getCurrentUserId,
  getCurrentUserId_sync,
  uidValidator,
  userIdRef,
  watchUid
}
