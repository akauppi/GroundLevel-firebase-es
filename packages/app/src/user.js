/*
* src/user.js
*
* The sole arbitrator of user signed in/out information.
*
* Takes care of the different user handling between LOCAL (self-claimed user, for development) and real world
* (Firebase auth). This way, other parts of the code don't need to do if/else's.
*
* Note:
*   Web pages shouldn't really need to subscribe to changes of user. From their (life cycle's) point of view, the user
*   is stable, or at the most signs in/out (but does not change).
*
* References:
*   - Firebase User object documentation
*     -> https://firebase.google.com/docs/reference/js/firebase.User.html
*/
import { computed, ref } from 'vue'
import { onUserChange } from '@akauppi/aside-keys'

import { assert } from './assert'

const LOCAL = import.meta.env.MODE === 'dev_local';

const authRef = ref();   // '.value' is 'undefined' until auth has been established

// Start tracking the user (turn a callback into Vue 'ref').
//
let isReadyProm;    // Promise of ()
if (LOCAL) {
  isReadyProm = Promise.resolve();   // we're ready

  // tbd. do an 'onLocalUserChange' where the access of 'setLocalUser' is reversed
  /*onLocalUserChange( user => {

  })*/

} else {  // real world
  isReadyProm = new Promise( (resolve/*,reject*/) => {
    let resolved = false;

    onUserChange(user => {
      if (user === undefined) {
        console.warn("'onUserChange' leaks an 'undefined' - it should not! (ignored)");   // tbd. fix - it's a #BUG
        return;
      }

      authRef.value = user;    // { ... } | null

      if (!resolved) {
        resolve();
        resolved = true;
      }
    }, err => {
      console.error("Failure in getting user info:", err);
    });
  });
}

/*
* 'userRef' should not be needed by pages; it's for the application level that can see users change back and forth.
* For pages, use 'getCurrentUser()' and 'getCurrentUserId()'.
*/
const userRef2 = computed( () => {   // Ref of undefined | false | { displayName: string, uid: string }
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
function getCurrentUserWarm() {
  const v = userRef2.value;
  assert(v !== undefined, "Too early! Asked for current user but we don't know them, yet!");  // if this happens, need to rethink code flow

  return v;
}

// Note: It's either this, or providing another means for a component to get the user id. Try the props. #later
//
function getCurrentUserId() {
  return getCurrentUserWarm().uid;
}

/*
* Asking the current user, when the auth pipeline might still be warming up.
*/
async function getCurrentUserProm() {
  await isReadyProm;
  return getCurrentUserWarm();
}

// tbd. for now, only; we'd eventually like the control to be reversed: 'router.js' providing a 'onLocalUser' callback
//    that we can call (here); keeps 'authRef' a bit more private.
//
const setLocalUser = LOCAL && ((o) => {   // called by router
  authRef.value = o;
});

export {
  userRef2,
  getCurrentUserProm,
  getCurrentUserWarm,
  getCurrentUserId,
  setLocalUser,
}
