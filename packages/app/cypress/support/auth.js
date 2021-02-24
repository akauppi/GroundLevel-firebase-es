/*
* cypress/support/auth.js
*
* Provides signing in/out from Firebase auth.
*/

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

  cy.firebase().then( firebase => {

    // Only now initiate anything 'firebase'.
    const fbAuth = firebase.auth();
    assert(fbAuth);

    cy.wrap( (async _ => {
      // Create a user based on the provided token (only '.uid' is used by Firebase)
      //
      await fbAuth.signInWithCustomToken( JSON.stringify({ uid }) );

      // Set '.displayName', '.photoURL'; for email and password, other functions exist (not implemented)
      await fbAuth.currentUser.updateProfile(opt);

      assert(fbAuth.currentUser.uid === uid);
      assert( (!opt.displayName) || fbAuth.currentUser.displayName === opt.displayName);
      assert( (!opt.email) || fbAuth.currentUser.email === opt.email )   // not set
      assert( (!opt.photoURL) || fbAuth.currentUser.photoURL === opt.photoURL);
    })() ).then( _ =>
      cy.log(`Signed as: ${ JSON.stringify(fbAuth.currentUser) }` )   // DEBUG
    )
  })
})
