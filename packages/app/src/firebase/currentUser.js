/*
* src/firebase/currentUser.js
*
* Provides information about the current user. This can be used when a component knows that the user is signed in
* and won't change, during the lifespan of the component.
*
* Same as 'authRef.value'. We could use that, interchangeably.
*/
import firebase from 'firebase/app'
import '@firebase/auth'

function currentUserGen() {    // () => { uid: string, ... }
  return firebase.auth().currentUser;
}

export {
  currentUserGen
}
