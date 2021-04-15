/*
* /init/main.js
*
* Entry point for Vite. Development mode harness that is *not* part of the application, itself.
* Does *not* get packed.
*/
import { assert } from './assert.js'

import { initializeApp } from 'firebase/app'
import { /*getAuth,*/ initializeAuth, useAuthEmulator } from 'firebase/auth'
import { /*getFirestore,*/ initializeFirestore, useFirestoreEmulator, setLogLevel as setFirestoreLogLevel } from 'firebase/firestore'
import { getFunctions, useFunctionsEmulator } from 'firebase/functions'

const LOCAL = import.meta.env.MODE === "dev_local";

async function initFirebaseLocal() {   // () => Promise of ()
  assert(LOCAL);

  console.info("Initializing for LOCAL EMULATION");

  const projectId = import.meta.env.VITE_PROJECT_ID;

  const fah= initializeApp( {
    projectId,
    apiKey: "none"
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

  /*** was
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
  ***/

  // Prefer 'initializeX' over 'getX' since the latter is simply a proxy to the former.
  //
  const auth = initializeAuth(fah);
  const firestore = initializeFirestore(fah,{});

  // Firebase API inconsistency (9.0-beta.1). For some reason, there is no 'initializeFunctions' but the 'getFunctions'
  // takes parameters (that it doesn't, on other subpackages). #firebase
  //
  const fns = getFunctions(fah /*, regionOrCustomDomain*/ );

  // In case one needs to debug the Firestore client/server connection
  //setFirestoreLogLevel('debug');

  useFirestoreEmulator(firestore, 'localhost',FIRESTORE_PORT);
  useFunctionsEmulator(fns, 'localhost',FUNCTIONS_PORT);
  useAuthEmulator(auth, AUTH_URL);

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
    import.meta.env.VITE_APP_ID,    // needed for Firebase Performance Monitoring
    import.meta.env.VITE_AUTH_DOMAIN,
    import.meta.env.VITE_PROJECT_ID
  ]
  assert(apiKey && appId && authDomain && projectId, "Some Firebase param(s) are missing");

  initializeApp( { apiKey, appId, authDomain, projectId } );
}

/*const tailProm =*/ (async _ => {   // loose-running tail (no top-level await in browsers)
  if (LOCAL) {
    await initFirebaseLocal();
  } else {
    initFirebaseOnline();
  }

  const { init } = await import('/@/app.js');
  await init();
})();
