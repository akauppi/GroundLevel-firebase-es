/*
* metrics.cy.js
*
* Delivering counts, logs to Realtime Database (and from there, beyond), via Cloud Functions.
*/
import { joe } from '../users'

before( () => {
  cy.clearAuthState()
})

describe('Central metrics and logs end up in Realtime Database (for signed-in user)', () => {

  beforeEach( () => {
    cy.signAs(joe);
  })

  it('Have metrics passed to Realtime Database', () => {
    const at = Date.now();

    cy.window().its("TEST_countDummy").then( inc => {
      inc(0.01, { forcedAt: at });
    } );

    getIncoming("incs", at)
      .should('include', {
        clientTimestamp: at,
        id: 'test-dummy'
      })
  })

  /***it.skip('Have logs passed to Realtime Database', () => {
    // tbd.
  })***/

  // tbd. samples (timings)
})

function getIncoming(subPath, expectedTimestamp) {   // (string, number) => Promise of {...}
  return cy.task('getIncoming', [subPath, expectedTimestamp]);
}
