/*
* guest.spec.js
*
* Test how a guest (not signed in) sees the app.
*/

before(() => {    // make sure no left-overs
  cy.clearAuthState();
})

describe('Guest visiting the home page', () => {

  beforeEach( () => {
    cy.visit('/')
    cy.contains('Some kind words about the app')
  })

  it('Shows a Google sign-in button', () => {

    // Find the 'Sign in with Google' button on screen (no need to click it)
    //
    cy.get('aside-keys')
      .shadow()
      .contains("Sign in with Google")    // aside-keys > #shadow-root > ... span

      /*.then( el => {
        cy.log("Element:", el)    // DEBUG
      })*/

    // maybe (much!) later... we could consider also testing the auth
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
    //if (false) {
    //  cy.url().should('include', '/identitytoolkit/v3/relyingparty/')   // (no idea what that is)
    //}
  })
})
