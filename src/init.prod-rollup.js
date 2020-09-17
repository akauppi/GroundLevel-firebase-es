/*
* src/init.prod-rollup.js
*
* The entry point for Rollup (production candidate).
*
* See also comments in 'src/init.vite.js'.
*/
import { assert } from './assert.js'

// DOES NOT WORK but is according to npm firebase instructions:
//  <<
//    initializeApp is not exported by node_modules/firebase/app/dist/index.esm.js
//  <<
//
//import * as firebase from 'firebase/app'    // still fails with firebase 8.10.0 (7.19.1)
//import firebase from 'firebase/app'     // works (but does not allow firebaseui from npm :( )

//import firebase from '@firebase/app'  // this works
import { firebase } from '@firebase/app/dist/index.esm2017.js'    // also works
import '@firebase/auth'
import '@firebase/firestore'
import '@firebase/functions'

import { ops } from './ops-config.js'

assert(firebase.initializeApp);

const enableFirebasePerf = (_ => {
  if (ops.perf.type == 'firebase') {
    return true;
  } else if (ops.perf.type) {
    throw new Error(`Unexpected 'perf.type' ops config (ignored): ${ops.perf.type}`);
      // note: Doesn't really need to be this fatal, but best to have the configs sound.
  }
})();

// Get the Firebase configuration.
//
// Note: We have the data in 'ops-config.js' but here we should have access to the real source (Firebase hosting)
//    so let's prefer it (for marginally faster loading, or hosting on something else than Firebase, use the other
//    implementation).
//
const firebaseConfigProm = (async _ => {
  // Note: Browsers don't dynamically 'import' a JSON (Chrome 85)
  //const json = await import('/__/firebase/init.json');    // NOPE

  const json = await fetch('/__/firebase/init.json').then(resp => {
    if (!resp.ok) {
      console.fatal("Unable to read Firebase config:", resp);
      throw new Error("Unable to read Firebase config (see console)");
    } else {
      return resp.json();   // Promise of ... ('.then' takes care of it)
    }
  });
  return json;
})();

/*SAMPLE
// Same, for using the cached values
(async _ => {
  const json = await import('./ops-config.js').then( mod => mod.firebase );
  return json;
})();
*/

async function initFirebase() {
  const { apiKey, appId, projectId, authDomain } = await firebaseConfigProm;

  firebase.initializeApp({
    apiKey,
    appId,      // needed for Firebase Performance Monitoring
    projectId,
    authDomain
  });

  if (enableFirebasePerf) {
    // tbd. Q: #Firebase Does it matter if this is before or after 'initializeApp'?
    await import('@firebase/performance');
    /*const perf =*/ firebase.performance();    // enables the basics. To use e.g. custom traces, more wiring is needed.
  }
}

async function initCentral() {
  // Our trying to load 'Airbrake' failed. Getting these from 'index.html'.
  // Real solution is to have the library fixed, so it can be _statically_ imported, in 'central.js'.
  //
  assert(window.airbrake);
  window.Notifier = airbrake.Notifier;

  const { central } = await import('./central.js');
  return central;
}

(async () => {
  const t0 = performance.now();

  // Ensure that 'app.js' has Firebase, 'central' and 'centralError' installed.
  //
  await Promise.all([
    initFirebase(),
    initCentral(),
    import('./centralError.js').then( mod => mod.centralError )
  ]);
    //
    // tbd. ^-- Check one day, whether loading them sequentially is as fast as this (can be, since chunks are loaded at launch).

  const dt = performance.now() - t0;
  console.debug(`Initializing ops stuff (in parallel) took: ${dt}ms`);

  debugger;
  console.info("Loading the app.");

  assert(window.firebase);
  /* tbd. enable this
  console.debug("Launching app...");

  const mod = await import('./app.js'); const { init } = mod;
  await init();

  console.debug("App on its own :)");
  */

  /*free running*/ import('./app.js');
})();

export { };
