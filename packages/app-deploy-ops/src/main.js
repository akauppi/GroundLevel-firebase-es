/*
* src/main.js
*
* Entry point for production build.
*/
import { assert } from './assert.js'

import { initializeApp } from '@firebase/app'
import { firebaseProm } from './firebaseConfig'

const t0 = performance.now();   // start ⏱

import { init as centralInit } from '@ops/central'

// Catch may use '@ops/central' but it observes 'central.isReady'. Application code doesn't need to do that.
//
// It's important we get the error catching up early. Another way would be to chain this to 'central' initialization.
//
import './catch'

// tbd. Find a way to differentiate between:
//    - running in a developer's maching ('npm run serve')
//    - production
//
//let stage = "???";

// Prepare all of Firebase, including performance monitoring (if enabled)
//
const fbInitializedProm = firebaseProm.then( (o) => {
  const opts = { apiKey: o.apiKey, appId: o.appId, projectId: o.projectId, authDomain: o.authDomain };

  initializeApp(opts);
});

Promise.all([
  fbInitializedProm.then( _ => { console.debug("Firebase ready:", performance.now() - t0); } ),
  centralInit().then( _ => { console.debug("Central ready:", performance.now() - t0); } )
]).then( async _ => {
  console.debug("Launching app...");

  const { init } = await import('@local/app');    // entry point

  // Launch the app
  //
  await init();
  console.debug("App on its own :)", performance.now() - t0);
});   // free-running tail

export {};
