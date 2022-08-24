# Using Cypress

## It gathers binaries

```
$ ls ~/Library/Caches/Cypress/
5.5.0	6.3.0	6.4.0	6.5.0	6.6.0	6.8.0	6.9.1 7.1.0 cy
```

These eventually eat up your disk space (about 0,5GB each). 

Just remove the earlier versions away.


## Chainables will not become Promises

This causes a lot of mental friction, at first, and maybe in the long run as well. 

Read this issue:

- [Await-ing Cypress Chains](https://github.com/cypress-io/cypress/issues/1417) (GitHub Issues); especially `brian-mann`'s comment

TL;DR There are reasons Cypress API is like it is. It cannot be mapped to `async/await` without causing a new set of problems.

- Cypress already does waits implicitly; JavaScript doesn't
- Cypress "does not and will never have [catch]" (understandable).

We - as developers - must just remind ourselves of this.


### You can feed a `Promise` to Cypress `.then()`

```
  firebaseAuthChainable().then( auth =>
    promGen(auth)
  ).then( user =>
```

It doesn't need `cy.wrap`:ing.

