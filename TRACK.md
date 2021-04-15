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

## npm - what is the point of workspaces?

If they leak all the files through, what's the point?

- [NPM Workspaces monorepo - share local package's distribution folder as root instead of the entire source files](https://stackoverflow.com/questions/66785791/npm-workspaces-monorepo-share-local-packages-distribution-folder-as-root-inst) (StackOverflow, 2021)


## Firebase Performance Monitoring: "near real time" is coming "soon"...?

- [Near real time data processing and display](https://firebase.google.com/docs/perf-mon/troubleshooting?authuser=0&platform=web#faq-real-time-data) (Firebase docs)

>Although the listed SDK versions enable Performance Monitoring to process your collected data in near real time, the Firebase console does not yet display your data in near real time.

- [ ] When will it?  
- [ ] How to know when "near real time" is enabled?

Note that "alpha" (obviously) isn't mentioned in the supported SDKs.


## Firebase SDK: peer dependency warnings

- [peerDependency warnings when installed with yarn@1/npm@7](https://github.com/firebase/firebase-js-sdk/issues/4789)

