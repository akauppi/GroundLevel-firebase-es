# Track

<!-- might not need this (Vite aliases work)
## Import maps (in browser)

https://wicg.github.io/import-maps/

State: no browser support?

>not a W3C Standard nor is it on the W3C Standards Track
-->

## CSS standard support for nesting

https://drafts.csswg.org/css-nesting/

Once implemented in browsers, we don't need the `lang="scss"` any more.

Note: The ideology of the repo is to work close to what plain browsers offer. Thus, no SASS once we can get nesting without it.


## Rollup-plugin-vue for Vue.js 3 (beta) needs an extra plugin for CSS/Sass

[https://github.com/vuejs/rollup-plugin-vue/issues/364](https://github.com/vuejs/rollup-plugin-vue/issues/364)

Needed to add the `rollup-plugin-scss` to `package.json` and `rollup.*.js`.

If they react on the issue, we can remove the extra plugin.


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
   

## Firebase Crashlytics -> Web

- [https://github.com/firebase/firebase-js-sdk/issues/710](https://github.com/firebase/firebase-js-sdk/issues/710)


<!-- DISABLED: We don't like Airbrake, any more...
## Airbrake: Performance Monitoring for browser

><font color=red>Note: We might opt out of Airbrake altogether.</font>

Seems they are working on it. 

[https://akauppi-gmail-com.airbrake.io/projects/294803/performance](https://akauppi-gmail-com.airbrake.io/projects/294803/performance) has a "Request Performance Monitoring for airbrake-js/browser" link (but clicking it did nothing...)

Also:

>We don't currently have Performance Monitoring for our js/browser notifier but are planning on adding it. Please stay tuned.

- [ ] Once available, let's integrate to it!
-->

## `firebase@exp` for tree-shaking!!!

They are REWRITING the JavaScript client, as `exp` (expire?). 

- [ ] Check out, especially when auth support is there: [https://github.com/firebase/firebase-js-sdk/issues/2241](https://github.com/firebase/firebase-js-sdk/issues/2241)

"A couple of months" further down the road (Nov 2020).


## Rollup-plugin-vue dependency

This would seemingly help with rollup-plugin-vue [#364](https://github.com/vuejs/rollup-plugin-vue/issues/364) and thus with us not needing to load a plugin.

- [https://github.com/Norserium/vue-advanced-cropper/issues/72](https://github.com/Norserium/vue-advanced-cropper/issues/72)

Also otherwise try to link with `rollup-plugin-vue`.


## Rollbar Vue plugin: availability for Vue.js 3?

- Study its sources or take into action once there is a Vue.js 3 version.
- [https://github.com/gaelreyrol/vue-rollbar](https://github.com/gaelreyrol/vue-rollbar)

## Firebase hosting: not using HTTP/2

- [https://github.com/firebase/firebase-tools/issues/2571](https://github.com/firebase/firebase-tools/issues/2571)

Once it does, remove mention in `DEVS/Wishes for Vite`. We can better use Lighthouse locally, at that point.


## Firebase: Bundle size reduction

Firebase has been asked to slim down [since 2017](https://github.com/firebase/firebase-js-sdk/issues/332). 

In Aug 2020, there is an `exp` effort on the way, however without authentication.

- [https://github.com/firebase/firebase-js-sdk/issues/2241](https://github.com/firebase/firebase-js-sdk/issues/2241)

One great idea from 2018:

>One immediate optimization would be load Firebase UI only when the user is not logged in, using Dynamic imports or an equivalent. 

Sure. Track the AUTH work of `exp` and see if they do it this way.

- [ ] Have the code working, with `exp` (once they support Auth at least for Google login)
- [ ] Get Firebase UI away from HTML, and to be brought in via `npm` (currently we cannot, due to another glitch; see "FirebaseUI from npm")

**Special tracking:**

- [https://github.com/firebase/firebase-js-sdk/pull/3722](https://github.com/firebase/firebase-js-sdk/pull/3722)

   Once that is merged, we should be able to test `exp`.
   
   
## firebase-admin: no way to create users, under Auth emulator?

```
 FirebaseAuthError: There is no user record corresponding to the provided identifier.
```

..with 9.4.0.

  #sigh


   