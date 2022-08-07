/*
* Generates a 'firebase.json' for CI; both backend and app.
*
* References:
*   - Schema
*     -> https://github.com/firebase/firebase-tools/blob/master/schema/firebase-config.json
*/

// Enable auth only if 'AUTH_PORT' has been provided.
//
const AUTH_PORT= process.env["AUTH_PORT"];
const FIRESTORE_PORT = process.env["FIRESTORE_PORT"] || fail( `Expecting 'FIRESTORE_PORT' env.var.`);
const FUNCTIONS_PORT = process.env["FUNCTIONS_PORT"] || fail( `Expecting 'FUNCTIONS_PORT' env.var.`);

export default {
  firestore: {
    rules: "./firestore.rules",
    indexes: "./firestore.indexes.json"
  },
  functions: {
    source: "./functions"
  },
  emulators: {
    firestore: {
      port: FIRESTORE_PORT,   // 6767
      host: "0.0.0.0"
    },
    functions: {
      port: FUNCTIONS_PORT,   // 5002
      host: "0.0.0.0"
    },
    ... AUTH_PORT ? { auth: { port: AUTH_PORT, host: "0.0.0.0" } } : {},
    ui: {   // no need for UI in CI
      enabled: false
    }
  }
}

function fail(msg) { throw new Error(msg) }
