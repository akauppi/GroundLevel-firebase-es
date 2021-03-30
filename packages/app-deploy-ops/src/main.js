/*
* src/main.js
*
* Entry point for production build.
*/
import { assert } from './assert.js'

import { initializeApp } from '@firebase/app'

import './catch'

// tbd. Find a way to differentiate between:
//    - running in a developer's maching ('npm run serve')
//    - production
//
//let stage = "???";

// Access values from Firebase hosting (we don't use its 'init.js').
//
// Note: Once browsers can 'import' JSON natively, we can make this a one-liner (if Firebase hosting served an ES module, we could use it).
//
const firebaseProm = fetch('/__/firebase/init.json').then( resp => {
  if (!resp.ok) {
    throw new Error(`Unable to fetch '/__/firebase/init.json' (${ resp.status }): ${ resp.body }`);
  } else {
    return resp.json();   // returns a 'Promise' but above '.then' merges them
  }
});

// Prepare all of Firebase, including performance monitoring (if enabled)
//
async function initFirebase() {
  const opts = await firebaseProm.then( (o) => {

    // tbd. If we need 'locationId' it needs to be baked in at the build.
    //
    // Has '.locationId' (e.g. "europe-west6") but only under emulation; not when deployed to the cloud.
    //disabled locationId = o.locationId;

    assert(o.projectId, "No '.projectId' in Firebase '/__/firebase/init.json'");
    projectId = o.projectId;

    return { apiKey: o.apiKey, appId: o.appId, projectId: o.projectId, authDomain: o.authDomain };
  });

  initializeApp(opts);
}

// Note: We could use "top level await" (not in node.js 15).
//
(async () => {    // free-running tail
  console.debug("Initializing Firebase and ops...");

  await Promise.all([
    initFirebase()
  ]);

  console.debug("Launching app...");

  const { init } = await import('@local/app');    // entry point
  await init();

  console.debug("App on its own :)");
})();

let locationId;
let projectId;

export {
  locationId,   // currently NOT set (needed for httpsCallable use; we might not even need it; depends on logging)
  projectId
};
