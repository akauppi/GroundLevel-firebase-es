/*
* dev/main.js
*
* Entry point for Vite. Development mode harness that is *not* part of the application's production builds.
*/
import { assert } from './assert.js'

import { initializeApp } from '@firebase/app'
import { getAuth, connectAuthEmulator, initializeAuth, debugErrorMap } from '@firebase/auth'
import { getFirestore, connectFirestoreEmulator } from '@firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from '@firebase/functions'

const LOCAL = import.meta.env.MODE === "dev_local";

// For the sake of Cypress tests (at least), set up human readable error messages. This only applies to development.
//
// Samples:
//    "The email address is already in use by another account." vs.
//    "Firebase: Error (auth/email-already-in-use)."
//
// See -> https://github.com/firebase/firebase-js-sdk/issues/5305
//
const HUMAN_READABLE_AUTH_ERRORS_PLEASE = true;

async function initFirebaseLocal(host) {   // (string) => Promise of ()
  assert(LOCAL);

  console.info("Initializing for LOCAL EMULATION");

  const projectId = import.meta.env.VITE_PROJECT_ID;

  const fah= initializeApp( {
    projectId,
    apiKey: "none",
    authDomain: "no.domain"
      //
      // Mitigates a browser console error (and another one that would otherwise occur if the user presses
      // 'Sign in with Google' in local mode). This is uncharted waters; the main means for local mode authentication
      // is intended to be the '?user=dev' query param.
  } );

  // Set up local emulation. Needs to be before any 'firebase.firestore()' use.
  //
  // Build has poured the necessary values from 'firebase.json' to us, as VITE_... constants.
  //
  const [firestorePort, fnsPort, authPort] = [
    import.meta.env.VITE_FIRESTORE_PORT,
    import.meta.env.VITE_FUNCTIONS_PORT,
    import.meta.env.VITE_AUTH_PORT
  ];
  assert(firestorePort && fnsPort && authPort, "Some Firebase param(s) are missing; problem in build");

  const FIRESTORE_PORT = parseInt(firestorePort);           // 6769
  const FUNCTIONS_PORT = parseInt(fnsPort);                 // 5003
  const AUTH_URL = `http://${host}:${authPort}`;            // "http://emul:9101"

  const firestore = getFirestore();

  // If you use a region when Cloud Functions are emulated, set it here.
  //
  // Firebase API inconsistency (9.0-beta.{1..3}):
  //    For some reason, there is no 'initializeFunctions' but the 'getFunctions' takes parameters (which it doesn't,
  //    on other subpackages). #firebase
  //
  const fns = getFunctions(fah /*, regionOrCustomDomain*/ );

  const auth = HUMAN_READABLE_AUTH_ERRORS_PLEASE ? initializeAuth(fah, { errorMap: debugErrorMap }) : getAuth();

  connectFirestoreEmulator(firestore, host,FIRESTORE_PORT);
  connectFunctionsEmulator(fns, host,FUNCTIONS_PORT);
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
  const [apiKey, appId, authDomain, projectId] = [
    import.meta.env.VITE_API_KEY,
    import.meta.env.VITE_APP_ID,      // needed only for Firebase Performance Monitoring
    import.meta.env.VITE_AUTH_DOMAIN,
    import.meta.env.VITE_PROJECT_ID
  ];

  assert(apiKey && appId && authDomain && projectId, "Some Firebase param(s) are missing");

  initializeApp( { apiKey, appId, authDomain, projectId } );
}

/*const tailProm =*/ (async _ => {   // loose-running tail (no top-level await in browsers)
  if (LOCAL) {
    const host = import.meta.env.VITE_EMUL_HOST || 'localhost';    // CI overrides it

    await initFirebaseLocal(host);
  } else {
    await initFirebaseOnline();
  }

  const { initializedProm } = await import('/@/app.js');
  return initializedProm;
})();
