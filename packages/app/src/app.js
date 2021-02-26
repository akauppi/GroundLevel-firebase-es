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

import { init as initAside } from 'aside-keys'

import { appTitle } from './config.js'

import App from './App.vue'
import { router } from './router.js'    // initializes the router; important we have it!

import './common.css'
import { assert } from './assert'

document.title = appTitle;

const app = createApp(App);

const LOCAL = import.meta.env.MODE === 'dev_local';

async function init() {    // () => Promise of ()
  const t0 = performance.now();

  // Initialize the authentication system
  //
  if (!LOCAL) {
    const auth = import('/@/firebase').then( mod => mod.auth );

    initAside(auth).then( _ => {
      const dt = performance.now() - t0;
      console.log(`Authentication initialized (took ${dt.toFixed(0)}ms)`);    // #later: candidate for ops analytics
    });
  }

  // Initialize Vue Router
  //
  // Note:
  //  This is needed for any use of the router; not just for 'this.$route[r]'.
  //
  app.use(router);

  // Let's be curious and see whether there are ever errors from here:
  router.isReady().catch( err => {
    console.error("Router did not initialize:", err);
    throw err;
  });

  // Vue-router note:
  //    It may be that we need to wait for router to be ready. Check here -> https://next.router.vuejs.org/guide/migration/#all-navigations-are-now-always-asynchronous
  //
  // tbd. "block the app render" until authentication has been done.
  //
  //await router.isReady().then( _ => ... )

  app.mount('#app');
  central.info("App is mounted.");
}

export { init }
