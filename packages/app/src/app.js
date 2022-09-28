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
*   - Set up authentication UI
*   - Create the app, and its router
*/
import { createApp } from 'vue'

import { getAuth } from '@firebase/auth'
const auth = getAuth();

import { init as initAside } from 'aside-keys'

import { appTitle } from './config.js'
import { router } from './router.js'

/** disabled, for now
// Ops monitoring
import { init as Sentry_init, setUser as Sentry_setUser } from '@sentry/browser'
import { BrowserTracing } from "@sentry/tracing"    // after 'import * as Sentry'

import Plausible from 'plausible-tracker'
**/

import App from '/@App/index.vue'

import './common.css'

import { startupTrace } from "/@/traces"

document.title = appTitle;

const LOCAL = import.meta.env.MODE === 'dev_local';
const DEV = import.meta.env.MODE !== 'production';

const SENTRY_DSN= import.meta.env.VITE_SENTRY_DSN;   // undefined | string
const SENTRY_SAMPLE_RATE= import.meta.env.VITE_SENTRY_SAMPLE_RATE;   // undefined (dev) | 0.0..1.0 (CI production builds)

const STAGE = import.meta.env.VITE_STAGE;   // undefined (dev) | "staging"|... (production build)
const RELEASE = import.meta.env.VITE_RELEASE;    // undefined (dev) | "<git commit checksum>" (CI build) | "0" (local production build)

const PLAUSIBLE_DEV_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DEV_DOMAIN;   // Place this in '.env' to enable Plausible Analytics collection on 'dev:online'.
const PLAUSIBLE_ENABLED = import.meta.env.VITE_PLAUSIBLE_ENABLED;

/*if (!DEV && !PLAUSIBLE_ENABLED) {   // tbd. such warning in build script (console) would be a better place.
  console.info("Plausible Analytics not enabled; add 'PLAUSIBLE_ENABLED=true|false' to mitigate this warning.")
}*/

async function init() {    // () => Promise of ()

  // Initialize Plausible Analytics
  //
  /*** disabled
  if (!LOCAL) {
    let pl;

    if (DEV && PLAUSIBLE_DEV_DOMAIN) {    // dev:online
      pl = Plausible({
        domain: PLAUSIBLE_DEV_DOMAIN,   // e.g. "dev-online.{your-id}"
        trackLocalhost: true
      });

      console.info("Tracking access to Plausible Analytics:", PLAUSIBLE_DEV_DOMAIN);

    } else if (!DEV && PLAUSIBLE_ENABLED) {  // production stages
      pl = Plausible({
        // default domain ('location.hostname')
      });
    }

    if (pl) {
      const {
        trackEvent,             // "Tracks a custom event. Use it to track your defined goals by providing the goal's name as eventName."
        //trackPageview,
        enableAutoPageviews,            // "Tracks the current page and all further pages automatically."
        //enableAutoOutboundTracking    // "Tracks all outbound link clicks automatically"
      } = pl;

      enableAutoPageviews();

      // 'trackEvent' calling prototype is pretty complex, but in practice boils down to just providing a name that's
      // registered as a Goal in the Plausible dashboard. One cannot post arbitrary extra data (which makes sense,
      // since Plausible is about aggregation, not logging..).
      //
      //  <<
      //    trackEvent( evName: string, EventOptions?, PlausibleOptions? )
      //  <<
      //
      window.plausible = { trackEvent };    // for 'events.js'
    }
  }
  ***/

  // Initialize Firebase Performance monitoring

  const tr = startupTrace();

  // Initialize Sentry

  /*** disabled, for now
  if (SENTRY_DSN) {
    Sentry_init({
      dsn: SENTRY_DSN,
      integrations: [new BrowserTracing(/_*{
        tracingOrigins: [ "localhost" /_*, "your.site.com*_/, /^\// ]     // default: ["localhost", /^\//]
      }*_/)],

      tracesSampleRate: LOCAL ? 1.0
        : DEV ? 1.0   // tbd. tune 'dev:online' sampling rate
        : 0.8,        // tbd. tune production sampling rate (from config)

      maxBreadCrumbs: 50,	  // default: 100
      debug: DEV,

      release: RELEASE,

      sampleRate: SENTRY_SAMPLE_RATE ?? 1.0,    // Sampling for non-traces (1.0 = default)

      environment: STAGE || import.meta.env.MODE   // "staging" | ... | "dev-local" | "dev-online"
    });

    // tbd. Is there a way to know (from Sentry), whether initialization succeeded (i.e. did it gain a connection to
    //    its backend)?   i.e. don't say "initialized" if the DSN was rejected.

    watchUid( uid => {
      Sentry_setUser(uid);
    });

    console.debug("Sentry initialized");

  } else if (DEV) {
    console.debug("Sentry not configured; build with 'SENTRY_DSN' env.var. defined to use it.");
  }
  ***/

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

  const aside_t0 = performance.now();

  /*await*/ initAside(auth).then( _ => {    // tbd. do we need 'await' or can we do it in parallel?
    //tr.lap('aside-keys initialization');    // 499..530ms

    tr.set("aside-keys initialization", performance.now()-aside_t0 );

  }); /** disabled: .catch(err => {
    console.error("'Aside-keys' did not initialize:", err);   // never seen
    throw err;
  });*/

  // Initialize Vue App
  //
  const vue_t0 = performance.now();
  const app = createApp(App);

  tr.set("Vue.js initialization", performance.now()-vue_t0);

  const router_t0 = performance.now();
  app.use(router);    // needed for any use of the 'router'

  // Let's be curious and see whether there are ever errors from here:
  /*await*/ router.isReady().then( _ => {
    tr.set("Router initialization", performance.now()-router_t0);

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

  tr.end();

  //central.info("App is mounted.");
}

/*await*/ init();   // free-running tail

export {
  //initializedProm,
  LOCAL
}

// DID NOT WORK with @exp API ("missing or ... permissions").
//
// tbd. Study if there's a server-side trigger for a user authenticated; move the code there.
//
//import '/@background/updateUserInfo';
