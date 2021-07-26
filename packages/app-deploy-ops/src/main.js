/*
* src/main.js
*
* Entry point for production build.
*/
//import { assert } from './assert.js'

import { initializeApp } from '@firebase/app'

import './catch'

import { default as config } from '/@env'

const t0 = performance.now();   // start ⏱

// Others can use 'getApp()' to get a handle
//
// Note: 'locationId' is not needed (or recognized!) by Firebase itself, but is anyways passed to 'httpsCallables'
//      (eg. adapters), via 'getApp()'.
//
initializeApp(config);

// tbd. Find a way to differentiate between:
//    - running in a developer's machine ('npm run serve')
//    - production
//
//let stage = "???";

/*await*/ (async _ => {
  console.debug("Firebase ready (launching app):", performance.now() - t0);

  await import('@local/app').then( mod => mod.initializedProm );

  console.debug("App on its own :)", performance.now() - t0);   // 101

  // Import 'ops/central' now that Firebase is initialized, and the app is on its way.
  //
  // Note: This matters for:
  //    - allowing 'crash.js' to see 'fatal' early on (...unnecessary comment removed..)
  //    - seeing possible loading problems at launch, even if the app wouldn't use 'central' logging
  //
  const { central } = await import('./ops-implement/central');
  console.debug("Central initialized:", performance.now() - t0);    // 157

  window.central = central;   // TEMP; for use from console

})();   // free-running tail
