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


## Rollup bundling of Vue.js 3 seems buggy.. 

https://github.com/vuejs/rollup-plugin-vue/issues/322

https://stackoverflow.com/questions/62384191/rollup-vue-and-buble-unexpected-token-in-scss-file

Would like to:

`rollup -c` just to work

Actual:

```
$ npx rollup -c

src/main.js → public/dist/...
[!] Error: Unexpected token (Note that you need plugins to import files that are not JavaScript)
src/App.vue?vue&type=style&index=0&id=7ba5bd90&scoped=true&lang.css (2:0)
Error: Unexpected token (Note that you need plugins to import files that are not JavaScript)
    at error (/Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/rollup/dist/shared/rollup.js:5154:30)
    at Module.error (/Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/rollup/dist/shared/rollup.js:9592:16)
    at tryParse (/Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/rollup/dist/shared/rollup.js:9506:23)
    at Module.setSource (/Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/rollup/dist/shared/rollup.js:9890:30)
    at ModuleLoader.addModuleSource (/Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/rollup/dist/shared/rollup.js:17749:20)
    at ModuleLoader.fetchModule (/Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/rollup/dist/shared/rollup.js:17803:9)
    at async Promise.all (index 2)
    at ModuleLoader.fetchStaticDependencies (/Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/rollup/dist/shared/rollup.js:17827:34)
    at async Promise.all (index 0)
    at ModuleLoader.fetchModule (/Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/rollup/dist/shared/rollup.js:17804:9)
    at async Promise.all (index 3)
    at ModuleLoader.fetchStaticDependencies (/Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/rollup/dist/shared/rollup.js:17827:34)
    at async Promise.all (index 0)
    at ModuleLoader.fetchModule (/Users/asko/Git/GroundLevel-es6-firebase-web/node_modules/rollup/dist/shared/rollup.js:17804:9)
    at async Promise.all (index 0)
```

