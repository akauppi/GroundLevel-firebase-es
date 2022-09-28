/*
* metrics.cy.js
*
* Delivering counts, logs and samples to Realtime Database (and from there, beyond), via Cloud Functions.
*/
import { joe } from '../users'

before( () => {
  cy.clearAuthState()
})

describe('Central metrics, logs and samples end up in Realtime Database (for signed-in user)', () => {

  beforeEach( () => {
    cy.signAs(joe);
  })

  function getIncoming(subPath, expectedTimestamp) {   // (string, number) => Promise of {...}
    return cy.task('getIncoming', [subPath, expectedTimestamp]);
  }

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

  it('Have logs passed to Realtime Database', () => {
    const at = Date.now();

    cy.window().its("TEST_logDummy").then( log => {
      log("hey", { a:1, b:2 }, { forcedAt: at });   // note: to have '{ forcedAt }', second param must be provided
    } );

    getIncoming("logs", at)
      .should('include', {
        clientTimestamp: at,
        id: 'test-dummy'
      })
  })

  it('Have samples passed to Realtime Database', () => {
    const at = Date.now();

    cy.window().its("TEST_obsDummy").then( obs => {
      const v = Math.random() * 100;
      obs( v, { forcedAt: at });
    } );

    getIncoming("obs", at)
      .should('include', {
        clientTimestamp: at,
        id: 'test-dummy'
      })
  })
})
