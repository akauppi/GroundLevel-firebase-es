/*
* src/firebase/perf.js
*
* Interface to Firebase Performance Monitoring
*
* We do a DIFFERENT kind of abstraction than the Firebase API, but are fully utilizing it, nonetheless. See docs for
* the concept of "track".
*
* Note: To be used only via '/meas.js'!!
*/
import { getApp } from '@firebase/app'
import { initializePerformance, trace } from '@firebase/performance'
  //
  // Note: in LOCAL mode, the above module is hijacked. Firebase Performance Monitoring did not like emulation. (SDK 0.900.19; CLI 9.5.0)

const dataCollectionEnabled = true;     // "..collect custom events"
const instrumentationEnabled = true;    // "logging of automatic traces and HTTP/S network monitoring."

const perf = initializePerformance( getApp(), {
  dataCollectionEnabled,
  instrumentationEnabled
} );

const namesTaken = new Set();

// Helper for seeing some performance scores right at the browser console.
//
function debugLap(id,dt) {
  const show = (id === 'aside-keys initialization');

  if (show) {
    console.debug(`Lap '${id}': ${ dt.toFixed(2) }ms`);
  }
}

/*
* Track.
*
* Measuring time it takes for a certain code execution trail to be covered.
*   {
*     start() {
*       lap
*       setAttribute
*       end
*     }
*   }
*
* 'lap' and 'setAttribute' are optional to be called; 'end' is expected always be called.
*/
function track(name) {    // (string) => { start }

  if (namesTaken.has(name)) {
    throw new Error(`Track already created: ${name}`);
  }
  namesTaken.add(name);

  const pt = trace(perf,name);

  let collectedAttrs;   // undefined | {...}

  function start() {  // () => { lap, setAttribute, end }
    const t0 = performance.now();   // "epoch in ms" (what 'PerformanceTrace.record()' expects)

    let lapinfo = [0, t0];   // [ongoing-lap-count, time-at-start-of-lap-ms]

    // Mark laps with '.0', '.1', ... ; mark the lap name as meta information (if given).
    //
    // - keeps the API simple and doesn't take this too seriously
    // - expects all laps always to be taken (like in real track races)
    //
    function lap(lapId) {   // (string?) => ()
      const t = performance.now();
      const [lap,tStart] = lapinfo;
      const lapTime = t - tStart;
      lapinfo = [lap+1, t];

      debugLap(lapId,lapTime);

      const pt2 = trace(perf,`${name}.${lap}`);
      pt2.record(tStart, lapTime, lapId && {
        attributes: {
          lapId
        }
      });
    }

    function setAttribute(k,v) {    // (string, any) => ()
      collectedAttrs = collectedAttrs || {};
      collectedAttrs[k] = v;
    }

    function end() {
      const dt = performance.now() - t0;
      pt.record(t0,dt, collectedAttrs ? { attributes: collectedAttrs } : undefined );   // over to Firebase
    }

    return { lap, setAttribute, end };
  }

  return {
    start
  };
}

/*--- Counter ---*/

// One counter, just used for collecting metrics.
//
// Note: "Each custom code trace can record up to 32 metrics (including the default 'Duration' metric)". This leaves
//    us with 31 counters. (tbd. is that enough? document the limitation, at least)
//
const ptCounters = trace(perf,"_counters");

/*
* Counter
*
* Using the same Firebase Performance Monitoring 'trace' underneath; just not collecting any timings
*/
function counter(name) {    // (string) => { start }

  function inc(dv) {  // (int?) => ()
    ptCounters.incrementMetric(name, dv);
  }

  return {
    inc
  };
}

export {
  track,
  counter
}
