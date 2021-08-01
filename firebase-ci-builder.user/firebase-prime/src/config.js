/*
* config.js
*
* Provide configuration info, based on 'firebase.json' (in the current folder).
*/
import { existsSync, readFileSync } from 'fs'

const firebaseJson = "./firebase.json";

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

const host = "emul";

export {
  firestorePort,
  authPort,
  host
}
