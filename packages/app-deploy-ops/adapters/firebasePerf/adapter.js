/*
* adapters/firebasePerf/adapter.js
*
* Context:
*   Firebase is available when the adapter is loaded.
*/
import { getApp } from '@firebase/app'

import { initializePerformance, trace } from '@firebase/performance'

function assert(cond,msg) {
  if (!cond) { throw new Error(msg || "(assert failed)"); }
}

// Let's define all parameters since what 'getPerformance' (the easier way) provides *is not documented* (we're Google,
// we know what's best for you).
//
//  - Firebase API Reference > Performance (v9)
//    -> https://firebase.google.com/docs/reference/js/v9/performance
//
const h = initializePerformance( getApp(), {
  dataCollectionEnabled: true,      // collect "custom events" (tbd. what are they; describe)
  instrumentationEnabled: true      // collect "out of the box events" (tbd. what are they; describe)
});

// Use one 'PeformanceTrace' for all counters
//
const countersTrace = trace(h, '$counters');

const trackTraces = new Map();    // Map of PerformanceTrace

/*
* Store (send to Firebase back-end) an already instrumented section of code.
*
* stamps[0]:    Start of the measurement
* stamps[mid]:  "lap times" (optional)
* stamps[last]: End of the measurement
*
* Note: This approach does not measure things that did not reach the finish line.
*/
function reportTrack(name, stamps) {    // (string, Array of integer /*ms of epoch*/) => ()
  const tr = mapUpsert(trackTraces, name, () => trace(h,name));

  assert(stamps.length >= 2);
  const start = stamps[0];
  const duration = stamps[stamps.length-1];
  const laps = stamps.slice(1,-1).map( x => x-start );

  const metrics = Object.fromEntries( laps.map( (v,i) => [`lap${i}`, v] ));

  tr.record(start, duration, {
    metrics
  });
}

/*
* Create a counter towards Firebase Performance Monitoring.
*/
// tbd. Do these values accumulate globally, when used eg. for counting sign-ins?
//
function counterInc(name, num) {    // (string, num) => ()

  countersTrace.incrementMetric(name, num)
}

/*
* Helper function
*
* It seems '.upsert' /.emplace/ would be on its way to JS 'Map' (stage 2, Apr 2021). [1] Until then.
*
* [1]: https://dev.to/laurieontech/javascript-map-is-getting-upsert-314b
*/
function mapUpsert(m, k, f) {
  if (!m.has(k)) {
    m.set(k, f())
  }
  return m.get(k);
}

export {
  reportTrack,
  counterInc
}
