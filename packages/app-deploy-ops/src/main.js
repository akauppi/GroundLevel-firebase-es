/*
* src/main.js
*
* Entry point for production build.
*/
import { initializeApp } from '@firebase/app'

import { default as config } from '/@env'

// Initialize crash reporting and performance monitoring, before loading the payload.
// NOTE: This means they need to init *fast* (spawn longer-taking initialization).
//
import '@ops/crash'
import '@ops/perf'

import './catch-ui-move-me-away'

const t0 = performance.now();   // start ⏱

// Others can use 'getApp()' to get a handle
//
// Note: 'locationId' is not needed (or recognized!) by Firebase itself, but is anyways passed to 'httpsCallables'
//      (eg. adapters), via 'getApp()'.
//
initializeApp(config);

console.debug("Firebase ready (launching app):", Math.round(performance.now() - t0) );    // X ms (tbd. ops APM??)

/*await*/ (async _ => {
  await import('@local/app');

  console.debug("App on its own :)", Math.round(performance.now() - t0) );   // 101

  // Report the user to interested adapters
  //


})();   // free-running tail


import { onAuthStateChanged, getAuth } from '@firebase/auth'
const auth = getAuth();
