# Track


## Cypress will provide means to config what gets cleared, between tests 🐌

Until it does, we have work-arounds in `cypress/support`.

- [Cypress should clear indexeddb state between test runs](https://github.com/cypress-io/cypress/issues/1208)

- [Enable Lifecycle Events to be customizable](https://github.com/cypress-io/cypress/issues/686) (I did not read it all) states that "clear all" should be the default, but what gets cleared is to be made configurable.

Currently (5.3.0), Cypress does not clear IndexedDB storage and therefore Firebase log-ins are persistent, over tests.

Once there is a way to configure this (instead of code), we might prefer that.


<!--
## ESLint: top level await support pending "stage 4"

We'd like the ESlint error for top level await (e.g. in `local/init.js`) to be configured out, without bringing in Babel parser.

Like here: [Enable Top Level Await](https://github.com/eslint/eslint/issues/13178) (GitHub issues; closed)

- Track: [ECMAscript proposal: Top-level await](https://github.com/tc39/proposal-top-level-await) (GitHub) for reaching stage 4. 

   - [ ] Once there, find an issue at ESLint to track.

In "stage 3" (26 Oct 2020; Jan 2021).

In "stage 4" (Aug 2021). Will be in ESLint 8.0.
-->

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


## Vite and `lang="scss"`

If you use `lang="scss"` in the `style` sections, this occurs:

```
$ npm run build
...
[vite:css] Preprocessor dependency "sass" not found. Did you install it?
```

- [ ] What is Vite official stand on this? Should `lang="scss"` support be built-in?

> Still there, with Vite 2.9.8. 
