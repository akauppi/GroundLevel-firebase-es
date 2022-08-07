/*
* Firebase emulation for front-end development
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
    ui: {
      port: 4001,
      host: "0.0.0.0"
    }
  }
}
