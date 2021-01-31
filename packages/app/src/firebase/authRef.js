/*
* src/firebase/authRef.js
*
* Application interfacing to the authentication: is the user signed in, information about them.
*
* We handle Firebase API; pages don't need to know it ('SignIn' and 'AppProfile' being exceptions; and 'shareMyActivity',
* things that are closer to Firestore than the app).
*
* Note:
*     Module loading cannot be delayed, until the "top-level await" proposal is in. We try to handle this in the router
*     implementation - making sure pages don't get accessed before Firebase knows whether the user is "in" our "out".
*
*     For our users, this means:
*       - 'userRef.value' may be 'null' in certain circumstances but it will shortly (~ 300..500ms) turn to 'false' or
*         an object.
*
* References:
*   - firebase.auth.Auth (Firebase docs)
*       -> https://firebase.google.com/docs/reference/js/firebase.auth.Auth
*/
import { assert } from '/@/assert'

import firebase from 'firebase/app'
import '@firebase/auth'

import { ref } from 'vue'

import { ContextError } from '/@xListen/ContextError.js'

// tbd. Consider making a custom Vue 3 reference that fails with noise if authentication isn't determined, yet (or
//    better yet, waits for it). :)
//
//    See -> https://composition-api.vuejs.org/api.html#customref

const authRef = ref();   // '.value' is 'undefined', until auth has been established

// Signed in:   (as documented in -> https://firebase.google.com/docs/reference/js/firebase.User.html#displayname )
//  {
//    displayName:    string | null
//    email:          string | null
//    emailVerified:  boolean
//    isAnonymous:    boolean
//    metadata:       { creationTime: string, lastSignInTime: string }
//    phoneNumber:    string | null
//    photoURL:       string | null
//    providerData:   [ { ...similar fields as the generic ones... } ]
//    providerId:     string        // tbd. examples; or do we need to know?
//    refreshToken:   string
//    tenantId:       string | null
//    uid:            string        // "the user's unique id"
//    phoneNumber: ...
//    providerData: ...
//  }
//
// Signed out:
//    false

console.log("Starting auth checking...");
const t0 = performance.now();
let reported = false;

firebase.auth().onAuthStateChanged( (o) => {
  if (!reported) {
    const dt = performance.now() - t0;
    console.log(`Firebase auth initial status (took ${dt} ms): `, o);   // 415ms
    //tbd. collect them centrally (use performance monitoring, custom entry) #profile
    reported = true;
  }

  if (o !== null) {   // user signed in
    authRef.value = o
  } else {
    authRef.value = false    // no active user
  }
}, (err) => {
  throw new ContextError("Firebase auth", err);
});

console.log("Started auth checking...", performance.now() - t0);

export {
  authRef
};
