/*
* cypress/support/firebase.js
*
* Provides 'cy.firebase' for easier access to the 'firebase' handle in Cypress tests.
*/

/*
* 'cy.firebase'
*
* Waits until the browser has initialized the Firebase handle (emulation set up), and provides the handle to use.
*
* Note:
*   Had problems importing Firebase in the tests (error about '.initializeApp' not having been called for 'DEFAULT').
*   Since we anyways need a cue from the browser as to when emulation setup has been done, we can piggy-back their
*   'firebase' handle. Works.
*
* Usage:
*   <<
*     cy.firebase().then( firebase => { ... } )
*   <<
*/
Cypress.Commands.add('firebase', () => {

  return cy.window().its('TESTS_GO!')   // firebase handle; automatically waits
})
