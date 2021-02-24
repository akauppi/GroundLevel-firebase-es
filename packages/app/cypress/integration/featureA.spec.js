/*
* featureA.spec.js
*
* Sign in as Joe and see your name on the screen.
*/
import { users } from '../users'

const joeRaw = users.find( o => o.uid === 'joe' )
assert(joeRaw, "Did not find user '{ uid: 'joe' }'");
assert(joeRaw.name.length > 0);

const joe = {
  ...joeRaw,
  name: undefined,
  displayName: joeRaw.name,
  uid: undefined
}

before( () => {
  cy.clearAuthState()
})

describe('Sign In as Joe', () => {

  beforeEach( () => {
    cy.signAs('joe', joe);
  })

  it('See one\'s name', () => {
    //cy.visit('/')                               // <-- NOT logged in as "Joe D." but some other (remembered???) user

    cy.get('div.app-profile #user-name')
      .contains(joe.displayName)
  })
})
