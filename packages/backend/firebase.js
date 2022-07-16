/*
* Generates a 'firebase.json' within Docker.
*
* Note: Also used for app side CI.    tbd. make a separate 'firebase.ci.js'
*
* References:
*   - Schema
*     -> https://github.com/firebase/firebase-tools/blob/master/schema/firebase-config.json
*/
const CI = !! process.env["BUILDER_OUTPUT"];

export default {
  firestore: {
    rules: "./firestore.rules",
    indexes: "./firestore.indexes.json"
  },
  database: {
    rules: "./database.rules.json"
  },
  functions: {
    source: "./functions"
  },
  emulators: {
    firestore: {
      port: 6767,
      host: "0.0.0.0"
    },
    database: {
      port: 6800,
      host: "0.0.0.0"
    },
    functions: {
      port: 5002,
      host: "0.0.0.0"
    },
    ...(CI ? { auth: { port: 9100, host: "0.0.0.0" } } : {}),   // used for app backend

    ui: CI ? { enabled: false } : {   // no need to put CPU cycles to waste in CI
      port: 4000,
      host: "0.0.0.0"
    }
  }
}
