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

import firebase from 'firebase/app'
import '@firebase/auth'

import { assert } from './assert'

const LOCAL = import.meta.env.MODE === 'dev_local';

const fbAuth = LOCAL ? undefined : firebase.app().auth();

const authRef = ref();   // Ref of undefined | null | { ..Firebase User object }  ; 'undefined' until auth is warmed up

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

    fbAuth.onAuthStateChanged( user => {
      assert(user !== undefined, "[INTERNAL] Firebase told user is 'undefined'" )   // used to do this

      authRef.value = user;    // null | { ..Firebase User object }

      if (!resolved) {
        resolve();
        resolved = true;
      }
    }, err => {
      console.error("Failure in getting user info:", err);    // tbd. deserves 'central' attention
      throw err;
    });
  });
}

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
function getCurrentUserWarm() {   // () => null | { ..Firebase user object }
  const v = userRef2.value;
  assert(v !== undefined, "Too early! Asked for current user but we don't know them, yet!");  // if this happens, need to rethink code flow

  return v;
}

/*** not needed?
// Get the user id when we *know* there is a user logged in.
//
function getCurrentUserIdWarm() {
  const v = getCurrentUserWarm();
  assert(v, "Asking user id with no active user.");
  return v.uid;
}
***/

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

/***
// Sign out
//
function signOut() {
  fbAuth.signOut().then( _ => {
    console.debug("User signed out");
  }).catch( err => {
    central.error("Failed to sign out:", err);    // never seen
  })
}
***/

export {
  userRef2,
  getCurrentUserProm,
  getCurrentUserWarm,
  //getCurrentUserIdWarm,
  setLocalUser,
  //signOut
}
