# Track (backend)

## 🍒 (Jest: native ES module support)

- [Support ESM versions of all pluggable modules](https://github.com/facebook/jest/issues/11167)

  - [ ] `resolver` still unchecked. Why? Jest 28 needs no custom resolver.


<!-- Q: Is this still a thing?
## `@google-cloud/logging` ESM support

- [es6 import not able to import Logging](https://github.com/googleapis/nodejs-logging/issues/559)

Note: We won't need it, until `firebase-functions` runs with ESM. And even then, node allows using `require` in `type: "module"` packages.
-->

## Pre-heating the Cloud Functions

- [Functions emulator needs pre-heating - slower test times on first test run](https://github.com/firebase/firebase-tools/issues/3488) (`firebase-tools` issues)

Closed, but the issue remains.

<!-- tbd. Remove when logging works..
## Using `firebase-admin` 10.0 with `firebase-functions` 

- [Cannot install firebase-admin v10](https://github.com/firebase/firebase-functions/issues/996)

This might not apply any more; we are using `type: "module"` in the functions. Once we really log to Google logs, mention that this might no longer be an issue?
-->

