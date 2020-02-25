/*
* src/auth.js
*
* Application interfacing to the authentication: is the user signed in, information about them.
*
* We should handle Firebase auth API; pages don't need to know it ('SignIn' page being excepted).
*
* References:
*   - firebase.auth.Auth (Firebase docs)
*       -> https://firebase.google.com/docs/reference/js/firebase.auth.Auth
*/

// Note: a stream of user objects (or 'null') would really be the best abstraction for this. :&

// Get the current signed-in (or not) user status.
//
// Note: Though we may create lots of promises (one per page entry?) for checking the auth, the Firebase library should
//    return immediately with what it knows to be the authentication state, except for the first call where it likely
//    needs some time.  (<-- let's confirm by logging and timing...)
//
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
//
//    isAnonymous: Boolean    // not mentioned in the README
//  }
//
// Signed out:
//    null
//
// Based on -> https://medium.com/@gaute.meek/vue-guard-routes-with-firebase-authentication-7a139bb8b4f6
//
const currentFirebaseUserProm = () => new Promise( (resolve, reject) => {   // () => Promise of (firebase user object)
  console.log("Firebase auth check starting...");
  const t0 = performance.now();

  const unsubscribe = firebase.auth().onAuthStateChanged(user => {
    const dt = performance.now() - t0;
    console.log(`Checked Firebase auth state (took ${dt} ms): `, user);   // 92ms ... 231ms

    unsubscribe();
    resolve(user);
  }, reject);
});

// We cannot feed a 'Promise' to vue HTML template (unfortunate, something like Svelte's '{await}' support would suit
// nicely, here). To ease the pain, we make some reactive fields that visual components can use, directly.
//
// Note: Without this, there wouldn't have been a reason to mention Vue in this module.
//

// Note: exported as a separate entry so we can see, which parts would require sign-out.
//
function signOut() {    // () => Promise of ()
  return firebase.auth().signOut();    // side effects; presumably sign-out has happened once the promise is successful
}

const onAuthStateChanged = (f) => firebase.auth().onAuthStateChanged(f);    // tbd. without the '(f)'

// Note: Don't seem to be able to export 'obs.displayName as displayName', in Vue.
//
export {
  currentFirebaseUserProm,
  signOut,
  onAuthStateChanged
};
