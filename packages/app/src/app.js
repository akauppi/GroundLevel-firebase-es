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

import { getAuth } from '@firebase/auth'
const auth = getAuth();

import { init as initAside } from 'aside-keys'
  // Only needed in 'online' mode but import always (optimize for production)

import { appTitle } from './config.js'
import { router } from './router.js'

import { central } from '@ops/central'

import { appInitTrack, someCounter } from './meas'

import App from '/@App/index.vue'

import './common.css'
//import { assert } from '/@tools/assert'

document.title = appTitle;

const LOCAL = import.meta.env.MODE === 'dev_local';
const TESTING = LOCAL && (!! window.Cypress);

// Build values:
//
// - 'VERSION' gives the version
//
const VERSION = _VERSION;    // both dev and production

async function init() {    // () => Promise of ()
  const tr = appInitTrack.start();

  // Load the web component for 'aside-keys' tag.
  //
  if (!LOCAL || TESTING) {
    // tbd. We'll likely need to change the way 'initAside' works so that *it* can initialize Firebase auth with
    //    the requested persistence (or can we change the persistence once initialized?). #rework

    /*await*/ initAside(auth).then( _ => {    // tbd. do we need 'await' or can we do it in parallel?
      tr.lap('aside-keys initialization');    // 499..530ms
    });
  }

  // Initialize Vue App
  //
  const app = createApp(App);

  tr.lap('Vue initialization');

  app.use(router);    // needed for any use of the 'router'

  // Let's be curious and see whether there are ever errors from here:
  /*await*/ router.isReady().then( _ => {
    tr.lap('Router initialization');
  }).catch( err => {
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

  // Sample of adding a meta data to the measurement
  tr.setAttribute('appId', app.id);   // #bogus
  tr.end();

  someCounter.inc();  // just for show

  central.info("App is mounted.");
}

export {
  init,
  LOCAL,
  VERSION
}

// DID NOT WORK with @exp API ("missing or ... permissions").
//
// tbd. Study if there's a server-side trigger for a user authenticated; move the code there.
//
//import '/@background/updateUserInfo';
