# Track (backend)

## `@google-cloud/logging` ESM support

*Q: Is this still a thing?*

- [es6 import not able to import Logging](https://github.com/googleapis/nodejs-logging/issues/559)

Note: We won't need it, until `firebase-functions` runs with ESM. And even then, node allows using `require` in `type: "module"` packages.


## Node 18 support for `firebase-functions`

- [ ] When available, pump up `functions/package.json`.

	<!-- No ticket, as of 6-Jun-22: https://github.com/firebase/firebase-functions/issues?q=is%3Aissue+is%3Aopen+18 -->

   We already run it with Node 18 in DC.
  

## Pre-heating the Cloud Functions

- [Functions emulator needs pre-heating - slower test times on first test run](https://github.com/firebase/firebase-tools/issues/3488) (`firebase-tools` issues)

Closed, but the issue remains.

<!-- tbd. Remove when logging works..
## Using `firebase-admin` 10.0 with `firebase-functions` 

- [Cannot install firebase-admin v10](https://github.com/firebase/firebase-functions/issues/996)

This might not apply any more; we are using `type: "module"` in the functions. Once we really log to Google logs, mention that this might no longer be an issue?
-->

