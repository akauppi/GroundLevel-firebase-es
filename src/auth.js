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

import Vue from 'vue';

// Note: a stream of user objects (or 'null') would really be the best abstraction for this. :&

let currentUser = undefined;  // 'undefined': busy checking | 'null' (signed out) | {...} (signed in)

firebase.auth().onAuthStateChanged(o => {

  if (o) {
    console.log("Signed in: ", o);

    // Signed in:   (fields mentioned in FirebaseUI GitHub README listed)
    //  {
    //    displayName: string
    //    email: string
    //    emailVerified: boolean
    //    photoURL: URL
    //    uid: <string>
    //    phoneNumber: ...
    //    providerData: ...
    //
    //    isAnonymous: Boolean    // not mentioned in the README
    //  }
    //
    if (!o.displayName) console.warn('Unexpected signed in data (no \'.displayName\'):', o);

    o.getIdToken().then( (accessToken) => {
      console.log( "Got token:", accessToken);
    });

    currentUser = o;    // signed in

  } else {  // o === null
    console.log("Signed out");
    currentUser = null;
  }
});

// Export a promise interface.
//
// For checking again and again (router), use 'userPromGen()'.
// For pages / components where the user doesn't change (most pages!), use 'userProm'.
//
const userPromGen = () => new Promise( (resolve, reject) => {
  if (currentUser !== undefined) {
    // Already tracking authentication - we know the result
    resolve(currentUser);
  } else {
    // Adapted from -> https://medium.com/@gaute.meek/vue-guard-routes-with-firebase-authentication-7a139bb8b4f6
    //
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    }, reject);
  }
});

const userProm = userPromGen();

// We cannot feed a 'Promise' to vue HTML template (unfortunate, something like Svelte's '{await}' support would suit
// nicely, here). To ease the pain, we make some reactive fields that visual components can use, directly.
//
// Note: Without this, there wouldn't have been a reason to mention Vue in this module.
//

/*** disabled, because:
 * - not able to export just a reactive 'displayName' - exporting the 'obs' is clumsy
 * - anyhow needing a 'computed' field to proxy the value in the receiving component (to use in its HTML template)
 *
 * With those two, there's too much complexity. Let's just pass on the 'userProm' and receiver picks the field(s).

// Q: Is there a way to ban writes to the observable, from outside this module? #vue-advice
//    track -> https://stackoverflow.com/questions/60205751/making-read-only-fields-in-a-vue-observable
//
// Initial values are in effect until the authentication has gone through.
//
const obs = Vue.observable({
  displayName: '',          // String
  isSignedIn: undefined     // Boolean (when authenticated)
});

userProm.then( (user) => {
  if (user) {
    obs.displayName = user.displayName;
    obs.isSignedIn = true;
  } else {
    obs.displayName = '';
    obs.isSignedIn = false;
  }
});
***/

// Note: exported as a separate entry so we can see, which parts would require sign-out.
//
function signOut() {    // () => Promise of ()
  return firebase.auth().signOut();    // side effects; presumably sign-out has happened once the promise is successful
}

// tbd. see if we don't need to export 'userProm' (just the reactive fields)
//
// Note: Don't seem to be able to export 'obs.displayName as displayName', in Vue.
//
export { /*obs as userObs,*/ userProm, userPromGen, signOut };
