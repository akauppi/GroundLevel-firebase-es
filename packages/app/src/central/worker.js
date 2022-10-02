/*
* src/central/worker.js
*
* Collects metrics and log entries, and occasionally passes them to 'callables.js', for delivery.
*/
import { metricsAndLogsWorker as myC } from '/@/config.js';
const { maxBatchDelayMs, maxBatchEntries } = myC;

function fail(msg) { throw new Error(msg); }

import { metricsAndLoggingProxy_v0, setToken } from './callables.worker.js'

const pending= [];    // Array of {...}

let timer;
  // undefined: 'pending' collects guest entries
  // Timer:     shipment is scheduled; some stuff in 'pending'

/***
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
***/

/*
* Ship things
*
* Makes a copy of 'pending' entries (if any), clears 'pending', ships the copy.
*/
async function ship() {    // () => Promise of ()
  if (pending.length === 0) return;

  const arr= [...pending];    // JavaScript note: copies the array
  pending.length = 0;

  console.debug(`Shipping ${arr.length} ...`);

  const t0 = Date.now();

  await metricsAndLoggingProxy_v0({ arr });

  console.debug(`Shipping took: ${ Date.now() - t0 }ms`);
    // tbd. collect this into the metrics (not right away; put aside and when there's something else to ship, pass it along)
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
*   "": "login"
*   token: string
* }
*   A user has been authenticated; start shipping entries (including possibly stored guest entries).
*
* {
*   "": "ship",
*   id: string,
*   inc: number,   // >= 0.0
*   ctx: {
*     clientTimestamp: number,
*     uid: string?
*   }
* }
*   Push a counter entry for delivery.
*
* {
*   "": "ship",
*   id: string,
*   level: "info"|"warn"|"error"|"fatal"
*   msg: string,
*   args: Array of any,
*   ctx: {
*     clientTimestamp: number,
*     uid: string?
*   }
* }
*   Push a log entry for delivery. If 'level'==="fatal", the delivery may be done sooner than scheduled.
*
* {
*   "": "ship",
*   id: string,
*   obs: number,
*   ctx: {
*     clientTimestamp: number,
*     uid: string?
*   }
* }
*   Push a statistical observation for delivery.
*/
self.addEventListener('message', (e) => {
  console.log("Worker received:", e);

  const data = e.data;

  if (true) {   // DEBUG
    const at = data?.ctx?.clientTimestamp;
    if (at) {
      const dt_DEBUG = Date.now() - at;
      console.debug("Diff when passing to worker:", `${ dt_DEBUG }ms`);   // 78ms (Safari 15.6); 152ms (Chrome 102)
    }
  }

  let shipNow;

  const t = data[""] || fail("No type in '.[\"\"]'");
  if (t === 'flush') {
    shipNow = true;

  } else if (t === 'login') {
    const token = data.token || fail("No '.token' field");
    setToken(token);    // allows 'metricsAndLoggingProxy_v0' to reach the server

  } else if (t === 'ship') {
    pending.push({ ...data, [""]: undefined });   // "" field not needed

    // If it's fatal, we might want to try shipping right away (so the user won't close the window and we lose the info).
    //
    if (pending.length >= maxBatchEntries || data.level === 'fatal') {
      shipNow = true;
    }
  } else {
    fail(`Unexpected type: ${t}`);
  }

  if (shipNow) {
    ship();   // free-running tail

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  } else {
    // If there's not already a timer ticking, set one up.
    //
    if (!timer) {
      timer = setTimeout(ship, maxBatchDelayMs);

    } else {
      // we're fine - the timer will ship the new entry
    }
  }
});
