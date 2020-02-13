/*
* src/auth.js
*
* Application interfacing to the authentication: is the user signed in, information about them.
*
* We should handle Firebase auth API; pages don't need to know it ('SignIn' page being excepted).
*/

/*** REMOVE?
// A Vue observable allows us to propagate changes downstream in a meaningful way.
//
// Background:  <-- remove later?
//    Also tried a mere ES6 object (with read-only fields); problem was initialization. Promise was making things
//    complicated.
//
// Note: Initial values are used only until we get the first Firebase callback.
//
import Vue from 'vue';

// Q: Is there a way to ban writes to the observable, from outside this module? #vue-advice
//    Track -> https://stackoverflow.com/questions/60205751/making-read-only-fields-in-a-vue-observable
//
const user = Vue.observable({
  displayName: null,    // String|null
  isSignedIn: null      // Boolean (when authenticated)
});
***/

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

// Note: exported as a separate entry so we can see, which parts would require sign-out.
//
function signOut() {
  firebase.auth().signOut();    // side effects
}

export { userProm, userPromGen, signOut };
