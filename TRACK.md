# Track

## vite - Custom imports map (alias) support

Mentioned on the README (0.6.0). 

This is *highly* welcome to us!!! 🎉🎊🍬

- Removed from Vite README (0.7.0)

Track [https://github.com/vitejs/vite/issues/279](https://github.com/vitejs/vite/issues/279)


## Import maps (in browser)

https://wicg.github.io/import-maps/

State: no browser support?

>not a W3C Standard nor is it on the W3C Standards Track


## CSS standard support for nesting

https://drafts.csswg.org/css-nesting/

Once implemented in browsers, we don't need the `lang="scss"` any more.

Note: The ideology of the repo is to work close to what plain browsers offer. Thus, no SASS once we can get nesting without it.


## Firebase Auth emulator

>An Auth Emulator is on our roadmap.

Firebase Live chat 23-Jun-2020.  Happy!  🦋


## Rollup-plugin-vue for Vue.js 3 (beta) needs an extra plugin for CSS/Sass

[https://github.com/vuejs/rollup-plugin-vue/issues/364](https://github.com/vuejs/rollup-plugin-vue/issues/364)

Needed to add the `rollup-plugin-scss` to `package.json` and `rollup.*.js`.

If they react on the issue, we can remove the extra plugin.


## FirebaseUI from `npm`

[https://github.com/firebase/firebaseui-web/issues/674](https://github.com/firebase/firebaseui-web/issues/674)

Once a fix is available, let's bring in FirebaseUI via `npm` (`pr-issue-7-firebaseui`).

[https://github.com/firebase/firebaseui-web/issues/612](https://github.com/firebase/firebaseui-web/issues/612)

That is also connected.

[https://github.com/firebase/firebase-js-sdk/issues/3315](https://github.com/firebase/firebase-js-sdk/issues/3315)

That could be closed.


## Cloud Functions: ES modules support

At the moment (<strike>Jul</strike> Aug 2020), one can use ECMAscript modules in Firebase Functions with Babel.

Node.js 12 for Cloud Functions is in "beta".

When node.js >= 13.2 is available, we can transition `functions` code to use ES modules. Don't feel like playing with Babel, in the mean time.

- [Cloud Functions for Firebase using es6 import statement](https://stackoverflow.com/questions/42739539/cloud-functions-for-firebase-using-es6-import-statement)
- [Why is the Node version on Firebase Cloud Functions so old?](https://stackoverflow.com/questions/49451039/why-is-the-node-version-on-firebase-cloud-functions-so-old)

**Alternative**

Firebase could launch node.js (version 12) with `--experimental-modules` flag, and make sure we can try ES modules support, already now.


## Firebase Auth Emulation

Discussed at [#1677](https://github.com/firebase/firebase-tools/issues/1677).


## Cloud Functions as a private package

- [Cannot deploy private packages with Node 10](https://github.com/firebase/firebase-functions/issues/607) (firebase-functions)
  
Seems some people are using the `functions` folder as private.

We didn't, but until this is fixed we likely also cannot.

- [ ] keep an eye on. Having `package-lock.json` there is okay.


## Jest: native ES module support

- In StackOverflow: [https://stackoverflow.com/questions/60372790/node-v13-jest-es6-native-support-for-modules-without-babel-or-esm](https://stackoverflow.com/questions/60372790/node-v13-jest-es6-native-support-for-modules-without-babel-or-esm)

  - [ ] write a solution if we get one

- In Jest GitHub Issues: [#9430](https://github.com/facebook/jest/issues/9430)
  - has a useful per-subfeature list about the support

   Note especially (not supported): 
   
   - "Detect if a file is supposed to be ESM or CJS mode"
   

## Firebase: proper native ES modules support

So this isn't needed (in `fns-test/tools/session.js`):

```
import firebase from 'firebase/app/dist/index.cjs.js'
import "firebase/firestore/dist/index.cjs.js"
```

Track:

- [ ] Find an issue to track this


## `vite build` crashes on us!!!

```
$ npx vite build
vite v1.0.0-rc.4
⠋ Building for production...
[vite] Build errored out.
Error: [vite]: Rollup failed to resolve import "%7B%7B%20m.photoURL%20%7D%7D" from "src/pages/Project/index.vue?vue&type=template&id=81f22f30&scoped=true".
This is most likely unintended because it can break your application at runtime.
If you do want to externalize this module explicitly add it to
`rollupInputOptions.external`
    at Object.onwarn (/Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/vite/dist/node/build/index.js:70:19)
    at Object.onwarn (/Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/rollup/dist/shared/rollup.js:19374:20)
    at ModuleLoader.handleResolveId (/Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/rollup/dist/shared/rollup.js:18249:26)
    at /Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/rollup/dist/shared/rollup.js:18239:22
    at async Promise.all (index 1)
    at async ModuleLoader.fetchStaticDependencies (/Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/rollup/dist/shared/rollup.js:18237:34)
    at async Promise.all (index 0)
    at async ModuleLoader.fetchModule (/Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/rollup/dist/shared/rollup.js:18214:9)
    at async Promise.all (index 1)
    at async ModuleLoader.fetchStaticDependencies (/Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/rollup/dist/shared/rollup.js:18237:34) {
  watchFiles: [
    '/Users/asko/Git/GroundLevel-es6-firebase-web/index.html',
    '/Users/asko/Git/GroundLevel-es6-firebase-web/src/init.vite.js',
    '/Users/asko/Git/GroundLevel-es6-firebase-web/__.js',
...
```

Reporting this at []().

## Firebase Crashlytics -> Web

- [https://github.com/firebase/firebase-js-sdk/issues/710](https://github.com/firebase/firebase-js-sdk/issues/710)


## Airbrake: Performance Monitoring for browser

Seems they are working on it. 

[https://akauppi-gmail-com.airbrake.io/projects/294803/performance](https://akauppi-gmail-com.airbrake.io/projects/294803/performance) has a "Request Performance Monitoring for airbrake-js/browser" link (but clicking it did nothing...)

Also:

>We don't currently have Performance Monitoring for our js/browser notifier but are planning on adding it. Please stay tuned.

- [ ] Once available, let's integrate to it!

## Rollup-plugin-vue dependency

This would seemingly help with rollup-plugin-vue [#364](https://github.com/vuejs/rollup-plugin-vue/issues/364) and thus with us not needing to load a plugin.

- [https://github.com/Norserium/vue-advanced-cropper/issues/72](https://github.com/Norserium/vue-advanced-cropper/issues/72)

Also otherwise try to link with `rollup-plugin-vue`.


