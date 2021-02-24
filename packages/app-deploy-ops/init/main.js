/*
* init/main.js
*
* Entry point for Vite (production build).
*/
import { assert } from './assert.js'

import firebase from 'firebase/app'
import '@firebase/auth'
import '@firebase/firestore'
import '@firebase/functions'
//import '@firebase/performance'    // Importing as static, though use is optional. Otherwise the chunk name becomes 'index.esm', for some reason
                                  //    ^-- tbd. comment may be old; check by importing dynamically

// Note: We can eventually make 'firestore' and 'functions' lazy-loading (i.e. start loading already here,
//      but don't make 'app.js' wait for them).

// Access values, from Firebase hosting (we don't use its 'init.js').
//
// Note: Once browsers can 'import' JSON natively, we can make this a one-liner. (Also, if Firebase served an ES module, we could use it).
//
const firebaseProm = fetch('/__/firebase/init.json').then( resp => {
  if (!resp.ok) {
    throw new Error(`Unable to fetch '/__/firebase/init.json':\n${{status: resp.status, message: resp.body}}`);
  } else {
    return resp.json();
  }
});

assert(firebase.initializeApp);
assert(firebase.auth);    // check if there are loading problems

/* #rework
//import {perfs as opsPerfs} from './opsConfig.js'

let enableFirebasePerf;

// tbd. move Firebase perf monitoring to an external file (like others, like 'central' is for ops).
//    'perf.firebase.js'
//
for( const o of opsPerfs ) {
  if (o.type === 'firebase') {
    enableFirebasePerf = true;
  } else {
    throw new Error(`Unexpected 'perf.type' ops config: ${o.type}`);
      // note: Doesn't really need to be fatal, but best to have the configs sound.
  }
}
*/

async function initFirebase() {
  const { apiKey, appId, projectId, authDomain } = await firebaseProm;

  firebase.initializeApp({
    apiKey,
    appId,      // needed for Firebase Performance Monitoring
    projectId,
    authDomain
  });

  console.debug("!!! Firebase initialized", { apiKey, authDomain });

  /*** #rework
  if (enableFirebasePerf) {
    console.info("Taking Firebase Performance client to use.");    // DEBUG

    // tbd. Q: #Firebase Does it matter if this is before or after 'initializeApp'?
    //
    // Note: If we import dynamically, the chunk name becomes 'index.esm.js'
    //await import('@firebase/performance');
    firebase.performance();    // enables the basics. To use e.g. custom traces, more wiring is needed.
  }***/
}

(async () => {
  const t0 = performance.now();

  // Ensure that 'app.js' has Firebase, 'central' and error catching.
  //
  const [__, central, ___] = await Promise.all([
    initFirebase(),
    import('./central.js').then( mod => mod.central ),
    import('./catch.js')   // initializes as a side effect
  ]);
    //
    // tbd. ^-- Check one day, whether loading them sequentially is as fast as this (can be, since chunks are loaded at launch).

  const dt = performance.now() - t0;
  console.debug(`Initializing ops stuff (in parallel) took: ${dt}ms`);    // 25ms

  window.central = central;

  console.debug("Launching app...");

  const { init } = await import('@local/app');    // entry point
  await init();

  console.debug("App on its own :)");
})();

export { };
