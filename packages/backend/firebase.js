/*
* Firebase emulation for backend testing.
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
  functions:
    { source: "./functions" }
    //[{ "source": "functions",     "codebase": "main" }]
  ,
  database: {
    rules: "./database.rules.json"
  },
  emulators: {
    firestore: {
      port: 6767,
      host: "0.0.0.0"
    },
    database: {
      port: 6868,
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
