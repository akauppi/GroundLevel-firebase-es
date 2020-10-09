/*
* init/main.js
*
* Entry point for Rollup (production build).
*/
import { assert } from './assert.js'

// DOES NOT WORK but is according to npm firebase instructions:
//  <<
//    initializeApp is not exported by node_modules/firebase/app/dist/index.esm.js
//  <<
//
//import * as firebase from 'firebase/app'    // still fails with firebase 8.10.0 (7.19.1)
//import firebase from 'firebase/app'     // works (but does not allow firebaseui from npm :( )

import firebase from '@firebase/app'  // this works
//import { firebase } from '@firebase/app/dist/index.esm.js'    // also works (same behaviour as with above)
import '@firebase/auth'
import '@firebase/firestore'
import '@firebase/functions'
import '@firebase/performance'    // Importing as static, though use is optional. Otherwise the chunk name becomes 'index.esm', for some reason

//  ^-- Note: We can eventually make 'firestore' and 'functions' lazy-loading (i.e. start loading already here,
//          but don't make 'app.js' wait for them).

import { firebaseProm } from './__.js'

assert(firebase.initializeApp);
assert(firebase.auth);    // check if there are loading problems

assert(window.firebaseui);    // loaded from 'index.html'

import {perfs as opsPerfs} from './opsConfig.js'

let enableFirebasePerf;

for( const o of opsPerfs ) {
  if (o.type === 'firebase') {
    enableFirebasePerf = true;
  } else {
    throw new Error(`Unexpected 'perf.type' ops config (ignored): ${o.type}`);
      // note: Doesn't really need to be fatal, but best to have the configs sound.
  }
}

async function initFirebase() {
  const { apiKey, appId, projectId, authDomain } = await firebaseProm;

  firebase.initializeApp({
    apiKey,
    appId,      // needed for Firebase Performance Monitoring
    projectId,
    authDomain
  });

  if (enableFirebasePerf) {
    console.info("Taking Firebase Performance client to use.");    // DEBUG

    // tbd. Q: #Firebase Does it matter if this is before or after 'initializeApp'?
    //
    // Note: If we import dynamically, the chunk name becomes 'index.esm.js'
    //await import('@firebase/performance');
    firebase.performance();    // enables the basics. To use e.g. custom traces, more wiring is needed.
  }
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

  // Note: If we let the app code import Firebase again, it doesn't get e.g. 'firebase.auth'.
  //    For this reason - until Firebase can be loaded as-per-docs - provide 'firebase' as a global to it.
  //
  window.firebase = firebase;
  window.assert = assert;
  window.central = central;

  console.debug("Launching app...");

  //CONSTRUCTION
  // For testing the error banner - if actual errors don't trigger it.
  //window.onerror("Something bad just happened! #test", "abc", 101, 20, new Error("Something bad just happened!"));    // BUG: DOES _NOT_ CALL 'onerror' handler!!!

  const { init } = await import('@app/app/src/app.js');
  await init();

  console.debug("App on its own :)");
})();

export { };
