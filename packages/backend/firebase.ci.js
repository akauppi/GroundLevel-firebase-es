/*
* Generates a 'firebase.json' for CI tests (backend).
*
* Note:
*   Unlike most of CI, this file _does_ import from 'firebase.app.js'. We can do this because that file is used
*   in actual CD deployments, and thus seen as being in both the dev and the CI domains.
*
* References:
*   - Schema
*     -> https://github.com/firebase/firebase-tools/blob/master/schema/firebase-config.json
*/
const { firestore, functions } = await import('./firebase.app.js').then(mod => mod.default);
firestore && functions || fail();

// Fix ports here. Any ports would be fine.
const FIRESTORE_PORT = 6767;
const FUNCTIONS_PORT = 5002;

function fail(msg) { throw new Error(msg) }

export default {
  firestore,
  functions,
  emulators: {
    firestore: {
      port: FIRESTORE_PORT,
      host: "0.0.0.0"
    },
    functions: {
      port: FUNCTIONS_PORT,
      host: "0.0.0.0"
    },
    ui: {   // no need for UI in CI
      enabled: false
    }
  }
}
