# Wishes for Cypress

## Befriend `Promise`s

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
