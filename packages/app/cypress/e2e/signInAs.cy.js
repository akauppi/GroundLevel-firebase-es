/*
* signInAs.cy.js
*
* Sign in as Joe and see your name on the screen.
*/
import { joe } from '../users'

before( () => {
  cy.clearAuthState()
})

describe('Sign In as Joe', () => {

  beforeEach( () => {
    cy.signAs(joe);
  })

  it('See one\'s name', () => {
    cy.get('[data-cy=user-name]')
      .contains(joe.displayName)
  })

  /*** tbd. eventually add a test (maybe separate from this) to test Firestore connection works.
  //
  // This checks that we can reach the Firestore backend
  //
  it.skip ('See one\'s data', () => {
    cy.signAs({ uid: 'dev' });
    cy
      .contains("<project name>");
      //.contains("NEW PROJECT")
  })
  **/
})
