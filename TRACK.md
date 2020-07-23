# Track

## vite - Custom imports map (alias) support

Mentioned on the README (0.6.0). 

This is *highly* welcome to us!!! 🎉🎊🍬

- Removed from Vite README (0.7.0)

Track [https://github.com/vitejs/vite/issues/279](https://github.com/vitejs/vite/issues/279)


## Support of Vue 3.0 from Chrome Vue development plugin

It's not detecting the setup.

<strike>Also the [beta channel](https://chrome.google.com/webstore/detail/vuejs-devtools/ljjemllljcmogpfapbkkighbhhppjdbg) doesn't.</strike> Dev tools 6.0 is now in beta. Does not show up with 3.0.0-rc2.

- [issues](https://github.com/vuejs/vue-devtools/issues)

There's a new [vue 3/ vue next](https://github.com/vuejs/vue-devtools/issues/1199) issue that brings this up (May 20).


<strike>
## Bootstrap-Vue on Vue 3 (beta)

[Vue 3 support](https://github.com/bootstrap-vue/bootstrap-vue/issues/5196)</strike>


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


## Making Emulator and Firestore-admin have a date

[https://github.com/googleapis/google-cloud-go/issues/1978](https://github.com/googleapis/google-cloud-go/issues/1978)

It's strange this would be a problem.. Let's keep an eye on the:

>going to be larger than any one client to be improved.

(comment 15-May-20)

Status: Using `@firebase/testing` to prime the emulator (in `npm run dev:local`). Works.

Keep an eye on this, but we don't need it.

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


## Firebase Functions: ES modules support (node.js >= 13.2)

At the moment (Jul 2020), one can use ECMAscript modules in Firebase Functions with Babel.

Node.js 12 is in "beta". 

When node.js >= 13.2 is available, we can transition `functions` code to use ES modules. Don't feel like playing with Babel, in the mean time.

- [https://stackoverflow.com/questions/42739539/cloud-functions-for-firebase-using-es6-import-statement]()


## Firebase Auth Emulation

Discussed at [#1677](https://github.com/firebase/firebase-tools/issues/1677).


## Cloud Functions as a private package

- [Cannot deploy private packages with Node 10](https://github.com/firebase/firebase-functions/issues/607) (firebase-functions)
  
Seems some people are using the `functions` folder as private.

We didn't, but until this is fixed we likely also cannot.

- [ ] keep an eye on. Having `package-lock.json` there is okay.

