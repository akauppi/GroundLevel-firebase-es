/*
* dev/main.js
*
* Entry point for Vite. Development mode harness that is *not* part of the application's production builds.
*/
import { initializeApp } from '@firebase/app'
import { getAuth, connectAuthEmulator, initializeAuth, debugErrorMap } from '@firebase/auth'
import { getFirestore, initializeFirestore, connectFirestoreEmulator,
  setLogLevel as firestore_setLogLevel } from '@firebase/firestore'

const LOCAL = import.meta.env.MODE === "dev_local";

function fail(msg) { throw new Error(msg) }
function assert(cond) { cond || fail("Assert failed" ); }

// For the sake of Cypress tests (at least), set up human-readable error messages. This only applies to dev:local.
//
// Samples:
//    "The email address is already in use by another account." vs.
//    "Firebase: Error (auth/email-already-in-use)."
//
// See -> https://github.com/firebase/firebase-js-sdk/issues/5305
//
const HUMAN_READABLE_AUTH_ERRORS_PLEASE = true;

async function initFirebaseLocal() {   // () => Promise of ()
  const host = import.meta.env.VITE_EMUL_HOST || 'localhost';    // CI and running tests (DC) overrides it

  assert(LOCAL);

  console.info("Initializing for LOCAL EMULATION", { host });

  const projectId = import.meta.env.VITE_PROJECT_ID;

  // Cypress needs "long polling" for the Firestore WebChannel interface to work ('firebase-tools' 11.11.0;
  // '@firebase/firestore' 3.5.0; Cypress 10.8.0).
  //
  // Note: Cypress can be used both on the 'make dev' hosted front end (Cypress desktop) _and_ the headless variant
  //    ('make test'). Therefore, it's best we detect the need here at runtime instead of launch configuration (.env files).
  //
  //  References:
  //    - Comment in 'firebase-js-sdk' #4917 -> https://github.com/firebase/firebase-js-sdk/issues/4917#issuecomment-842481510
  //    - Comment in cypress-io/cypress #2374 -> https://github.com/cypress-io/cypress/issues/2374
  //
  const FORCE_FIRESTORE_LONG_POLLING = !! window.Cypress;

  const fah= initializeApp( {
    projectId,
    apiKey: "none"    // needed, otherwise 'auth/invalid-api-key' error (browser console)
  } );

  // Enable this if there are difficulties with Firestore connection. [DEBUG]
  //
  /* if(true){
    firestore_setLogLevel('debug');
  }*/

  // Set up local emulation. Needs to be before any 'firebase.firestore()' use.
  //
  // Build has poured the necessary values from 'firebase.json' to us, as VITE_... constants.
  //
  const [firestorePort, authPort] = [
    import.meta.env.VITE_FIRESTORE_PORT,
    import.meta.env.VITE_AUTH_PORT
  ];
  (firestorePort && authPort) ||
    fail( `[INTERNAL ERROR] Some Firebase param(s) are missing: ${ [firestorePort, authPort] }`);

  const FIRESTORE_PORT = parseInt(firestorePort);           // 6769
  const AUTH_URL = `http://${host}:${authPort}`;            // "http://emul:9101"

  const firestore = !FORCE_FIRESTORE_LONG_POLLING ? getFirestore() :
    initializeFirestore(fah, { experimentalForceLongPolling: true });
    //
    // Cypress needs Firestore long polling. It can be done either with 'experimentalForceLongPolling' or
    // 'experimentalAutoDetectLongPolling' setting. For us, we know what to do (unless Firebase or Cypress fixes this).

  const auth = HUMAN_READABLE_AUTH_ERRORS_PLEASE ? initializeAuth(fah, { errorMap: debugErrorMap }) :
    getAuth();

  connectFirestoreEmulator(firestore, host,FIRESTORE_PORT);
  connectAuthEmulator(auth, AUTH_URL, { disableWarnings: true });

  // Signal to Cypress tests that Firebase can be used (emulation setup is done).
  //
  // Note: Was NOT able to do 'getAuth()' on the Cypress side so we pass the auth handle (and whatever else is necessary?)
  //    from here. Not sure why this is so. (likely Cypress code runs before this has?)
  //
  // Importing anything from the app side must be done dynamically.
  //
  window["Let's test!"] = [auth];   // [FirebaseAuth]
}

/*
* Running against an online project
*/
async function initFirebaseOnline() {
  const [apiKey, appId, authDomain, projectId, databaseURL] = [
    import.meta.env.VITE_API_KEY,
    import.meta.env.VITE_APP_ID,      // needed only for Firebase Performance Monitoring
    import.meta.env.VITE_AUTH_DOMAIN,
    import.meta.env.VITE_PROJECT_ID,
    import.meta.env.VITE_DATABASE_URL   // optional; keep
  ];

  assert(apiKey && appId && authDomain && projectId, "Some Firebase param(s) are missing");

  initializeApp( { apiKey, appId, authDomain, projectId, databaseURL } );
}

// Browser support for top-level await:
//
//  Chrome    full support
//  Safari    15.5 supports, but errors within the Promise were silently eaten.
//            15.6 full support
//  Firefox   tbd. NOT TESTED
//  Edge      tbd. NOT TESTED
//

// Note: top level awaits
//
if (LOCAL) {
  await initFirebaseLocal();
} else {
  await initFirebaseOnline();
}
await import('/@/app.js');

/***
// TESTING
//  Safari 15.5:  nothing in console!! silently stops executing at the error line
 //        15.6:  ok; reports
//  Chrome 102:   ok; reports: "Uncaught ReferenceError: init is not defined\n at {snip}:1"
//
await (async function () {
  no_such_thing;
})()
  .catch( err => console.error("Error in top-level async block", err) )   // band-aid; shows the error also on Safari
***/
