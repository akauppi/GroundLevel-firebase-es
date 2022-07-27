# Track


## Cypress will provide means to config what gets cleared, between tests 🐌

Until it does, we have work-arounds in `cypress/support`.

- [Cypress should clear indexeddb state between test runs](https://github.com/cypress-io/cypress/issues/1208)

- [Enable Lifecycle Events to be customizable](https://github.com/cypress-io/cypress/issues/686) (I did not read it all) states that "clear all" should be the default, but what gets cleared is to be made configurable.

Currently (5.3.0), Cypress does not clear IndexedDB storage and therefore Firebase log-ins are persistent, over tests.

Once there is a way to configure this (instead of code), we might prefer that.


<!--
| This one is for Rollup. We now use Vite for this level.

## Rollup-plugin-vue for Vue.js 3 (beta) needs an extra plugin for CSS/Sass

[https://github.com/vuejs/rollup-plugin-vue/issues/364](https://github.com/vuejs/rollup-plugin-vue/issues/364)

Needed to add the `rollup-plugin-scss` to `package.json` and `rollup.*.js`.

If they react on the issue, we can remove the extra plugin.

<_!--
This would seemingly help with rollup-plugin-vue [#364](https://github.com/vuejs/rollup-plugin-vue/issues/364) and thus with us not needing to load a plugin.

- [https://github.com/Norserium/vue-advanced-cropper/issues/72](https://github.com/Norserium/vue-advanced-cropper/issues/72)
-->


## `import` of JSON in browser

- Track [proposal-json-modules](https://github.com/tc39/proposal-json-modules) (tc39 proposal)
   - [ ] reaching stage 4 (stage 3 in May 2022)
   - [ ] being implemented in browsers

Might take a while. 

Once available on modern browsers, consider movig the Firebase config reading (in prod) to use this???

- [How to import a JSON file ...?](https://stackoverflow.com/a/68593192/14455) (SO)


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


## Vite

- [ ] [Vite: `You are using a wildcard host. Ports might be overridden.` - how to make it go?](https://stackoverflow.com/questions/72649249/vite-you-are-using-a-wildcard-host-ports-might-be-overridden-how-to-make) (StackOverflow)

