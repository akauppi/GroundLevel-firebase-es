/*
* dev/main.js
*
* Entry point for Vite. Development mode harness that is *not* part of the application's production builds.
*/
import { initializeApp } from '@firebase/app'
import { getAuth, connectAuthEmulator, initializeAuth, debugErrorMap } from '@firebase/auth'
import { getFirestore, initializeFirestore, connectFirestoreEmulator,
  setLogLevel as firestore_setLogLevel } from '@firebase/firestore'

import { projectId } from '/@firebase.config.json'

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

  console.info("Initializing for LOCAL EMULATION", { host, projectId });

  // Cypress needs "long polling" for the Firestore WebChannel interface to work ('firebase-tools' 11.11.0;
  // '@firebase/firestore' 3.5.0; Cypress 10.8.0).
  //
  // Note: Cypress can be used both on the 'make dev' hosted front end (Cypress desktop), and the headless variant
  //    ('make test'). Which means we should check this at runtime.
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

  const FIRESTORE_PORT = parseInt(firestorePort);           // 6768
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

  // Helpers for Cypress tests.
  //
  // Note: Was NOT able to do 'getAuth()' on the Cypress side so we pass the auth handle (and whatever else is necessary?)
  //    from here. Not sure why this is so.
  //
  //    tbd. Try again, by first waiting this is visible.
  //
  // Note: import 'common' dynamically: it expects Firebase to have been initialized.
  //
  if (window.Cypress) {
    const {createInc_TEST, createLog_TEST, createObs_TEST, flush} = await import('/@central/common');
    const {signOut: /*as*/ fbSignOut} = await import('@firebase/auth');

    window["Let's test!"] = [auth];   // [FirebaseAuth]

    // Help Cypress by having test-only features
    //
    window.TEST_portal = {
      incDummy: createInc_TEST("test-dummy"),
      logDummy: createLog_TEST("test-dummy", "info"),
      obsDummy: createObs_TEST("test-dummy"),
      flush,

      signOut: fbSignOut    // returns a Promise; hoping it gets properly turned into Cypress 'Chainable'...??
    };
  }
}

/*
* Running against an online project
*/
async function initFirebaseOnline() {
  const {apiKey, appId, authDomain, databaseURL} = await import("/@firebase.config.json");

  (apiKey && appId && authDomain && projectId && databaseURL) || (_ => { debugger })();
    // tbd.: disable the IDE lint warning (these are only for development; neat to get right into debugger)

  initializeApp( { apiKey, appId, authDomain, projectId, databaseURL } );
}

// Browser support for top-level await:
//
//  Chrome    full support
//  Safari    15.5 supports, but errors within the Promise were silently eaten.
//            15.6 full support (claimed)
//            16.1 errors not raised if a worker had a problem. CHROME SHOWS SUCH ERRORS MORE RELIABLY
//  Firefox   tbd. NOT TESTED
//  Edge      tbd. NOT TESTED
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
