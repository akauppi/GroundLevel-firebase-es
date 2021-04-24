/*
* signInAs.spec.js
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
    cy.get('div.user-profile #user-name')
      .contains(joe.displayName)
  })
})
