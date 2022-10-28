# Track


## Cypress will provide means to config what gets cleared, between tests 🐌

Until it does, we have work-arounds in `cypress/support`.

- [Cypress should clear indexeddb state between test runs](https://github.com/cypress-io/cypress/issues/1208)

- [Enable Lifecycle Events to be customizable](https://github.com/cypress-io/cypress/issues/686) (I did not read it all) states that "clear all" should be the default, but what gets cleared is to be made configurable.

Currently (5.3.0), Cypress does not clear IndexedDB storage and therefore Firebase log-ins are persistent, over tests.

Once there is a way to configure this (instead of code), we might prefer that.


<!-- no longer needed? (config gets built in as .js)
## `import` of JSON in browser

- Track [proposal-json-modules](https://github.com/tc39/proposal-json-modules) (tc39 proposal)
   - [ ] reaching stage 4 (stage 3 in May 2022)
   - [ ] being implemented in browsers

Might take a while. 

Once available on modern browsers, consider moving the Firebase config reading (in prod) to use this???

- [How to import a JSON file ...?](https://stackoverflow.com/a/68593192/14455) (SO)
-->

## `rollup-plugin-visualizer` to have better ESM support

At May 2022, the [`package.json`](https://github.com/btd/rollup-plugin-visualizer/blob/master/package.json) does not have an `exports` section.

Having one might help us use it, within the `build` DC task.

Background:

We need to install it globally (`-g`), since the `/work/node_modules` is read-only and installing to `/node_modules` is not allowed, by Node.js.

>Tried a work-around of making `/work/2` and then we can use `--prefix ..`, but that's kind of over-complicating things.


## Safari: not showing errors within a top-level `await`

Version: Safari 15.5

- [ ] tbd. look for an issue to track / create one?

The Safari 15 browser shows NO ERROR IN CONSOLE OUTPUT if an error happens within a top-level `await` block.

Sample (in a JavaScript file):

```
await (async function () {
  no_such_thing;
})();
```

**Expected**

An error would be logged in console, when this is executed.

Chrome 102 shows this:

```
Uncaught ReferenceError: no_such_thing is not defined
at main.js:109:3
    at main.js:111:3
```    

**Actual**

No error. The script silently stops executing at the `await`.

**Outcome**

DO NOT use top-level `await` in browser code, for now. 


## CSS standard support for nesting

- [https://drafts.csswg.org/css-nesting/](https://drafts.csswg.org/css-nesting/)
- [https://caniuse.com/?search=css%20nesting](https://caniuse.com/?search=css%20nesting)

Once/if implemented in browsers, we don't need the `lang="scss"` any more.

Note: The ideology of the repo is to work close to what plain browsers offer. Thus, no SASS once we can get nesting without it.


## Firestore JS SDK needs "long polling" when run under Cypress

This has tickets open on both Cypress and Firebase side...

- [ ] [Cypress #2374](https://github.com/cypress-io/cypress/issues/2374) (opened Aug 2018) has the story.

	To have Cypress test Firestore JS code, "long polling" option is a must.

	There are instructions in there, which work for Chrome. Don't want to apply them, since a) adds complexity, b) would like a proper workflow with Electron. (There's a [lengthy write about performance](https://github.com/cypress-io/cypress/issues/2374#issuecomment-1095479320) in the issue).

- [ ] [RFC: Usage of experimentalForceLongPolling option](https://github.com/firebase/firebase-js-sdk/issues/1674) (Apr 2019)

   A ticket on the Firebase side.
   
## Vite 3.2.0 eagerly evaluates dynamic imports in `vite.config.js`

We used to provide the `rollup-plugin-visualizer` only for production builds, but now list it in main `package.json`.

This may be okay. It can be treated as an application specific extra instead of the "framework".

- [ ] Provide a minimal reproduction, to improve Vite's quality

   They have good guidelines on how such needs to be done. `vite init` something.
   
   