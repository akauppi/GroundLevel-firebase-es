/*
* src/init.prod-rollup.js
*
* The entry point for production mode.
*
* See comments in 'src/init.vite.js'.
*/

// DOES NOT WORK but is according to npm firebase instructions:
//  <<
//    initializeApp is not exported by node_modules/firebase/app/dist/index.esm.js
//  <<
//
//import * as firebase from 'firebase/app'    // still fails with firebase 8.10.0 (7.19.1)
//import firebase from 'firebase/app'     // works (but does not allow firebaseui from npm :( )

//import firebase from '@firebase/app'  // this works
import { firebase } from '@firebase/app/dist/index.esm2017.js'    // this also works

import '@firebase/auth'
import '@firebase/firestore'
import '@firebase/functions'

import { ops } from './config.js'

let enableFirebasePerf = false;
if (ops.perf.type == 'firebase') { enableFirebasePerf = true; }
else if (ops.perf.type) {
  throw Error(`Unexpected config 'ops.perf.type' (ignored): ${ops.perf.type}`);
    // note: Doesn't really need to be 'fatal' but best to have the configs sound.
}

/*
* Set up globals
*
* Note: Needs to be set up in a block that does not import our app level code.
*/
function assert(cond, msgOpt) {
  if (!cond) {
    if (msgOpt) {
      console.assert(msgOpt);
    }
    throw Error(`Assertion failed: ${msgOpt || '(no message)'}`);
  }
}

assert(firebase.initializeApp);

// As long as loading Firebase via 'import' is shaky (also with Vite), let's place it as a global.
//
window.firebase = firebase;
window.assert = assert;

async function initFirebase() {
  // Browsers don't dynamically 'import' a JSON (Chrome 85):
  //  <<
  //    The server responded with a non-JavaScript MIME type of "application/json".
  //  <<
  //const json = await import('/__/firebase/init.json');    // NOPE

  const json = await fetch('/__/firebase/init.json').then( resp => {
    if (!resp.ok) {
      console.fatal("Unable to read Firebase config:", resp);
      throw Error("Unable to read Firebase config (see console)");
    } else {
      return resp.json();   // Promise of ...
    }
  });

  const { apiKey, appId, projectId, authDomain } = json;

  firebase.initializeApp({
    apiKey,
    appId: enableFirebasePerf ? appId : undefined,      // needed for Firebase Performance Monitoring
    projectId,
    authDomain
  });

  if (enableFirebasePerf) {
    // tbd. Does it matter if this is before or after 'initializeApp'?
    await import('@firebase/performance');
    /*const perf =*/ firebase.performance();    // enables the basics. To use e.g. custom traces, more wiring is needed. tbd.
  }
}

// ALL of our trying to load 'Toastify' and 'Airbrake' (unrelated) failed. Getting these from 'index.html'.
// Must happen before an 'async' block loading 'central.js'.
// Real solution is to have those libraries fixed, so we can _statically_ import them, in 'central.js'. And #peace will prevail??
//
assert(Toastify);

assert(window.airbrake);
window.Notifier = airbrake.Notifier;
assert(Notifier);

async function initCentral() {
  // Rollup note: It seems to initiate all dynamic 'import's within a scope at the same time. This is not suitable
  //    for us, if we want to pass 'Toastify' and 'Notifier' to 'central.js' as globals.

  // #optimize: Can load Toastify and Airbrake in parallel (but rather have Toastify be statically importable).

  /* EVEN THIS didn't work - loading it in 'index.html'
  // Toastify (1.9.1) doesn't like to be statically 'import'ed by Rollup (2.26.11).
  // Dynamic import seems to work, however.
  //
  window.Toastify = await import('toastify-js');
  await import('toastify-js/src/toastify.css');
  */

  /** ALSO all these fail - load from index.html
  // Airbrake (1.4.1) doesn't like to be 'import'ed by Rollup (2.26.11).
  //
  //const { Notifier } = await import("@airbrake/browser");   // build FAILS: "object null is not iterable"
  const { Notifier } = await import("@airbrake/browser/dist/index.js");   // builds but: "Unresolved dependencies" (-> fails in runtime..)
  //const { Notifier } = await import("@airbrake/browser/esm/index.js");    // build FAILS: "object null is not iterable"
  **/

  await import('./central.js');
}

(async () => {
  // Ensure that 'app.js' has both Firebase and 'central' installed.
  //
  await Promise.all([initFirebase(), initCentral()]);
    //
    // tbd. ^-- Check one day, whether loading them sequentially is as fast as this (can be, since all is loaded at launch).

  debugger;
  console.info("Loading the app.");

  await import('./app.js');
})();

export { };
