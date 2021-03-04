# Developer notes

## Peer problems when updating Vue

```
$ npm install
...
Found: @vue/compiler-sfc@3.0.5
npm ERR! node_modules/@vue/compiler-sfc
npm ERR!   peer @vue/compiler-sfc@"^3.0.4" from @vitejs/plugin-vue@1.1.4
npm ERR!   node_modules/@vitejs/plugin-vue
npm ERR!     dev @vitejs/plugin-vue@"^1.1.4" from the root project
npm ERR!   dev @vue/compiler-sfc@"^3.0.6" from the root project
...
```

If you run into such problems, remove the existing installation eg. by:

```
$ rm -rf node_modules/@vue node_modules/vue
```

Try again.


## Using `npm link`

If you co-create packages and use `npm link`, you need to relink after each `npm install`.


## About auth persistence

Firebase `getAuth` uses `indexedDBLocalPersistence` for persisting the authentication values. Options, available via `initializeAuth` are:

- `browserLocalPersistence` - uses `localStorage`
- `browserSessionPersistence` - uses `sessionStorage`
- `indexedDBLocalPersistence` - uses `indexedDB`
- `inMemoryPersistence` - essentially no persistence? 

Note: Firebase `@exp` API does not document `initializeAuth` properly at the moment (0.900.15).

<!-- tbd. Link to a comparison sheet about the approach pros/cons would be useful; once/if available from Firebase.
-->

The implication of using IndexedDB is that there are left-overs in the browser's IndexedDB cache, showing who has been using the browser. As an app developer, have a look at these in Developer tools and decide, whether you want a less storing authentication.

Reference: https://github.com/firebase/firebase-js-sdk/discussions/4570#discussioncomment-426317
