/*
* cypress/support/auth.js
*
* Provides signing in/out from Firebase auth.
*/
import { getAuth, signInWithCustomToken, onAuthStateChanged, updateProfile } from '@firebase/auth'

/*
* Wait until the current page has initialized Firebase ('src/main' flags us by setting 'window["Let's test!"]').
*/
function firebaseIsReady() {    // () => Chainable<FirebaseAuth>
  return cy.window().its("Let's test!").then( _ => getAuth() );
}

/*
* Clear IndexedDB used by Firebase auth. Clad as a normal Promise.
*
* Note:
*   This is needed because Cypress does _not_ clear IndexedDB between tests. The whole discussion about how state
*   clearing / carry-over is to be handled is still ongoing (Oct 2020; Cypress 5.3.0). The stated _idea_ is that
*   default would "clear all" (it doesn't, currently), but test authors be given control about which parts they
*   want cleared, which not. Makes sense.
*
*   See:
*     - https://github.com/cypress-io/cypress/issues/1208
*     - https://github.com/cypress-io/cypress/issues/686
*/
function clearAuthState() {    // () => Promise of ()

  return new Promise( (resolve,reject) => {
    const req = indexedDB.deleteDatabase('firebaseLocalStorageDb');
    req.onsuccess = resolve;
    req.onerror = reject;
  })
}

/*
* 'cy.clearAuthState'
*
* Make sure a test starts without prior login. No access to 'firebase' is needed; thus the test does not need to do
* 'cy.visit'.
*/
Cypress.Commands.add('clearAuthState', () =>
  cy.wrap( clearAuthState() )
)

/*
* 'cy.signAs'
*
* Sign in as a certain user, to Firebase Auth emulation.
*
* Creates the user ad-hoc, with fields (if given) 'uid', 'displayName' and 'photoURL' (more fields can be supported,
* if needed).
*/
Cypress.Commands.add('signAs', (uid, opt) => {
  if (!uid) throw new Error("No 'uid' provided.");

  cy.visit('/');    // initialize the app; wait for knowledge that it's opened

  firebaseIsReady().then( auth => {
    cy.wrap( (async _ => {
      // Create a user based on the provided token (only '.uid' is used by Firebase)
      //
      const { user: /*as*/ currentUser } = await signInWithCustomToken( auth, JSON.stringify({ uid }) );

      /*** remove
      // Pick the current signed-in-user.
      //
      const currentUser = await new Promise( (resolve,reject) => {
        const unsub = onAuthStateChanged( auth, user => {
          resolve(user);
          unsub();
        }, reject );
      });***/

      assert(currentUser.uid === uid);

      // Set '.displayName', '.photoURL'; for email and password, other functions exist (not implemented)
      const cred2 = await updateProfile(currentUser, opt);

      assert( (!opt.displayName) || cred2.user.displayName === opt.displayName);
      assert( (!opt.photoURL) || cred2.user.photoURL === opt.photoURL);

      return currentUser;

    })() ).then( user =>
      cy.log(`Signed as: ${ JSON.stringify(user) }` )   // DEBUG
    )
  })
})
