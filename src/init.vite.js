/*
* src/init.vite.js
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
import 'firebase/firestore'
import 'firebase/functions'

import { Fatal } from './fatal.js'

/*
* Don't want to add dependency on 'assert' module.
*/
function assert(cond, msgOpt) {
  if (!cond) {
    if (msgOpt) {
      console.assert(msgOpt);
    }
    throw new Fatal(`Assertion failed: ${msgOpt || '(no message)'}`);
  }
}

assert(firebase.initializeApp, "Firebase initialization failed");

// As long as loading Firebase via 'import' is shaky (at least with Vite 1.0.0-rc.8 in dev mode), let's place it
// as a global.
//
window.firebase = firebase;
window.assert = assert;

const LOCAL = import.meta.env.MODE === "dev_local";
window.LOCAL = LOCAL;    // inform the UI

// ES note: Seems 'import.meta.env' must be read at the root.
const _MODE = import.meta.env.MODE;

let enableFirebasePerfProm;   // Promise of boolean | undefined

if (!LOCAL) {     // tbd. once have top-level-await, use it here
  enableFirebasePerfProm = (async _ => {
    // Dynamic import so that '.env.js' is not needed, for 'dev:local'
    //
    const { ops } = await import('./config.js');

    // For 'dev:online' and production, we require ops configuration to be given.
    //
    if (ops.perf?.type === undefined) {   // not set; no perf
      return false;
    }
    else if (ops.perf.type === 'firebase') {
      return true;
    } else {
      throw Fatal(fatalConfigurationMismatch, `Configuration mismatch: 'ops.perf.type' has unknown value: ${ops.perf.type}`);
    }
  })();
}

async function initFirebase() {   // () => Promise of ()

  // For 'dev:local', we only need authentication information and "any" project will do for that. This allows us to
  // let people try out the repo, before creating a project in Firebase console.
  //
  if (LOCAL) {
    console.info("Initializing for LOCAL EMULATION");

    const justAuthOptions = {
      apiKey: 'AIzaSyD29Hgpv8-D0-06TZJQurkZNHeOh8nKrsk',
      projectId: 'app',     // <-- must match that in 'package.json'
      authDomain: 'vue-rollup-example.firebaseapp.com'
    };

    // Minimum fields, needed for auth. Using a known-to-exist project.
    //
    // Note: project id needs to match that in 'package.json' (carrying it past Vite from 'GCLOUD_PROJECT' was difficult)
    //
    firebase.initializeApp(justAuthOptions);

    // Set up local emulation. Needs to be before any 'firebase.firestore()' use.
    //
    // Note: Would LOVE two things to happen:
    //    - emulation to be a configuration thing for Firebase. Set up there, not here!!
    //    - the 'firebase' object to expose (e.g. 'firebase.emulated: [...]' whether parts are emulated or not)
    //        OR: to have a REST API that exposes these details
    //
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

  } else {
    if (_MODE === "development") {    // dev:online
      console.info("Initializing for DEV:ONLINE (cloud back-end; local, watched front-end).");

      const mod = await import('../__.js');   // not needed for 'dev:local'
      const {apiKey, appId, authDomain, projectId} = mod.__;

      firebase.initializeApp({
        apiKey,
        appId,      // needed by Firebase Performance Monitoring
        projectId,
        authDomain
      });

    } else {      // 'npx vite build' - just TESTING for comparison with Rollup - quality rot warning!!! 💩
      console.warn("Initializing for Vite PRODUCTION (experimental!!!)");

      assert(_MODE === "production");

      // Hack '__' here (allows this to work with any hosting) 🤪
      //
      const json = {
        "apiKey": 'AIzaSyD29Hgpv8-D0-06TZJQurkZNHeOh8nKrsk',
        "projectId": 'vue-rollup-example',
        "authDomain": 'vue-rollup-example.firebaseapp.com'
      };

      firebase.initializeApp(json);
    }

    if (await enableFirebasePerfProm) {
      await import ('firebase/performance');
      firebase.performance();   // should provide basic reporting (tbd. how to differ between 'dev:ops' and production tracking?)  <-- app name?
    }
  }
}

(async _ => {
  await initFirebase();
  await import('./central.js');   // initialize central logging
  /*run free*/ import('./app.js');
})();
