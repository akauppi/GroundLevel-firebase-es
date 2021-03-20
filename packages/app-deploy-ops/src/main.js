/*
* src/main.js
*
* Entry point for production build.
*/
import { assert } from './assert.js'

import { initializeApp } from '@firebase/app'

import './catch'

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
  const opts = await firebaseProm.then( (o) => ({ apiKey: o.apiKey, appId: o.appId, projectId: o.projectId, authDomain: o.authDomain }));

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

export { };
