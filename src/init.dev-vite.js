/*
* src/init.dev-vite.js
*
* The entry point for development mode.
*
* There are a couple of reasons for this separate layer between 'index.html' and 'main.js'.
*   - Firebase initialization is crucially different for the 'dev:local' mode vs. 'dev:online' and production.
*   - allows easy differentiation/experiments between Rollup and Vite approaches
*/
//import * as firebase from 'firebase/app'    // DOES NOT WORK (in Vite, dev mode) but is according to npm firebase instructions
import firebase from 'firebase/app'     // works (but does not allow firebaseui from npm :( )

import 'firebase/auth'
import 'firebase/firestore'   // for local mode
import 'firebase/functions'

/*
* Don't want to add dependency on 'assert' module.
*/
function assert(cond, msgOpt) {
  if (!cond) {
    if (msgOpt) {
      console.assert(msgOpt);
    }
    throw new Error(`Assertion failed: ${msgOpt || '(no message)'}`);
  }
}

assert(firebase.initializeApp, "Firebase initialization failed");

// As long as loading Firebase via 'import' is shaky (at least with Vite 1.0.0-rc.8 in dev mode), let's place it
// as a global.
//
window.firebase = firebase;
window.assert = assert;

function init({ apiKey, projectId, locationId, authDomain }) {    // called by 'index.html'
  assert(apiKey && projectId && locationId);

  firebase.initializeApp({
    apiKey,
    projectId,
    locationId,
    authDomain
  });

  // Check Firebase health
  // Note: This needs to be done here, not in 'main.js'. In there, the components will import Firebase before the
  //    main code.
  //
  try {
    const app = firebase.app();
    const features = ['auth','firestore','functions'].filter(feature => typeof app[feature] === 'function');
    console.log(`Firebase SDK loaded with: ${features.join(', ')}`);
  } catch (e) {
    // tbd. we might have some error banner UI, later
    console.error(e);
    alert('Error loading the Firebase SDK, check the console.');
  }

  // Detect local emulation and set it up. Needs to be before any 'firebase.firestore()' use.
  //
  // Note: Would LOVE two things to happen:
  //    - emulation to be a configuration thing for Firebase. Set up there, not here.
  //    - the 'firebase' object to expose (e.g. 'firebase.emulated: [...]' whether parts are emulated or not)
  //
  //    Until then, we get the order from the build system. 💂‍
  //
  const LOCAL = import.meta.env.MODE == "dev_local";
  if (LOCAL) {
    console.info("Initializing for LOCAL EMULATION");

    const DEV_FUNCTIONS_URL = "http://localhost:5001";
    const FIRESTORE_HOST = "localhost:6767";    // Could pass this from 'firebase.json' as 'import.meta...' #maybe

    // As instructed -> https://firebase.google.com/docs/emulator-suite/connect_functions#web
    //
    // Note: source code states "change this [functions] instance". But it seems that another 'firebase.functions()'
    //    later must return the same instance, since this works. #firebase #docs #unsure
    //
    firebase.functions().useFunctionsEmulator(DEV_FUNCTIONS_URL);

    firebase.firestore().settings({   // affects all subsequent use (and can be done only once)
      host: FIRESTORE_HOST,
      ssl: false
    });

    window.LOCAL = true;    // inform the UI
  }

  // Load 'main' dynamically. This makes sure that the Firebase initialization we did above is the *first* to touch
  // Firebase. Otherwise, some inner module (likely 'SignIn') would be the one initializing it for all.
  //
  // Also, 'assert' initialization preceeds app modules, because of this (otherwise, they'd need to make imports).
  //
  import('./app.js');
}

import { __ } from '../.__.js'
init(__);

export { };
