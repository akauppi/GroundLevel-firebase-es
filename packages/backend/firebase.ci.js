/*
* Generates a 'firebase.json' for CI; both backend and app.
*
* References:
*   - Schema
*     -> https://github.com/firebase/firebase-tools/blob/master/schema/firebase-config.json
*/

// Enable auth and Realtime Database only if their ports have been provided.
//
const AUTH_PORT= process.env["AUTH_PORT"];
const DATABASE_PORT= process.env["DATABASE_PORT"];
const FIRESTORE_PORT = process.env["FIRESTORE_PORT"] || fail( `Expecting 'FIRESTORE_PORT' env.var.`);
const FUNCTIONS_PORT = process.env["FUNCTIONS_PORT"] || fail( `Expecting 'FUNCTIONS_PORT' env.var.`);

// Note: Realtime database is not used. Add if CI testing includes testing for metrics/logging delivery.

export default {
  firestore: {
    rules: "./firestore.rules",
    indexes: "./firestore.indexes.json"
  },
  functions: {
    source: "./functions"
  },
  ...DATABASE_PORT ? { database: { rules: "./database.rules.json" } } : {},
  emulators: {
    firestore: {
      port: FIRESTORE_PORT,   // 6767
      host: "0.0.0.0"
    },
    functions: {
      port: FUNCTIONS_PORT,   // 5002
      host: "0.0.0.0"
    },
    ...DATABASE_PORT ? { database: { port: DATABASE_PORT, host: "0.0.0.0" } } : {},
    ...AUTH_PORT ? { auth: { port: AUTH_PORT, host: "0.0.0.0" } } : {},
    ui: {   // no need for UI in CI
      enabled: false
    }
  }
}

function fail(msg) { throw new Error(msg) }
