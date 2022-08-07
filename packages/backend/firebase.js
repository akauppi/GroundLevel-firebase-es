/*
* Generates a 'firebase.json' within Docker.
*
* References:
*   - Schema
*     -> https://github.com/firebase/firebase-tools/blob/master/schema/firebase-config.json
*/
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
      port: 6767,
      host: "0.0.0.0"
    },
    functions: {
      port: 5002,
      host: "0.0.0.0"
    },
    ui: {
      port: 4000,
      host: "0.0.0.0"
    }
  }
}
