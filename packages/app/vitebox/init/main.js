/*
* /init/main.js
*
* Entry point for Vite. Development mode harness that is *not* part of the application, itself.
* Does *not* get packed.
*/
import { assert } from './assert.js'

import { initializeApp } from 'firebase/app'
import { getAuth, useAuthEmulator } from 'firebase/auth'
import { getFirestore, useFirestoreEmulator } from 'firebase/firestore'
import { getFunctions, useFunctionsEmulator } from 'firebase/functions'

/** KEEP for helping with this -> https://github.com/firebase/firebase-js-sdk/discussions/4534 **
import { getAnalytics } from 'firebase/analytics'
getAnalytics;
import { getApp } from 'firebase/app'
getApp;
import { getIdToken } from 'firebase/auth'
getIdToken;
import { getDatabase } from 'firebase/database'
getDatabase
import { arrayUnion } from 'firebase/firestore'
arrayUnion
import { FieldPath } from 'firebase/firestore/lite'
FieldPath
import { getFunctions as ignore8 } from 'firebase/functions'
ignore8
import { getMessaging } from 'firebase/messaging'
getMessaging
import { getPerformance } from 'firebase/performance'
getPerformance
import { activate } from 'firebase/remote-config'
activate
import { getStorage } from 'firebase/storage'
getStorage
//**/

const LOCAL = import.meta.env.MODE === "dev_local";

async function initFirebaseLocal() {   // () => Promise of FirebaseApp
  assert(LOCAL);

  /*** REMOVE?
  // For 'dev:local', one does not need a Firebase project (or even account) in the cloud.
  //
  // Query parameters:
  //    - user=<uid>    bypass sign-in, as such a user (eg. values in 'local/users.js' or real Firebase uid's - NOT TESTED!)
  //
  const urlParams = new URLSearchParams(window.location.search);
  const autoSignUserId = urlParams.get('user');   // e.g. 'user=dev'
  ***/

  console.info("Initializing for LOCAL EMULATION");

  // For Firestore, we need to match the project id given in launching the emulators.
  //
  const projectId = window._LOCAL_PROJECT || (() => {    // "app"
    throw new Error("'_LOCAL_PROJECT' not defined");
  })();

  console.debug("Project id:", projectId);

  const fah= initializeApp( {
    projectId,
    apiKey: "none",
    authDomain: "no.such.com"   // tbd. is this needed?
  } );

  // Set up local emulation. Needs to be before any 'firebase.firestore()' use.
  //
  // Build has poured the necessary values from '../firebase.json' to us, as VITE_... constants.
  //
  // Note: Even LOCAL needs auth emulation to be started. Otherwise the impersonation fails.
  //
  const [firestorePort, fnsPort, authPort] = [
    import.meta.env.VITE_FIRESTORE_PORT,
    import.meta.env.VITE_FUNCTIONS_PORT,
    import.meta.env.VITE_AUTH_PORT
  ];

  const FIRESTORE_PORT = parseInt(firestorePort);           // 6767
  const FUNCTIONS_PORT = parseInt(fnsPort);                 // 5002
  const AUTH_URL = `http://localhost:${authPort}`;          // "http://localhost:9100"

  // Firebase note:
  //    'getAuth' initializes the default authentication and (it or 'initializeAuth') MUST BE CALLED BEFORE any other
  //    SDK access.
  //
  //    The error message is slightly confusing, since we only have one SDK in use:
  //    <<
  //      Firebase: Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK. (auth/dependent-sdk-initialized-before-auth).
  //    <<
  //
  //const [firestore, fns, auth] = [getFirestore(fah), getFunctions(fah), getAuth(fah)];  // fails
  const [auth, firestore, fns] = [getAuth(fah), getFirestore(fah), getFunctions(fah)];  // ok :)

  useFirestoreEmulator(firestore, 'localhost',FIRESTORE_PORT);
  useFunctionsEmulator(fns, 'localhost',FUNCTIONS_PORT);
  useAuthEmulator(auth, AUTH_URL);

  /*** disabled (moved to router)
  if (autoSignUserId) {
    // Note: Do allow any user id to be used, for auto signing. We just haven't tested it with real uid's, but that
    //      may be useful (ie. customize one's 'local/docs.js' with real uid's of the team).

    console.debug("Automatically signing in as:", autoSignUserId);

    await signInWithCustomToken( auth, JSON.stringify({ uid: autoSignUserId }) )   // GETS STUCK!!

    console.debug("!!!");
  }
  ***/

  // Signal to Cypress tests that Firebase can be used (emulation setup is done).
  //
  // tbd. #rework now that we're in '@exp' land! :)
  //window["TESTS_GO!"] = firebase;   // expose our Firebase app; otherwise Cypress seems to have problems

  return;   // No need to return 'fah'
}

function initFirebaseOnline() {
  assert(!LOCAL);

  const [ apiKey, appId, authDomain, projectId ] = [
    import.meta.env.VITE_API_KEY,
    import.meta.env.VITE_APP_ID,    // only matters for Firebase Performance Monitoring
    import.meta.env.VITE_AUTH_DOMAIN,
    import.meta.env.VITE_PROJECT_ID
  ]
  assert(apiKey && authDomain && projectId, "Some Firebase param(s) are missing");

  initializeApp( { apiKey, appId, authDomain, projectId } );
}

async function initCentral() {    // () => Promise of central

  return await import('./central.js').then( mod => mod.central );
}

/*const tailProm =*/ (async _ => {   // loose-running tail (no top-level await in browsers)
  const t0 = performance.now();

  if (LOCAL) {
    await initFirebaseLocal();
  } else {
    initFirebaseOnline();
  }

  const central = await initCentral();

  const dt = performance.now() - t0;
  console.debug(`Initializing stuff took: ${dt}ms`);        // OLD DATA: ~~90~~, ~~100~~, ~~114~~ ms

  window.central = central;

  console.debug("Launching app...");

  const { init } = await import('/@/app.js');
  await init();

  console.debug("App on its own :)");
})();
