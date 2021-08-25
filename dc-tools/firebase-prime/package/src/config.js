/*
* config.js
*
* Provide configuration info, based on 'firebase.json' (in the current folder) and CLI parameters.
*/
import { existsSync, readFileSync } from 'fs'

let projectId, host;

const firebaseJson = "./firebase.json";

function init(a, b) {   // (string, string) => ()
  projectId = a;
  host = b;
}

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
