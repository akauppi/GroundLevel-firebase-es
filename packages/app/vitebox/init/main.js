/*
* /init/main.js
*
* Entry point for Vite. Development mode harness that is *not* part of the application, itself.
* Does *not* get packed.
*/
import { assert } from './assert.js'

import firebase from 'firebase/app'
import '@firebase/auth'
import '@firebase/firestore'
import '@firebase/functions'

const LOCAL = import.meta.env.MODE === "dev_local";

async function initFirebaseLocal() {   // () => Promise of FirebaseApp

  // For 'dev:local', one does not need a Firebase project (or even account) in the cloud.
  //
  // Query parameters:
  //    - user=<uid>    bypass sign-in, as such a user (eg. values in 'local/users.js' or real Firebase uid's - NOT TESTED!)
  //
  const urlParams = new URLSearchParams(window.location.search);
  const autoSignUserId = urlParams.get('user');   // e.g. 'user=dev'

  console.info("Initializing for LOCAL EMULATION");

  // For Firestore, we need to match the project id given in launching the emulators.
  //
  const projectId = window.LOCAL_PROJECT || (() => {    // "app"
    throw new Error("'LOCAL_PROJECT' not defined");
  })();

  console.debug("Project id:", projectId);

  const fah= firebase.initializeApp( {
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

  firebase.firestore().useEmulator('localhost',FIRESTORE_PORT);
  firebase.functions().useEmulator('localhost',FUNCTIONS_PORT);
  firebase.auth().useEmulator(AUTH_URL);

  if (autoSignUserId) {
    // Note: Do allow any user id to be used, for auto signing. We just haven't tested it with real uid's, but that
    //      may be useful (ie. customize one's 'local/docs.js' with real uid's of the team).
    /*** disabled
    if (!users[autoSignUserId]) {
      throw new Error(`User id '${autoSignUserId}' not in 'local/users.js`);
    }
    ***/

    console.debug("Automatically signing in as:", autoSignUserId);

    await firebase.auth().signInWithCustomToken( JSON.stringify({ uid: autoSignUserId }) );
  }

  // Signal to Cypress tests that Firebase can be used (emulation setup is done).
  //
  window["TESTS_GO!"] = firebase;   // expose our 'firebase'; otherwise Cypress seems to have problems

  return fah;
}

function initFirebase() {   // () => FirebaseApp    // dev:online, production build
  const [ apiKey, authDomain, projectId ] = [
    import.meta.env.VITE_API_KEY,
    import.meta.env.VITE_AUTH_DOMAIN,
    import.meta.env.VITE_PROJECT_ID
  ]

  assert(apiKey && authDomain && projectId, "Some Firebase param(s) are missing");

  return firebase.initializeApp({
    apiKey,
    authDomain,
    projectId
  });
}

async function initCentral() {    // () => Promise of central

  return await import('./central.js').then( mod => mod.central );
}

/*const tailProm =*/ (async _ => {   // loose-running tail (no top-level await in browsers)
  const t0 = performance.now();

  const [__, central] = await Promise.all([
    LOCAL ? initFirebaseLocal() : initFirebase(),
    initCentral()
  ]);

  const dt = performance.now() - t0;
  console.debug(`Initializing ops stuff (in parallel) took: ${dt}ms`);  // 90, 100, 114 ms

  window.central = central;

  console.debug("Launching app...");

  const { init } = await import('/@/app.js');
  //REMOVE? const init = await import('/@/app.js').then( mod => mod.init );
  await init();

  console.debug("App on its own :)");
})();
