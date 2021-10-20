# Track (backend)

## 🍒 Jest: native ES module support

- [Support ESM versions of all pluggable modules](https://github.com/facebook/jest/issues/11167)

  - [ ] `resolver`: when checked, try without the custom resolver in `jest.config.default.js`


## `@google-cloud/logging` ESM support

- [es6 import not able to import Logging](https://github.com/googleapis/nodejs-logging/issues/559)

Note: We won't need it, until `firebase-functions` runs with ESM. And even then, node allows using `require` in `type: "module"` packages.


## Pre-heating the Cloud Functions

- [Functions emulator needs pre-heating - slower test times on first test run](https://github.com/firebase/firebase-tools/issues/3488) (`firebase-tools` issues)

Closed, but the issue remains.

## Using `firebase-admin` 10.0 with `firebase-functions` 

- [Cannot install firebase-admin v10](https://github.com/firebase/firebase-functions/issues/996)