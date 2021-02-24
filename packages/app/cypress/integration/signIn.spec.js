/*
* signIn.spec.js
*
* Test the UI when not signed in.
*/

before(() => {
  cy.clearAuthState()    // start each test from scratch
})

describe('Google sign-in is enabled', () => {

  it('Opens a sign-in dialog', () => {
    cy.visit('/')
    cy.contains('Welcome Stranger!'.toUpperCase())
    cy.contains("Sign in with Google")    // button.firebaseui-idp-google
      .click()

    //... that leads to an auth dance.
    //
    // 200 OK /identitytoolkit/v3/relyingparty/getProjectConfig?key=AIza...9013
    //
    // Note: The auth dance seems a Bit Too Much [1] for Cypress at the moment, so let's not go there. We'll test
    //      auth manually (or trust the library has done it!) and teleport ourselves through to the Other Side. 👻
    //
    //      [1]: https://sandrino.dev/blog/writing-cypress-e2e-tests-with-auth0
    //
    // In addition:
    //    The response (in auth emulation) actually is 400 with message: "API key not valid. Please pass a valid API key."
    //    This is something Firebase Auth Emulation should fix (allow to work against auth providers, though not need
    //    Firebase cloud project). [Electron, firebase-tools 8.14.1]
    //
    if (false) {
      cy.url().should('include', '/identitytoolkit/v3/relyingparty/')   // (no idea what that is)
    }
  })
})

/*
// BUG: For some reason, this test gets the dialog stuck in a loading state. Looking at the same in browser (Chrome)
//    works.
//
//    Not worth the fight -> disabled
//
describe('Guest sign-in is enabled', () => {

  it.skip('Gets one in, without needing to authenticate', () => {
    cy.visit('/')
    cy.contains('Welcome Stranger!'.toUpperCase())
    cy.contains("Continue as guest", { timeout: 5000 })    // button.firebaseui-idp-anonymous span
      .click()

    // 200 POST /identitytoolkit/v3/relyingparty/signupNewUser?...
    //
    // Eventually gets to 'localhost:3000', without needing to give credentials

    cy.url().should('equal', 'http://localhost:3000/')    // tbd. allow either with or without trailing dash

    cy.firebase( firebase => {
      expect( firebase.auth().currentUser?.isAnonymous ).to.equal(true)   // tbd. any way to use should?
    })
    cy.contains('anonymous user')   // div.user-name
  })
})
*/

