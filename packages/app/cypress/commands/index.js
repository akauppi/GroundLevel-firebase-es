/*
* cypress/support/auth.js
*
* Provides signing in/out from Firebase auth.
*
* Implementation note:
*   We use "real" 'signInWithCustomToken' that signs up the users in Firebase Auth Emulation. 'npm run dev' has the
*   '?user=xyz' parameter that would do the same but we don't need to go through it.
*
* Note:
*   We cannot 'import' any of the application sources, since they use '/@xxx' path mapping. (This should be fine.)
*/
import { signInWithCustomToken, updateProfile } from '@firebase/auth'

// Initialised once Firebase is up
let onAuthStateChanged_HACK;

/*
* 'cy.clearAuthState'
*
* Make sure a test starts without prior login. No access to 'firebase' is needed; thus the test does not need to do
* 'cy.visit'.
*
* Note:
*   This is needed because Cypress does _not_ clear IndexedDB between tests. The whole discussion about how state
*   clearing / carry-over is to be handled is still ongoing (Oct 2020; Cypress 5.3.0). The stated _idea_ is that
*   default would "clear all" (it doesn't, currently), but test authors be given control about which parts they
*   want cleared, which not. Makes sense.
*/
Cypress.Commands.add('clearAuthState', () => {

  const prom = new Promise((resolve, reject) => {
    const req = indexedDB.deleteDatabase('firebaseLocalStorageDb');
    req.onsuccess = resolve;
    req.onerror = reject;
  })

  cy.wrap(prom);
});

/*
* 'cy.signAs'
*
* Sign in as a certain user, to Firebase Auth emulation.
*
* Creates the user ad-hoc, with fields (if given) 'uid', 'displayName' and 'photoURL' (more fields can be supported,
* if needed).
*/
Cypress.Commands.add('signAs', ({ uid, displayName, photoURL }) => {
  if (!uid) throw new Error("No 'uid' provided.");

  cy.visit('/');    // initialize the app; wait for knowledge that it's opened

  firebaseAuthChainable().then( async auth => {
    console.log("Signing in as:", { uid } );

    // Create a user based on the provided token (only '.uid' is used by Firebase)
    //
    const { user: /*as*/ currentUser } = await signInWithCustomToken( auth, JSON.stringify({ uid }) );
    assert(currentUser.uid === uid);

    // Set '.displayName', '.photoURL'; for email and password, other functions exist (not implemented)
    await updateProfile(currentUser, { displayName, photoURL });
    onAuthStateChanged_HACK({ uid, displayName, photoURL });

    return currentUser;

  }).then( user =>
    cy.log(`Signed as: ${ JSON.stringify(user) }` )   // DEBUG
  )
})

/*
* Wait until the current page has initialized Firebase ('src/main' flags us by setting 'window["Let's test!"]').
*
* Note:
*   If we need access to any source code side things, this is how to get them. We cannot 'import' since the source
*   uses '/@xyz' module redirects that Cypress doesn't know of.
*/
function firebaseAuthChainable() {    // () => Chainable<FirebaseAuth>
  return cy.window().its("Let's test!").then( ([auth,piggy1]) => {
    onAuthStateChanged_HACK = piggy1;
    return auth;
  });
}
