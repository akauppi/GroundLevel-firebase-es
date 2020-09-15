/*
* src/init.vite.js
*
* The entry point for development mode.
*
* There are a couple of reasons for this separate layer between 'index.html' and 'main.js'.
*   - Firebase initialization is crucially different for the 'dev:local' mode vs. 'dev:online' and production.
*   - allows easy differentiation/experiments between Rollup and Vite approaches
*/
import { assert } from './assert.js'

//import * as firebase from 'firebase/app'    // DOES NOT WORK (in Vite, dev mode) but is according to npm firebase instructions
//import firebase from 'firebase/app'     // works (but does not allow firebaseui from npm :( )

import { firebase } from '@firebase/app/dist/index.esm.js'    // works; index2017.esm.js doesn't
import '@firebase/auth'
import '@firebase/firestore'
import '@firebase/functions'

import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

import { Notifier } from '@airbrake/browser'    // normal ES import works with Vite (NOT with Rollup)

assert(firebase.initializeApp, "Firebase initialization failed");

const LOCAL = import.meta.env.MODE === "dev_local";

let enableFirebasePerfProm;   // Promise of boolean | undefined

if (!LOCAL) {     // tbd. once have top-level-await, use it here
  enableFirebasePerfProm = (async _ => {
    // Dynamic import so that '.env.js' is not needed, for 'dev:local'
    //
    const { ops } = await import('./ops-config.js');

    // For 'dev:online' and production, we require ops configuration to be given.
    //
    if (ops.perf?.type === undefined) {   // not set; no perf
      return false;
    }
    else if (ops.perf.type === 'firebase') {
      return true;
    } else {
      throw Error(/*fatalConfigurationMismatch,*/ `Configuration mismatch: 'ops.perf.type' has unknown value: ${ops.perf.type}`);
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
    //REMOVE comment? ES note: Seems 'import.meta.env' must be read at the root.
    const _MODE = import.meta.env.MODE;   // 'development'|'production'

    const mod = await import('../.env.js');
    const {apiKey, appId, authDomain, projectId} = mod.firebase;

    assert(apiKey && appId && authDomain && projectId, "Some Firebase param(s) are missing");

    if (_MODE === "development") {    // dev:online
      console.info("Initializing for DEV:ONLINE (cloud back-end; local, watched front-end).");

    } else {      // 'npx vite build' - just TESTING for comparison with Rollup - quality rot warning!!! 💩
      assert(_MODE === "production");
      console.warn("Initializing for Vite PRODUCTION (experimental!!!)");
    }

    firebase.initializeApp({
      apiKey,
      appId,      // needed by Firebase Performance Monitoring
      projectId,
      authDomain
    });

    // tbd. Must differ between 'dev:online' and production tracking (call it 'prod:vite:serve', not 'production'). <-- app name?
    //
    if (await enableFirebasePerfProm) {
      await import ('@firebase/performance');
      firebase.performance();   // should provide basic reporting
    }
  }
}

async function initCentral() {    // () => Promise of central
  // Both Toastify and Airbrake have issues with static import in Rollup (but not in Vite). This is why we provide
  // the values as a global (to be abandoned, once we can just import them statically, within 'central.js').
  //
  window.Toastify = Toastify;
  window.Notifier = Notifier;

  const mod = await import('./central.js'); const { central } = mod;
  return central;
}

(async _ => {
  console.debug("Initializing Firebase and central...");
  const [__, central] = await Promise.all([initFirebase(), initCentral()]);

  window.assert = assert;
  window.central = central;

  // Note: If we let the app code import Firebase again, it doesn't get e.g. 'firebase.auth'.
  //    For this reason - until Firebase can be loaded as-per-docs - provide 'firebase' as a global to it.
  //
  window.firebase = firebase;

  console.debug("Launching app...");

  const mod = await import('./app.js'); const { init } = mod;
  await init();

  console.debug("App on its own :)");
})();
