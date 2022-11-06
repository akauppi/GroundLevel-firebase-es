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

function fail(msg) { throw new Error(msg) }

/** disabled, for now
// Ops monitoring
import { init as Sentry_init, setUser as Sentry_setUser } from '@sentry/browser'
import { BrowserTracing } from "@sentry/tracing"    // after 'import * as Sentry'

import Plausible from 'plausible-tracker'
**/

import App from '/@App/index.vue'

import './common.css'

import { initPerfStart, initAsidePerfStart, initRouterPerfStart } from "/@central/perfs"

document.title = appTitle;

const LOCAL = import.meta.env.MODE === 'dev_local';
const DEV = import.meta.env.MODE !== 'production';

const STAGE = import.meta.env.VITE_STAGE;
  // undefined      dev
  // "dev.<stage>"  dev:online
  // "<stage>"      production

const RELEASE = import.meta.env.VITE_RELEASE;
  // undefined                dev; manual build
  // "0"                      manual production build (no track to sources)
  // "<git commit checksum>"  automated build

//const PLAUSIBLE_DEV_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DEV_DOMAIN;   // Place this in '.env' to enable Plausible Analytics collection on 'dev:online'.
//const PLAUSIBLE_ENABLED = import.meta.env.VITE_PLAUSIBLE_ENABLED;

/*if (!DEV && !PLAUSIBLE_ENABLED) {   // tbd. such warning in build script (console) would be a better place.
  console.info("Plausible Analytics not enabled; add 'PLAUSIBLE_ENABLED=true|false' to mitigate this warning.")
}*/

async function init() {    // () => Promise of ()

  const initPerf = initPerfStart();

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

  /*** disabled; '@firebase/performance' left out from Sep'22
   *
  // Initialize Firebase Performance monitoring
  //
  // Note:
  //    Importing '@firebase/performance' requires the 'appId' to be defined, in initialization. We don't do that for
  //    'dev:local' since there's no benefit (is there?) for using Firebase Performance against the emulators.
  //
  //    If you wish so, add 'appId'. Otherwise, this dynamic initialization should suffice.
  //
  // Reference:
  //    - "Add custom monitoring for specific app code" (Firebase docs)
  //      -> https://firebase.google.com/docs/perf-mon/custom-code-traces?platform=web
  //
  if (!LOCAL) {
    const { getPerformance, trace } = await import("@firebase/performance").then(mod => mod.default);
    const perf = getPerformance();

    perfHook( (s,durationMs) => {
      const t = trace(perf, s);

      const startTime = performance.now() - durationMs;   // #hack, but good enough

      t.record( startTime, durationMs, {
        // metrics: { <key>: <number> }
        // attributes: { <key>: <string> }
      });
    });

    /_*** undone
    // tbd. is there a way to feed also 'incs' and 'obs' to be visible in Firebase Performance dashboard?
    //
    const tIncs = trace(perf, "incs");

    incHook( (s,diff) => {
      tIncs.incrementMetric(s,diff);    // note: Firebase floors numbers given to it
    });
     ***_/

    /_* No way, right???
    const tObs = trace(perf, "obs");
    obsHook( (s,v) => {
      tObs.xxxMetric(s,v);
    }); *_/
  }***/

  initPerf.lap("Firebase Performance initialized");

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

  const aPerf = initAsidePerfStart();

  /*await*/ initAside(auth).then( _ => {    // tbd. do we need 'await' or can we do it in parallel?
    aPerf.end();    // xxx ms
  });

  // Initialize Vue App
  //
  const app = createApp(App);
  initPerf.lap("Vue.js initialization");

  const rPerf = initRouterPerfStart();
  app.use(router);    // needed for any use of the 'router'

  // Let's be curious and see whether there are ever errors from here:
  /*await*/ router.isReady().then( _ => {
    rPerf.end();
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

  initPerf.lap("Vue.js application mounted");

  initPerf.end();
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
