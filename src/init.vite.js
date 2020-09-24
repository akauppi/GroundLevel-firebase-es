/*
* src/init.vite.js
*
* The entry point for Vite (development and potential 'prod:vite:serve').
*
* Having two different initializations (Vite; Rollup) serves a few goals:
*   - development initialization of Firebase is hugely different from production setup (unfortunate)
*   - import of some libraries is different in Rollup vs. Vite (generally, Vite seems to be more easy to work with)
*   - the REAL value we get is having two production candidates (Vite and Rollup builds); both of which should work!! :)
*/
import { assert } from './assert.js'

//import * as firebase from 'firebase/app'    // DOES NOT WORK (in Vite, dev mode) but is according to npm firebase instructions
//import firebase from 'firebase/app'     // works (but does not allow firebaseui from npm :( )

import { firebase } from '@firebase/app/dist/index.esm.js'    // works; index2017.esm.js doesn't
import '@firebase/auth'
import '@firebase/firestore'
import '@firebase/functions'

import { Notifier } from '@airbrake/browser'
import { ops } from "./ops-config"      // normal ES import works with Vite (NOT with Rollup)

assert(firebase.initializeApp, "Firebase initialization failed");

const LOCAL = import.meta.env.MODE === "dev_local";

let enableFirebasePerfProm;   // Promise of boolean | undefined

if (!LOCAL) {     // tbd. once have top-level-await, use it here
  enableFirebasePerfProm = (async _ => {
    // Dynamic import so that '.env.js' is not needed, for 'dev:local'
    //
    const { ops } = await import('./ops-config.js');

    if (ops.perf.type == 'firebase') {
      return true;
    } else if (ops.perf.type) {
      throw new Error(`Unexpected 'perf.type' ops config (ignored): ${ops.perf.type}`);
        // note: Doesn't really need to be this fatal, but best to have the configs sound.
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
    firebase.initializeApp(justAuthOptions);

    // Set up local emulation. Needs to be before any 'firebase.firestore()' use.
    //
    // We get the necessary values from 'firebase.json' itself. This way, things are controlled there, and the code
    // follows, accordingly.
    //
    // Note: Would LOVE:
    //    - the 'firebase' library to handle this all on its own
    //    - the 'firebase' object to expose emulation status (e.g. as 'firebase.emulated...')
    //
    const [firestorePort, fnsPort] = await (async () => {
      const json = await fetch('./firebase.json').then(resp => {
        if (!resp.ok) {
          console.fatal("Unable to read 'firebase.json'", resp);
          throw new Error("Unable to read 'firebase.json' (see console)");
        } else {
          return resp.json();   // Promise of ... ('.then' takes care of it)
        }
      });

      const aPort = json.emulators?.firestore?.port || (_ => { throw new Error("Please define 'emulators.firestore.port' in firebase.json." ); })();
      const bPort = json.emulators?.functions?.port || (_ => { throw new Error("Please define 'emulators.functions.port' in firebase.json." ); })();

      return [aPort,bPort];
    })();
    const FIRESTORE_HOST = `localhost:${firestorePort}`;   // "localhost:6767"
    const DEV_FUNCTIONS_URL = `http://localhost:${fnsPort}`;    // "localhost:5002"

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
    //tbd. REMOVE comment? ES note: Seems 'import.meta.env' must be read at the root.
    const _MODE = import.meta.env.MODE;   // 'development'|'production'

    const mod = await import('../.env.js');
    const {apiKey, appId, authDomain, projectId} = mod.firebase;

    assert(apiKey && appId && authDomain && projectId, "Some Firebase param(s) are missing");

    if (_MODE === "production") {   // 'npx vite build' - just TESTING for comparison with Rollup builds
      console.warn("Initializing for Vite PRODUCTION (experimental!!!)");
    }

    firebase.initializeApp({
      apiKey,
      appId,      // needed by Firebase Performance Monitoring
      projectId,
      authDomain
    });

    if (await enableFirebasePerfProm) {
      await import ('@firebase/performance');

      // tbd. How to differ between 'dev:online' and production tracking? Maybe use app name??? #firebase
      firebase.performance();   // basic reporting
    }
  }
}

async function initCentral() {    // () => Promise of central
  // Airbrake has issues with import in Rollup (but not in Vite). This is why we provide the value as a global
  // (to be abandoned, once we can just import it statically, within 'central.js').
  //
  window.Notifier = Notifier;

  return await import('./central.js').then( mod => mod.central );
}

(async _ => {
  console.debug("Initializing ops stuff...");

  const t0 = performance.now();

  const [__, central, ___] = await Promise.all([
    initFirebase(),
    initCentral(),
    import('./centralError.js')   // initializes as a side effect
  ]);

  const dt = performance.now() - t0;
  console.debug(`Initializing ops stuff (in parallel) took: ${dt}ms`);  // 90, 100, 114 ms

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
