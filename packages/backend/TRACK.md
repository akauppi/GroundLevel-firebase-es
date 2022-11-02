# Track (backend)

<!--
## `@google-cloud/logging` ESM support

*Q: Is this still a thing?*

- [es6 import not able to import Logging](https://github.com/googleapis/nodejs-logging/issues/559)

Note: We won't need it, until `firebase-functions` runs with ESM. And even then, node allows using `require` in `type: "module"` packages.
-->

## Node 18 support for `firebase-functions`

- [ ] When available, pump up `functions/package.json`.

	<!-- No ticket, as of 6-Jun-22: https://github.com/firebase/firebase-functions/issues?q=is%3Aissue+is%3Aopen+18 -->

   We already run it with Node 18 in DC.


## Cloud Functions v2: maturity

- [ ] ["Limitations during public preview"](https://firebase.google.com/docs/functions/beta#limitations_during_public_preview) (Firebase docs)
- [ ] ["Cloud Firestore triggers for v2 functions"](https://github.com/firebase/firebase-functions/issues/1213) <sub>`firebase-functions`</sub>

### Cloud Firestore triggers 

>Support for native Cloud Firestore events (row level change triggers) in 2nd gen and Eventarc. <sub>[source](https://cloud.google.com/functions/docs/concepts/version-comparison#coming_soon_in_2nd_gen)</sub>

### Capital letters in function names

>Support for using capital letters in function names. <sub>[source](https://cloud.google.com/functions/docs/concepts/version-comparison#coming_soon_in_2nd_gen)</sub>

- [ ] Change `metrics-and-logging-proxy-v0` back to (almost) `metricsAndLoggingProxy-v0`.

### Cloudfunctions.net URLs

>Currently, function URLs in Cloud Functions (2nd gen) use a non-deterministic format, meaning you cannot predict your function URL before deployment (though the URL remains stable after deployment). In a future release, 2nd gen function URLs will be updated to be both stable and deterministic. <sub>[source](https://cloud.google.com/functions/docs/concepts/version-comparison#coming_soon_in_2nd_gen)</sub>

- [ ] Until this, the client (`app`: `src/central/*.js`) likely needs to be fixed to the URL: `https://metrics-and-logging-proxy-v0-lhnzrejgbq-lz.a.run.app`


## Pre-heating the Cloud Functions

- [Functions emulator needs pre-heating - slower test times on first test run](https://github.com/firebase/firebase-tools/issues/3488) (`firebase-tools` issues)

Closed, but the issue remains.

<!-- tbd. Remove when logging works..
## Using `firebase-admin` 10.0 with `firebase-functions` 

- [Cannot install firebase-admin v10](https://github.com/firebase/firebase-functions/issues/996)

This might not apply any more; we are using `type: "module"` in the functions. Once we really log to Google logs, mention that this might no longer be an issue?
-->

<!-- nah? not needed by us
## Impersonation with `firebase-admin` against Realtime Database Emulator does not work

- [ ] [RTDB emulator doesn't work properly with databaseAuthVariableOverride](https://github.com/firebase/firebase-tools/issues/2554)

It seems like something that's simply omitted. The Firebase approach seems to be to do impersonation in the client SDK. 

This approach is ..strange.. since impersonation use case is in tests that can use `firebase-admin`.

- [ ] [Documentation on using impersonation with Realtime Database Emulator](https://github.com/firebase/firebase-admin-node/issues/1777)

<!_-- hidden

>Firebase [docs](https://firebase.google.com/docs/database/admin/start?authuser=0#admin-sdk-setup) say:
>>If you are interested in using the Node.js SDK as a client for end-user access (for example, in a Node.js desktop or IoT application), as opposed to admin access from a privileged environment (like a server), you should instead follow the instructions for setting up the client JavaScript SDK.
--_>

Also:

- ["How to connect Firebase Admin to Emulator Auth"](https://stackoverflow.com/questions/71268856/how-to-connect-firebase-admin-to-emulator-auth) (SO)

- [Add the Firebase Admin SDK to your server](https://firebase.google.com/docs/admin/setup?authuser=0) (Firebase docs)

   No mention of emulators. Could fit nicely, there... (it does mention "When testing the Admin SDK locally").
-->


## CFv2 Beta issues

Grouped together; unrelated (but all having to do with Cloud Functions v2):

- [ ] ["[Beta] Region, CPU, memory, secrets options not available for scheduled functions (v2)"](https://github.com/firebase/firebase-functions/issues/1285)
- [ ] ["[Beta] CPU control of httpsCallable's doesn't seem to work (CPU < 1)"](https://github.com/firebase/firebase-functions/issues/1288)
