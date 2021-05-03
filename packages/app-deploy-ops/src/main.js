/*
* src/main.js
*
* Entry point for production build.
*/
//import { assert } from './assert.js'

import { initializeApp } from '@firebase/app'

import './catch'

import { API_KEY, APP_ID, PROJECT_ID, AUTH_DOMAIN, LOCATION_ID } from '../.env.js'

const opts = {
  apiKey: API_KEY,
  appId: APP_ID,
  projectId: PROJECT_ID,
  authDomain: AUTH_DOMAIN,

  // 'locationId' is not needed by Firebase itself, but is now available to code that uses 'httpsCallables' (eg. adapters),
  // via 'getApp()'.
  locationId: LOCATION_ID
};

const t0 = performance.now();   // start ⏱

// Others can use 'getApp()' to get a handle
//
initializeApp(opts);

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
  //    - allowing 'crash.js' to see 'fatal' early on (but thing are crooked already, if it has messages)
  //    - seeing possible loading problems at launch, even if the app wouldn't use 'central' logging
  //
  await import('./ops/central');
  console.debug("Central initialized:", performance.now() - t0);    // 157

})();   // free-running tail
