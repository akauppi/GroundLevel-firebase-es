/*
* src/traces.js
*
* Traces for performance instrumentation.
*
* Collect performance data on particular code blocks. For 'dev:local', such data is written on the console (at the
* end of a block); for 'dev:online' and deployed front-ends, it reaches the Firebase dashboard.
*
* We wrap the Firebase Performance Monitoring API with our own. This helps in implementing the dev mode, but is mostly
* just to disturb the actual app code as little as possible.
*/

// Note: In 'dev:local' mode, we cannot even import
//
import { getPerformance, trace as fbTrace } from '@firebase/performance'

const LOCAL = import.meta.env.MODE === "dev_local";

//import { assert } from '/@tools/assert.js'
function fail(msg) { throw new Error(msg); }

let fbPerf = (!LOCAL) ? getPerformance() : null;

/*
* Fake of Firebase Performance API (only the features we use), for 'dev:local'.
*
* Gets tree-shaken out in production builds.    #tbd. check it does
*/
const devTrace = LOCAL && (() => {

  return ((name) => {   // (string) => PerformanceTrace-like
    let t0;

    const attributes = new Map();   // Map of string -> any
    const metrics = new Map();      // Map of string -> number

    return {
      start() {   // () => ()
        t0 = performance.now();
      },

      putMetric(s, v) {   // (string, number) => ()
        metrics.set(s,v);
      },

      /*
      * Note: Firebase docs [1] says:
      *     "Each custom code trace can record up to 5 custom attributes."
      *
      *   [1]: https://firebase.google.com/docs/perf-mon/attributes?platform=web#create-custom-attributes
      */
      putAttribute(s,v) {   // (string, string) => ()
        attributes.set(s,v);
      },

      stop() {    // () => ()
        const dt = performance.now() - (t0 || fail(`Trace '${name}': '.stop' called without '.start'`));

        console.debug(`Trace '${name}'`, {
          duration: `${dt}ms`,

          ...(metrics.size > 0 ? {
            metrics: Object.fromEntries(metrics)
          } : {}),
          ...(attributes.size > 0 ? {
            attributes: Object.fromEntries(attributes)
          } : {})
        });
      }
    }
  });
})();

function createTr(name) {   // string => () => { end: () => (), ... }

  const tr = (!LOCAL) ? fbTrace(fbPerf, name) : devTrace(name);

  return () => {
    tr.start();

    return {
      end() {
        tr.stop()
      },

      /*
      * Set a numeric (counter) value.
      *
      * Can be used for storing sub-timings (in ms).
      */
      set(title, v) {   // (string, number) => ()
        tr.putMetric(title, v);
      },

      setAttribute(k,v) {   // (string, string) => ()
        tr.putAttribute(k,v);
      }
    }
  }
}

const startupTrace = createTr("startup");

export {
  startupTrace
}
