# Track

## vite - Custom imports map (alias) support

Mentioned on the README (0.6.0). 

This is *highly* welcome to us!!! 🎉🎊🍬

- Removed from Vite README (0.7.0)

Track [https://github.com/vitejs/vite/issues/279](https://github.com/vitejs/vite/issues/279)


## Support (of Vite and/or Vue 3.0 beta) from Chrome Vue development plugin

It's not detecting the setup.

Also the [beta channel](https://chrome.google.com/webstore/detail/vuejs-devtools/ljjemllljcmogpfapbkkighbhhppjdbg) doesn't.

<!--
The [issues](https://github.com/vuejs/vue-devtools/issues) do not mention anything about Vite or Vue 3 beta (28-Apr-20). When they do, add the direct link here.
-->

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


## Firebase Functions: ES modules support?

- [https://stackoverflow.com/questions/42739539/cloud-functions-for-firebase-using-es6-import-statement](https://stackoverflow.com/questions/42739539/cloud-functions-for-firebase-using-es6-import-statement)

Note: We want to use node's native ES support. It's likely coming soon (Cloud functions have Node.js 12 in beta - if that is important Jul-2020), and there's little to win with playing with Babel.

So ⛔️ to [this](https://codeburst.io/cloud-functions-for-firebase-with-compiled-code-e234e83462dc). 




