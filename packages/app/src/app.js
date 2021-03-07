/*
* src/app.js
*
* Application entry point.
*
* When we get here (ie. when this module is imported):
*   - ops handling (error gathering, central logging) is initialized
*   - Firebase is initialized (using emulation in local mode)
*/
import { createApp } from 'vue'

import { auth } from '/@firebase'
import { init as initAside } from 'aside-keys'
  // Only needed in 'online' mode but import always (optimize for production)

import { appTitle } from './config.js'
import { router } from './router.js'

import App from '/@App/index.vue'

import './common.css'
import { assert } from '/@tools/assert'

document.title = appTitle;

const LOCAL = import.meta.env.MODE === 'dev_local';

// Build values:
//
// - 'VERSION' gives the version
//
const VERSION = _VERSION;    // both dev and production

async function init() {    // () => Promise of ()
  const t0 = performance.now();

  // Production: Initialize the authentication system
  if (!LOCAL) {
    initAside(auth).then( _ => {
      console.log(`Authentication initialized (took ${(performance.now()-t0).toFixed(0)}ms)`);    // #later: candidate for ops analytics
    });
  }

  // Initialize Vue App
  //
  const app = createApp(App);

  app.use(router);    // needed for any use of the 'router'

  // Let's be curious and see whether there are ever errors from here:
  router.isReady().catch( err => {
    console.error("Router did not initialize:", err);
    throw err;
  });

  /*** HOLD
  // Vue-router note:
  //    It may be that we need to wait for router to be ready. Check here -> https://next.router.vuejs.org/guide/migration/#all-navigations-are-now-always-asynchronous
  //
  // tbd. "block the app render" until authentication has been done.
  //
  await router.isReady().then( _ => {
    console.debug("Router is ready");   // note: it DOES NOT get ready!!
  } );
  ***/

  app.mount('#app');
  central.info("App is mounted.");
}

export {
  init,
  LOCAL,
  VERSION
}

// Leak certain things to the ops level (without this, they would be tree-shaken).
//
import { initializeApp } from 'firebase/app'
import { getPerformance } from 'firebase/performance'

export {
  initializeApp,
  getPerformance
}

// DID NOT WORK with @exp API ("missing or ... permissions").
//
// tbd. Study if there's a server-side trigger for a user authenticated; move the code there.
//
//import '/@background/updateUserInfo';
