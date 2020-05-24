/*
* src/firebase/auth.js
*
* Application interfacing to the authentication: is the user signed in, information about them.
*
* We handle Firebase API; pages don't need to know it ('SignIn' and 'AppProfile' being exceptions).
*
* Note:
*     When loading, this module will delay until authentication information is acquired (90..370ms). This means
*     we can guarantee the 'fbUser' field to always have valid information. Another ways could be to provide
*     'null' as a token of "working on it", or to provide a Promise as the value. tbd. Let's see what works.
*
* References:
*   - firebase.auth.Auth (Firebase docs)
*       -> https://firebase.google.com/docs/reference/js/firebase.auth.Auth
*/
import { ref } from 'vue';

const fbUser = ref(null);   // until auth has been established

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

//
// Turning Firebase subscription model into a Promise based on
//    -> https://medium.com/@gaute.meek/vue-guard-routes-with-firebase-authentication-7a139bb8b4f6
//
function currentFirebaseUserProm() {    // () => Promise of object|falsy
  return new Promise( (resolve, reject) => {   // () => Promise of (firebase user object)
    const unsub = firebase.auth().onAuthStateChanged(user => {
      unsub();
      resolve(user);
    }, reject);
  });
}

console.log("Starting auth checking...");
const t0 = performance.now();
let reported = false;

firebase.auth().onAuthStateChanged( (o) => {
  if (!reported) {
    const dt = performance.now() - t0;
    console.log(`Firebase auth initial status (took ${dt} ms): `, o);   // 415ms
    reported = true;
  }

  if (o !== null) {   // user signed in
    fbUser.value = o
  } else {
    fbUser.value = false    // no active user
  }
}, (err) => {
  console.error("Error in Firebase auth", err);   // tbd. is this enough or we want some error banner?
});

console.log("Started auth checking...", performance.now() - t0);

/*
* Is the user signed in, right now.
*
* Used by 'router.js'.
*
* We do get here before the initial '.onAuthStateChanged' callback has been able to set '.fbUser.value'
* so making it in another way.
*/
async function isSignedInRightNow() {    // () => Promise of boolean
  if (fbUser.value === null) {
    console.log("'fbUser' not initialized - providing a Promise")
    return currentFirebaseUserProm().then( (o) => o !== null );

  } else {
    console.log("'fbUser' known: "+ fbUser.value);
    return !! fbUser.value;   // cast to boolean
  }
}

export {
  fbUser,
  isSignedInRightNow
};
