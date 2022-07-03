/*
* dev/main.js
*
* Entry point for Vite. Development mode harness that is *not* part of the application's production builds.
*/
import { assert } from './assert.js'

import { initializeApp } from '@firebase/app'
import { getAuth, connectAuthEmulator, initializeAuth, debugErrorMap } from '@firebase/auth'
import { getFirestore, connectFirestoreEmulator } from '@firebase/firestore'
import { getDatabase, connectDatabaseEmulator } from '@firebase/database'

const LOCAL = import.meta.env.MODE === "dev_local";

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
  const host = import.meta.env.VITE_EMUL_HOST || 'localhost';    // CI overrides it

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
  const [firestorePort, authPort, databasePort] = [
    import.meta.env.VITE_FIRESTORE_PORT,
    import.meta.env.VITE_AUTH_PORT,
    import.meta.env.VITE_DATABASE_PORT
  ];
  assert(firestorePort && authPort && databasePort, "Some Firebase param(s) are missing; problem in build");

  const FIRESTORE_PORT = parseInt(firestorePort);           // 6769
  const AUTH_URL = `http://${host}:${authPort}`;            // "http://emul:9101"
  const DATABASE_PORT = parseInt(databasePort);             // 6801

  const firestore = getFirestore();

  const auth = HUMAN_READABLE_AUTH_ERRORS_PLEASE ? initializeAuth(fah, { errorMap: debugErrorMap }) : getAuth();

  const database = getDatabase();

  connectFirestoreEmulator(firestore, host,FIRESTORE_PORT);
  connectAuthEmulator(auth, AUTH_URL, { disableWarnings: true });
  connectDatabaseEmulator(database, host, DATABASE_PORT);

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
  const [apiKey, appId, authDomain, projectId, locationId, databaseURL] = [
    import.meta.env.VITE_API_KEY,
    import.meta.env.VITE_APP_ID,      // needed only for Firebase Performance Monitoring
    import.meta.env.VITE_AUTH_DOMAIN,
    import.meta.env.VITE_PROJECT_ID,
    import.meta.env.VITE_LOCATION_ID,
    import.meta.env.VITE_DATABASE_URL
  ];

  assert(apiKey && appId && authDomain && projectId && databaseURL, "Some Firebase param(s) are missing");

  initializeApp( { apiKey, appId, authDomain, projectId, databaseURL } );
}

// NOTE ABOUT TOP-LEVEL AWAIT:
//
//  Browsers support them, but Safari DOES NOT REPORT ERRORS within a top-level-await block properly. Thus, DO NOT USE
//  top-level-await until we know which version has it fixed.
//
//  Note:         This matters mostly in development, presuming that there's no errors that take place in production.
//  Work-around:  Possible risks can be managed by adding a manual '.catch' to the block.

/*const tailProm =*/ (async _ => {   // loose-running tail (no top-level await in browsers)
  if (LOCAL) {
    await initFirebaseLocal();
  } else {
    await initFirebaseOnline();
  }

  const { initializedProm } = await import('/@/app.js');
  return initializedProm;
})();

/***
// TESTING
//  Safari 15.5:  nothing in console!! silently stops executing at the error line
//  Chrome 102:   ok; reports: "Uncaught ReferenceError: init is not defined\n at {snip}:1"
//
await (async function () {
  no_such_thing;
})()
  .catch( err => console.error("Error in top-level async block", err) )   // band-aid; shows the error also on Safari
***/
