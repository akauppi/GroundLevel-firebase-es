# Wishes for Cypress

## Partial objects matcher (small)

The Cypress (Chai) [matchers](https://docs.cypress.io/guides/references/assertions#BDD-Assertions) don't include a deep-partial-equality matcher /(Cypress 10.9.0). The `deep.equals` checks for all the fields, not just the ones in the expected outcome.

There is the [`chai-subset`](https://www.npmjs.com/package/chai-subset) plugin, and using it with Cypress is [very easy](https://stackoverflow.com/a/73826891/14455). However, the author did not want to add a third-party dependency, for a case that can be handled otherwise.

If `containSubset` (or similar matcher) existing within Cypress proper, the author would have used it.

>See more about this under `packages/app/cypress/e2e/metrics.cy.js`.


## `then`^N

The Cypress builds upon the concept of `Chainable`s. This deviation from "normal" JavaScript language has been discussed countless times, but it does sometimes really HURT!

When exactly should one use `.then`?  It seems safest to default to it.

If so, some tests are a bit long. Take this:

```
    const steps_G = [
      _ => cy.clearAuthState()     // sign out

      // Can use the same time for all three, since fetching from different paths.
      //
      , _ => cy_portal_incDummy(0.1, at)
      , _ => cy_portal_logDummy("hey", {}, at)
      , _ => cy_portal_obsDummy(12.3, at)

      , _ => cy.signAs(joe)

      , _ => getIncoming("incs", at)
        .should( o => {
          expect(o.ctx.clientTimestamp) .to.equal(at);
          expect(o.ctx.uid) .to.be.null;    // guest
        })

      , _ => getIncoming("logs", at)
        .should( o => {
          expect(o.ctx.clientTimestamp) .to.equal(at);
          expect(o.ctx.uid) .to.be.null;    // guest
        })

      , _ => getIncoming("obs", at)
        .should( o => {
          expect(o.ctx.clientTimestamp) .to.equal(at);
          expect(o.ctx.uid) .to.be.null;    // guest
        })
    ];
```

Those steps are intended to be run in sequence. Can I, as a test author, separate them since they all are `cy.{something}`?  Or should I tie them to each other as a `.then` chain?







<!--
*Consider removing. `.then()` seems already accepting Promises*

<_!-- done
## `cy.wrap` implicitly

>The [Await-ing Cypress Chains](https://github.com/cypress-io/cypress/issues/1417) chain ;) nicely describes why `Chainable`s are fundamentally different from `Promises`. However, in some cases one needs to combine the two, and the current use of `cy.wrap` is clumsy, readability-wise. As the author shows, the wrapping can be made implicit.

The Cypress `Chainables` are not promises, but they have a `.then`.

This is likely understandable, but leads to mental juggling when the app side uses Promises heavily.

Let's see a real life sample (from `packages/app/cypress/support/auth.js`), and how it could be:

How it is (simplified):

```
  firebaseAuthChainable().then( auth => {
    cy.wrap( (async _ => {
      const { user: /*as*/ currentUser } = await signInWithCustomToken( auth, JSON.stringify({ uid }) );
      await updateProfile(currentUser, { displayName, photoURL });
      return currentUser;
    })() ).then( user =>
      cy.log(`Signed as: ${ JSON.stringify(user) }` )   // DEBUG
    )
```

How it could be:

```
  firebaseAuthChainable().thenAwait( async auth => {
    const { user: /*as*/ currentUser } = await signInWithCustomToken( auth, JSON.stringify({ uid }) );
    await updateProfile(currentUser, { displayName, photoURL });
    return currentUser;
  } ).then( user =>
      cy.log(`Signed as: ${ JSON.stringify(user) }` )   // DEBUG
    )
```

If the `.thenAwait` is given a `Promise`, it would `await` until it resolves (or rejects). If it is given a `function`, it would execute such function and expect a `Promise` in return. If the function returns anything else than a `Promise` it's an error. 

Likewise, `.then` could check that functions given to it *do not* return a Promise - and fail if they do.

Heck.

Couldn't the same `.then` also handle promises, transparently?

- If the function returns a `Promise`, await automatically before proceeding to the following chained stage (are they called stages?).

*I don't know of Cypress internals, but some solution to this `then` dilemma would be welcome!*

---

TRACK:

- [ ] report to Cypress, or find an Issue `#help`

-->
