# Firebase Slim-down Diet 🩱

Firebase are [aware of](https://github.com/firebase/firebase-js-sdk/issues/2241) (GitHub Issues #2241) gained weight.

There's no justification for it. It must go. 

Here's our trying to help.

Outputs are from `rollup-plugin-analysis`; Rollup build.


## `@firebase/logger`

>Note: It's possible this is something else than the Logger mentioned for Cloud Functions. Seems like an internal front-end thingy, from the sources. (i.e. undocumented). Is that correct???

What is that doing in a browser project?  

It's supposed to be a logging tool for Cloud Functions, but we see it at the root level. `firebase` should *not* have a dependency to it.

( Or, which is much more preferable, it can but it should be offline friendly so we can actually use it for logging in a web app. )

```
file:            /node_modules/@firebase/logger/dist/index.esm.js
bundle space:    0.74 %
rendered size:   10.71 KB
original size:   10.811 KB
code reduction:  0.93 %
dependents:      3
  - /node_modules/@firebase/app/dist/index.esm.js
  - /node_modules/@firebase/firestore/dist/index.esm.js
  - /node_modules/@firebase/performance/dist/index.esm.js
```

Gain potential: -10kB

Suggestion: remove from dependency; should only be used by `firebase-functions` and maybe `firebase-admin`.


## `@firebase/firestore`

```
file:            /node_modules/@firebase/firestore/dist/index.esm.js
bundle space:    45.28 %
rendered size:   657.998 KB
original size:   654.818 KB
code reduction:  0 %
dependents:      1
  - /node_modules/firebase/firestore/dist/index.esm.js
```

This is the Elephant in the Room.

650kB of it.

Could that be e.g. coded in ways that would be more friendly to tree-shaking?


## Overall

|module|original|"rendered"|comments|
|---|---|---|---|
|`@firebase/firestore`|654 kB|657 kB|
|`@firebase/auth`|179 kB|178 kB|
|`@firebase/webchannel-wrapper`|62 kB|62 kB|due to: Firestore|
|`@firebase/performance`|58 kB|57 kB|
|`@firebase/installations`|54 kB|54 kB|due to: performance|
|`@firebase/app`|27 kB|27 kB|
|`@firebase/functions`|25 kB|25 kB|
|`@firebase/util`|61 kB|20 kB|
|`@firebase/component`|13 kB|13 kB|
|`@firebase/logger`|10 kB|10 kB|why is it even here? (see above)|
|`idb/lib`|7 kB|7 kB|used by: `@firebase/installations` - and thus performance|

The rest is negligible.


