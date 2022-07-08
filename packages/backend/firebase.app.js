/*
* Firebase emulation for front-end development
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
      port: 6768,
      host: "0.0.0.0"
    },
    database: {
      port: 6801,
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
    ui: CI ? { enabled: false } :{    // no need to burden CI with a UI
      port: 4001,
      host: "0.0.0.0"
    }
  }
}
