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

  // This checks that we can reach the Firestore backend
  //
  it('See one\'s data', () => {
    cy
      .contains("Jolly Jumper")
      //.contains("NEW PROJECT")
  })
})
