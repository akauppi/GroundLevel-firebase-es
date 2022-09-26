/*
* config.js
*/
let projectId, host;

const FIREBASE_APP_JS = process.env['FIREBASE_APP_JS'] || 'firebase.app.js';
const [firestorePort, authPort] = await import(FIREBASE_APP_JS).then( mod => {
  const o = mod.default?.emulators;

  const a = o?.firestore?.port || fail(`No 'emulators.firestore' in ${FIREBASE_APP_JS}`);
  const b = o?.auth?.port || fail(`No 'emulators.firestore' in ${FIREBASE_APP_JS}`);

  return [a,b]
});

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
