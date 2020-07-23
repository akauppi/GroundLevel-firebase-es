/*
* src/init.dev-vite.js
*
* The entry point for development mode.
*
* There are a couple of reasons for this separate layer between 'index.html' and 'main.js'.
*   - Firebase initialization is crucially different for the lcoal modes, vs. production.
*   - Having Firebase initialization in index.html (and setting it as a global) would make Rollup not catch it, as a module.
*   - This allows easy differentiation/experiments between Rollup and Vite approaches (to e.g. Firebase loading).
*/
//import * as firebase from 'firebase/app';   // DOES NOT WORK (in Vite, dev mode) but is according to npm firebase instructions
import firebase from 'firebase/app';    // works (but does not allow firebaseui from npm :( )

import 'firebase/auth';
import 'firebase/firestore';  // for lcoal mode
import 'firebase/functions';

// Note: We don't want to import project-internal things at this level.

// As long as loading Firebase via 'import' is shaky (at least with Vite 1.0.0-beta.11 in dev mode),
// let's place it as a global.
//
// Once we know the official way ('import * as firebase from 'firebase/app') works, we can go back to having
// modules read them as imports.
//
window.firebase = firebase;

/*
* Set up globals
*
* Note: 'assert' must be set up in a block that does not import our app level code (or maybe it could be an import,
*     itself).
*/
function assert(cond) {
  if (!cond) {
    debugger;   // allows us to see the 'call stack' in browser
    throw "Assertion failed!";
  }
}

window.assert = assert

assert(firebase.initializeApp);

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
    const [DEV_FUNCTIONS_URL, DEV_FIRESTORE_HOST] = ["http://localhost:5001", "localhost:8080"];    // #cleanup

    // As instructed -> https://firebase.google.com/docs/emulator-suite/connect_functions#web
    //
    // Note: source code states "change this [functions] instance". But it seems that another 'firebase.functions()'
    //    later must return the same instance, since this works. #firebase #docs #unsure
    //
    firebase.functions().useFunctionsEmulator(DEV_FUNCTIONS_URL);

    firebase.firestore().settings({   // affects all subsequent use (and can be done only once)
      host: DEV_FIRESTORE_HOST,
      ssl: false
    });

    window.LOCAL = true;    // inform the UI
  }

  // Load 'main' dynamically. This makes sure that the Firebase initialization we did above is the *first* to touch
  // Firebase. Otherwise, some inner module (likely 'SignIn') would be the one initializing it for all.
  //
  import('./app.js');
}

import { __ } from './.__.js'
init(__);

export { };
