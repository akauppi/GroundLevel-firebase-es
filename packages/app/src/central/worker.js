/*
* src/central/worker.js
*
* Collects metrics and log entries, and occasionally passes them to 'callables.js', for delivery.
*/
import { metricsAndLogsWorker as myC } from '/@/config.js';
const { maxBatchDelayMs, maxBatchEntries } = myC;

function fail(msg) { throw new Error(msg); }

import { metricsAndLoggingProxy_v0_withGen } from './callables.js'

const pending= [];    // Array of { "":"inc"|"log", ... }

let timer;    // undefined:   nothing's going to happen ('pending' should be empty)
              // Timer:       shipment is scheduled; some stuff should be in 'pending'

let shipF;    // ({ arr: Array of { "":"inc"|"log", ... }}) => Promise of any    // actual shipping to callables

// Initialization with query parameter
//
self.location.search.slice(1).split("&").forEach( kvs => {    // "{key}={value}"
  const [k,v] = kvs.split("=");

  console.log("Worker param:", {k,v});
  if (k === "token") {
    shipF = metricsAndLoggingProxy_v0_withGen(v);
  }
    //
  else fail(`Unexpected param: ${k}`);
});

/*
* Ship things
*
* Makes a copy of 'pending' entries (if any), clears 'pending', ships the copy in the background (free-running tail).
*/
async function ship() {    // () => ()
  if (pending.length === 0) return;

  const arr= [...pending];    // JavaScript note: copies the array
  pending.length = 0;

  console.debug(`Shipping ${arr.length} ...`);

  const t0 = Date.now();

  shipF({ arr }).then( _ => {   // free-running
    console.debug(`Shipping took: ${ Date.now() - t0 }ms`);
    // tbd. collect this into the metrics (not right away; put aside and when there's something else to ship, pass it along)
  })
}

//--- Functions that feed the queue 🥄

/*
* Messages:
*
* {
*   "": "flush"
* }
*   Ship any pending entries.
*
* {
*   "": "inc",
*   id: string,
*   diff: number,   // >= 0.0
*
*   // Context
*   at: number
* }
*   Push a counter entry for delivery.
*
* {
*   "": "log",
*   id: string,
*   level: "info"|"warn"|"error"|"fatal"
*   msg: string,
*   args: Array of any,
*
*   // Context
*   at: number
* }
*   Push a log entry for delivery. If 'level'==="fatal", the delivery may be done sooner than scheduled.
*/
self.addEventListener('message', (e) => {
  console.log("Worker received:", e);

  if (e.data["at"]) {    // DEBUG
    const dt_DEBUG = Date.now() - e.data["at"];     // Once we know the delay, consider picking time here.
    console.debug("Diff when passing to worker:", `${ dt_DEBUG }ms`);   // 78ms (Safari 15.6); 152ms (Chrome 102)
  }

  const t = e.data[""] || fail("No '' field to indicate msg type.");    // just our convention
  const data = e.data;

  let shipNow;

  if (t === "flush") {
    shipNow = true;

  } else {
    pending.push(data);

    // If it's fatal, we might want to try shipping right away (so the user won't close the window and we lose the info).
    //
    if ((pending.length >= maxBatchEntries) || (t === 'log' && data.level === 'fatal')) {
      shipNow = true;
    }
  }

  if (shipNow) {
    ship();

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  } else {
    // If there's not already a timer ticking, set one up.
    //
    if (!timer) {
      timer = setTimeout(timedShipment, maxBatchDelayMs);

    } else {
      // we're fine - the timer will ship the new entry
    }
  }
});

function timedShipment() {
  if (pending.length === 0) {
    console.warn("Weird. Timed shipment but there are no pending entries. Skipped.");
    return;
  }

  ship();
}
