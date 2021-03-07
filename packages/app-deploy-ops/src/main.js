/*
* src/main.js
*
* Entry point for production build.
*/
import { assert } from './assert.js'

import { initializeApp } from '@local/app'    // leak; allows us to set up the Firebase the app has

import { central } from './central'
import './catch'

// tbd. to be placed in a config
const enableFirebasePerf = true;

// Access values from Firebase hosting (we don't use its 'init.js').
//
// Note: Once browsers can 'import' JSON natively, we can make this a one-liner (if Firebase hosting served an ES module, we could use it).
//
const firebaseProm = fetch('/__/firebase/init.json').then( resp => {
  if (!resp.ok) {
    throw new Error(`Unable to fetch '/__/firebase/init.json':\n${{status: resp.status, message: resp.body}}`);
  } else {
    return resp.json();
  }
});

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

/*** disabled
async function initFirebase() {   // Promise of FirebaseApp

  /_*** #rework
  if (enableFirebasePerf) {
    console.info("Taking Firebase Performance client to use.");    // DEBUG

    // tbd. Q: #Firebase Does it matter if this is before or after 'initializeApp'?
    //
    // Note: If we import dynamically, the chunk name becomes 'index.esm.js'
    //await import('@firebase/performance');
    firebase.performance();    // enables the basics. To use e.g. custom traces, more wiring is needed.
  }***_/
}**/

(async () => {    // free-running tail
  window.central = central;

  await firebaseProm.then( ({ apiKey, appId, projectId, authDomain }) => {
    const opts = {
      apiKey,
      appId,    // needed for Firebase Performance Monitoring
      projectId,
      authDomain
    };

    const myApp = initializeApp(opts);

    // If Firebase Performance Monitoring is wanted, enable it
    //
    if (enableFirebasePerf) {
      const getPerformance = import("@local/app").then( mod => mod.getPerformance );
      const perf = getPerformance(myApp);

      console.debug("!!! Performance monitoring initialialized:", { perf });    // DEBUG
    }
  });

  console.debug("Launching app...");

  // Loading app dynamically ensures that 'central' etc. are set up before the app body (and bodies of its dependent modules!) are run.
  //
  const { init } = await import('@local/app');    // entry point
  await init();

  console.debug("App on its own :)");
})();

export { };
