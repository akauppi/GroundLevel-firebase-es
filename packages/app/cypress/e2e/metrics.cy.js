/*
* metrics.cy.js
*
* Delivering counts, logs and samples to Realtime Database (and from there, beyond), via Cloud Functions.
*/
import { joe } from '../users'

before( () => {
  cy.clearAuthState()
})

describe('Central metrics, logs and samples end up in Realtime Database (when a user has signed in)', () => {

  beforeEach( () => {
    cy.signAs(joe);
  })

  /*** This didn't work.
   *
   * Tried to use 'let' (variables) for first getting functions that the tests could use. However, since these need
   * to come via 'cy.window().its(...)' mechanism (we cannot directly import stuff that is Vite served, since Vite
   * has mapping there; anyways, it would lead us further away from actual target and testing actual... you see).
   *
   * Cypress docs/discussions mention this, at places (tbd. provide some authorative link, here??). The catch was,
   * it didn't give any "cannot call 'incDummy'" error, but just.. jumped past it, without calling anything. That's,
   * like, strange?
   *
  // Secret portals 🕳 to 'central':
  //let incDummy, logDummy, obsDummy, flush;
  //let guestLog_at;

  before( () => {
    cy.visit('/');

    /_*** disabled; if we do this, calling 'incDummy' in a test doesn't do anything.
    // Load 'TEST_...' values from the window object, before the tests.
    //
    cy.window().its("TEST_portal").then(o => {
      incDummy = o.incDummy || fail();
      logDummy = o.logDummy || fail();
      obsDummy = o.obsDummy || fail();
      flush = o.flush || fail();

      // Send one log before we sign in. It should get delivered once the user's logged in.
      //
      guestLog_at = Date.now();
      logDummy("Hey from a guest", {}, guestLog_at);   // 'ctx.uid' becomes null

      cy.signAs(joe);
    });
    ***_/
  })
  ***/

  /*
  * Note: 'cy.window()' can only be used from within tests.
  */
  function cy_portalGen(s) {    // (string) => (...) => Chainable of ()
    return (...args) =>
      cy.window().its("TEST_portal").then( o => o[s] ).then( f => f(...args) )
  }

  const cy_portal_incDummy = cy_portalGen("incDummy");   // Chainable of (number, number) => ()
  const cy_portal_logDummy = cy_portalGen("logDummy");   // Chainable of (string, any? [, ...], number) => ()
  const cy_portal_obsDummy = cy_portalGen("obsDummy");   // Chainable of (number, number) => ()
  const cy_portal_flush = cy_portalGen("flush");   // Chainable of () => ()

  function _getIncoming(subPath, expectedTimestamp) {   // (string, number) => Promise of {...}

    // Make sure our stuff doesn't stick in the queue. Note: this has to happen within browser code, not in the
    // 'cy.task' (which is OS level environment).
    //
    cy_portal_flush();

    return cy.task('getIncoming', [subPath, expectedTimestamp, `o => true`], {
      timeout: 15000      // default timeout of 60s is unnecessary long; speeds up debugging
    });
  }
  function getIncomingProm(at) { return _getIncoming("prom", at); }
  function getIncomingLoki(at) { return _getIncoming("loki", at); }

  it('Have metrics passed to Realtime Database', () => {
    const at = Date.now();    // differentiates from possible earlier runs

    // NOTE:
    //  Tried multiple ways for checking the received object. We want partial checking (not interested in complete
    //  data fields but just the fact that our entry got to the database.

    cy_portal_incDummy(0.01, at).then( _ => {
      getIncomingProm(at)
        /*.should( o => {    // WORKS
          expect(o.ctx.clientTimestamp) .to.equal(at);
          expect(o.ctx.uid) .to.be.true;   // blurred the user id away
          expect(o.id) .to.equal('test-dummy');
        })*/

        .then( o => ({ id: o.id, ctx: { clientTimestamp: o.ctx.clientTimestamp, uid: o.ctx.uid }  }) )    // keep only the fields we are interested in
        .should('deep.equal', {
          ctx: {
            clientTimestamp: at,
            uid: true
          },
          id: 'test-dummy'
        })

        /**.should('containSubset', {   // would need 'chai-subset' plugin (npm)
          ctx: {
            clientTimestamp: at,
            uid: true
          },
          id: 'test-dummy'
        })***/

        /**.should('deep.equal', {    // nah, does a precise (not partial) match of deep fields (fails because we don't test e.g. 'ctx.stage')
          ctx: {
            clientTimestamp: at,
            uid: true
          },
          id: "test-dummy"
        });**/
    })
  })

  it('Have logs passed to Realtime Database', () => {
    const at = Date.now();

    cy_portal_logDummy("hey", { a:1, b:2 }, at).then(_ => {
      getIncomingLoki(at)
        .should( o => {
          expect(o.ctx.clientTimestamp) .to.equal(at);
          expect(o.ctx.uid) .to.equal('joe');     // user affected
          expect(o.id) .to.equal('test-dummy');
        })
    })
  })

  // tbd. Why logs and metrics pass, samples never.
  //
  it('Have samples passed to Realtime Database', () => {
    const at = Date.now();

    cy_portal_obsDummy(56.7, at).then(_ => {
      getIncomingProm(at)
        .should( o => {
          expect(o.ctx.clientTimestamp) .to.equal(at);
          expect(o.ctx.uid) .to.be.true;    // blurred
          expect(o.id) .to.equal('test-dummy');
        })
    })
  })

  it .skip('Have guest metrics and logs passed to Realtime Database, _once_ a user authenticates', () => {
    const at = Date.now();

    // Note: Cypress 'Chainable's can make pretty long chains.

    cy.clearAuthState().then( _ => (
      cy.visit('/')
    )).then( _ => (
      cy.window().its("Let's test!").then( ([auth]) => auth.currentUser )
        .should('be.null')
    ))

    // Note: these could be in parallel
    //
    .then( _ => cy_portal_incDummy(0.1, at)
      .then( _ => cy_portal_logDummy("hey", {}, at) )
      .then( _ => cy_portal_obsDummy(12.3, at+1) )    // Tilt the time for 'obs' slightly, since that and inc end up in the same pile.
    )

    // At this moment, messages are just queued, waiting for an authorized user.

    // Sign in should ship the pending messages
    .then( _ => cy.signAs(joe) )

    // Could test these in parallel
    .then( _ => (
      getIncomingProm(at)
        .should( o => {
          expect(o.ctx.clientTimestamp) .to.equal(at);
          expect(o.ctx.uid) .to.be.null;    // guest
        })
      /*** TBD: open
      .then(_ => (
        getIncomingLoki(at)
          .should( o => {
            expect(o.ctx.clientTimestamp) .to.equal(at);
            expect(o.ctx.uid) .to.be.null;    // guest
          })
      ))

      .then(_ => (
        getIncomingProm(at+1)
          .should( o => {
            expect(o.ctx.clientTimestamp) .to.equal(at);
            expect(o.ctx.uid) .to.be.null;    // guest
          })
      ))***/
    ))
  })
})
