/*
* Firebase emulation for backend testing.
*
* References:
*   - Schema
*     -> https://github.com/firebase/firebase-tools/blob/master/schema/firebase-config.json
*/
const { firestore, functions } = await import('./firebase.app.js').then(mod => mod.default);

export default {
  firestore,
  functions,
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
