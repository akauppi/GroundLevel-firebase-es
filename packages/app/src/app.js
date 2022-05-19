/*
* src/app.js
*
* Application entry point.
*
* Has happened:
*   - Firebase is initialized (using emulation in local mode)
*
* We do:
*   - Set up ops monitoring
*/
import { createApp } from 'vue'

import { getAuth } from '@firebase/auth'
const auth = getAuth();

import { init as initAside } from 'aside-keys'

import { appTitle } from './config.js'
import { router } from './router.js'

// Ops monitoring
import * as Sentry from "@sentry/browser";
import { BrowserTracing } from "@sentry/tracing";   // after 'import * as Sentry'

import App from '/@App/index.vue'

import './common.css'

document.title = appTitle;

const LOCAL = import.meta.env.MODE === 'dev_local';
const DEV = import.meta.env.MODE !== 'production';

// Build values:
//
// - 'VERSION' gives the version
//
const VERSION = "0.0.0";    // both dev and production

const SENTRY_DNS= import.meta.env.VITE_SENTRY_DNS;   // undefined | string

(_ => {    // () => ()
  // Initialize Sentry

  if (SENTRY_DNS) {
    Sentry.init({
      dsn: SENTRY_DNS,
      integrations: [new BrowserTracing(/*{
        tracingOrigins: [ "localhost" /_*, "your.site.com*_/, /^\// ]     // default: ["localhost", /^\//]
      }*/)],

      tracesSampleRate: LOCAL ? 1.0
        : DEV ? 1.0   // tbd. tune 'dev:online' sampling rate
        : 0.8,        // tbd. tune production sampling rate (from config)

      maxBreadCrumbs: 50,	  // default: 100
      debug: DEV,

      //release: "...",   // tbd. from CI

      //sampleRate: 1.0,    // Sampling for non-traces (1.0 = default)

      environment: import.meta.env.MODE   // "production" | "dev-local" | "dev-online"
    });

    // tbd. Is there a way to know (from Sentry), whether initialization succeeded (i.e. did it gain a connection to
    //    its backend)?   i.e. don't say "initialized" if the DNS was rejected.

    console.debug("Sentry initialized");
  } else {
    console.debug("Sentry not configured; launch with 'SENTRY_DNS' to use it.");
  }

  //const tr = appInitTrack.start();

  /*** disabled / not needed?
  // Set an error handler.
  //
  // Note: For some reason, doing this in 'app-deploy-ops' wrapper didn't catch errors within the application.
  //    Never mind - we can get them here and pass on.
  //
  window.onerror = function (msg, source, lineNbr, colNbr, error) {
    console.debug("onerror saw:", {msg, source, lineNbr, colNbr, error});    // DEBUG

    //caught

    throw new Error("tbd.!!! Something should be here!!");
  }
  ***/

  // Load the web component for 'aside-keys' tag.
  //
  // tbd. We'll likely need to change the way 'initAside' works so that *it* can initialize Firebase auth with
  //    the requested persistence (or can we change the persistence once initialized?). #rework

  /*await*/ initAside(auth).then( _ => {    // tbd. do we need 'await' or can we do it in parallel?
    //tr.lap('aside-keys initialization');    // 499..530ms

  }).catch(err => {
    console.error("'Aside-keys' did not initialize:", err);   // never seen
    throw err;
  });

  // Initialize Vue App
  //
  const app = createApp(App);

  //tr.lap('Vue initialization');

  app.use(router);    // needed for any use of the 'router'

  // Let's be curious and see whether there are ever errors from here:
  /*await*/ router.isReady().then( _ => {
    //tr.lap('Router initialization');
  }).catch( err => {
    console.error("Router did not initialize:", err);   // never seen
    throw err;
  });

  // Enable Vue.js 3 Developer Tools (if the user has them installed on the browser).
  //
  // NOTE: This is *not documented* at the time of writing (Apr-21). Based on:
  //    - https://github.com/vuejs/vue-devtools/issues/1308
  //
  window.postMessage({
    devtoolsEnabled: true,
    vueDetected: true
  }, '*')

  app.mount('#app');

  // Sample of adding a meta data to the measurement (not sure if we need that)
  //tr.setAttribute('appId', app.id);

  //tr.end();

  //central.info("App is mounted.");
})();

export {
  //initializedProm,
  LOCAL,
  VERSION
}

// DID NOT WORK with @exp API ("missing or ... permissions").
//
// tbd. Study if there's a server-side trigger for a user authenticated; move the code there.
//
//import '/@background/updateUserInfo';
