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

## WebStorm: exclude `node_modules` from searches - but keep them for symbol lookup

This is a small but annoying part of WebStorm.

Likely the author has managed to mess up its configuration?=

- [How to exclude node_modules and .meteor from all searches and code inspections](https://intellij-support.jetbrains.com/hc/en-us/community/posts/207696445-How-to-exclude-node-modules-and-meteor-from-all-searches-and-code-inspections)


## Firebase Performance Monitoring: "near real time" is coming "soon"...?

- [Near real time data processing and display](https://firebase.google.com/docs/perf-mon/troubleshooting?authuser=0&platform=web#faq-real-time-data) (Firebase docs)

>Although the listed SDK versions enable Performance Monitoring to process your collected data in near real time, the Firebase console does not yet display your data in near real time.

- [x] Did come
- [ ] gather experience


## ES Lint: Top-level-await support

Finally, ES Lint 8.0 will have it:

- [Add Support to Top-level await](https://github.com/eslint/eslint/issues/14632)

Remove this when we can upgrade all of these:

- [x] `8.0.0-beta.0` is available: [releases](https://github.com/eslint/eslint/releases)
   - [ ] [eslint-plugin-node](https://github.com/mysticatea/eslint-plugin-node/releases) is not using it, yet (Aug-21)
   - [ ] `eslint-plugin-vue`
   - [ ] `eslint-plugin-cypress`
