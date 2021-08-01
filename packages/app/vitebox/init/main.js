/*
* /init/main.js
*
* Entry point for Vite. Development mode harness that is *not* part of the application, itself.
* Does *not* get packed.
*/
import { assert } from './assert.js'

import { initializeApp } from '@firebase/app'
import { getAuth, connectAuthEmulator } from '@firebase/auth'
import { getFirestore, connectFirestoreEmulator } from '@firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from '@firebase/functions'

const LOCAL = import.meta.env.MODE === "dev_local";

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
  const AUTH_URL = `http://${host}:${authPort}`;            // "http://emul:9100"

  const firestore = getFirestore();

  // If you use a region when Cloud Functions are emulated, set it here.
  //
  // Firebase API inconsistency (9.0-beta.{1..3}):
  //    For some reason, there is no 'initializeFunctions' but the 'getFunctions' takes parameters (which it doesn't,
  //    on other subpackages). #firebase
  //
  const fns = getFunctions(fah /*, regionOrCustomDomain*/ );
  const auth = getAuth();

  connectFirestoreEmulator(firestore, host,FIRESTORE_PORT);
  connectFunctionsEmulator(fns, host,FUNCTIONS_PORT);
  connectAuthEmulator(auth, AUTH_URL);

  // Signal to Cypress tests that Firebase can be used (emulation setup is done).
  //
  // Note: Was NOT able to do 'getAuth()' on the Cypress side so we pass the auth handle (and whatever else is necessary?)
  //    from here. Not sure why this is so.
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
    await initFirebaseLocal('localhost');
  } else {
    await initFirebaseOnline();
  }

  const { initializedProm } = await import('/@/app.js');
  return initializedProm;
})();

function fail(msg) { throw new Error(msg) }
