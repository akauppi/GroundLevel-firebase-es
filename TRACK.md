# Track


## CSS standard support for nesting

https://drafts.csswg.org/css-nesting/

Once implemented in browsers, we don't need the `lang="scss"` any more.

Note: The ideology of the repo is to work close to what plain browsers offer. Thus, no SASS once we can get nesting without it.


## Firebase Crashlytics -> Web

- [https://github.com/firebase/firebase-js-sdk/issues/710](https://github.com/firebase/firebase-js-sdk/issues/710)

>Then again, Firebase storage (database), back-end functions and auth together makes sense, since those all rely on auth. 
>
>The rest can be "picked" from various vendors: hosting, performance monitoring, A/B testing. The only benefit Firebase would provide is having the tools under one umbrella.
>
>[ ] Going to handle ops side, once the repo is otherwise done! 🐤

## `firebase@exp` for tree-shaking!!!

They are REWRITING the JavaScript client, as `exp` (expire?). 

- [ ] Check out, especially when auth support is there: [https://github.com/firebase/firebase-js-sdk/issues/2241](https://github.com/firebase/firebase-js-sdk/issues/2241)

"A couple of months" further down the road (Nov 2020).

>Still not there (Jan 2021).

Once we have something running with `@exp`, comparison of the before/after bundle sizes is what's interesting.

## WebStorm: exclude `node_modules` from searches - but keep them for symbol lookup

This is a small but annoying part of WebStorm.

- [How to exclude node_modules and .meteor from all searches and code inspections](https://intellij-support.jetbrains.com/hc/en-us/community/posts/207696445-How-to-exclude-node-modules-and-meteor-from-all-searches-and-code-inspections)

