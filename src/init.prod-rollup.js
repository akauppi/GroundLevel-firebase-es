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
//import * as firebase from 'firebase/app'    // still fails with firebase 7.19.1
import firebase from 'firebase/app'     // works (but does not allow firebaseui from npm :( )
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import "firebase/performance"

import { ops } from './config.js'
import { Fatal } from './fatal.js'

let enableFirebasePerf = false;
if (ops.perf.type == 'firebase') { enableFirebasePerf = true; }
else if (ops.perf.type) {
  throw Fatal(`Unexpected config 'ops.perf.type' (ignored): ${ops.perf.type}`);
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
    throw Fatal(`Assertion failed: ${msgOpt || '(no message)'}`);
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
    /*const perf =*/ firebase.performance();    // enables the basics. To use e.g. custom traces, more wiring is needed. tbd.
  }
}

(async () => {
  // Ensure that 'app.js' has both Firebase and 'central' installed.
  //
  await Promise.all([initFirebase(), import('./central.js')]);
    //
    // tbd. ^-- Check one day, whether loading them sequentially is as fast as this (can be, since all is loaded at launch).

  import('./app.js');   // free-running tail
})();

export { };
