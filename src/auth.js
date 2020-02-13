/*
* src/auth.js
*
* Application interfacing to the authentication: is the user signed in, information about them.
*
* We should handle Firebase auth API; pages don't need to know it ('SignIn' page being excepted).
*/

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

firebase.auth().onAuthStateChanged(o => {

  if (o) {
    console.log("Signed in: ", o);

    // Signed in:
    //  {
    //    displayName: "Jack Nicholson"
    //    email:
    //    emailVerified:
    //    metadata: { ... }
    //    uid: <string>
    //    photoURL: ...
    //  }
    //
    if (!o.displayName) console.warn('Unexpected signed in data (no \'.displayName\'):', o);

    user.displayName = o.displayName;
    user.signedIn = true;

  } else {  // o === null
    console.log("Signed out");

    user.displayName = null;
    user.isSignedIn = false;
  }
});

// Note: exported as a separate entry (not a method of '.user') so we can see, which parts would require sign-out.
//
function signOut() {
  firebase.auth().signOut();    // side effects
}

export { user, signOut };
