/*
* Firebase emulation for front-end development.
*
* Also used for eventual deployment (sans 'emulators', of course).
*/
export default {
  firestore: {
    rules: "firestore.rules",
    indexes: "firestore.indexes.json"
  },
  functions: {
    source: "functions"
  },
  database: {
    rules: "database.rules.json"
  },
  emulators: {
    firestore: {
      port: 6768,
      host: "0.0.0.0"
    },
    functions: {
      port: 5003,
      host: "0.0.0.0"
    },
    auth: {
      port: 9101,
      host: "0.0.0.0"
    },
    database: {
      port: 6869,
      host: "0.0.0.0"
    },
    ui: {
      port: 4001,
      host: "0.0.0.0"
    }
  }
}
