/*
* config.js
*/
//import { existsSync, readFileSync } from 'fs'

let projectId, host;

// tbd. If wanting to read Firestore and auth ports from a file (instead of env.var), import them directly from
//    '../backend/firebase.app.js'.
//
//const firebaseJson = process.env.FIREBASE_JSON || 'firebase.json'

function init(a, b) {   // (string, string) => ()
  projectId = a;
  host = b;
}

/*** Use of 'firebase.json' disabled
// Get the Firebase emulator ports from Firebase configuration file.
//
const [firestorePort, authPort] = (_ => {

  if (!existsSync(firebaseJson)) {    // allow '--help' to be used, without a warning
    return [];
  } else {
    const raw = readFileSync(firebaseJson);
    const conf = JSON.parse(raw);

    const a = conf?.emulators?.firestore?.port || fail(`No 'emulators.firestore.port' in ${firebaseJson}`);
    const b = conf?.emulators?.auth?.port || fail(`No 'emulators.auth.port' in ${firebaseJson}`);
    return [a, b];
  }
})();
***/

const [firestorePort, authPort] = [
  process.env.FIRESTORE_PORT || fail("'FIRESTORE_PORT' env.var. missing"),
  process.env.AUTH_PORT || fail("'AUTH_PORT' env.var. missing")
]

function fail(msg) {
  console.error(msg);
  process.exit(2);
}

export {
  firestorePort,
  authPort,
  host,
  projectId,
    //
  init    // called by 'index.js' to provide us parameters
}
