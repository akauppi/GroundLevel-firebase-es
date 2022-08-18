/*
* src/central/worker.js
*
* References:
*   - Vite > Web Workers
*     -> https://vitejs.dev/guide/features.html#web-workers
*/
import { initializeApp } from '@firebase/app'
import {connectFunctionsEmulator, getFunctions, httpsCallable} from '@firebase/functions'

import { metricsAndLogsWorker as myC } from '/@/config.js';
const { maxBatchDelayMs, maxBatchEntries } = myC;

const LOCAL = import.meta.env.MODE === "dev_local";

function fail(msg) { throw new Error(msg); }

let metricsAndLoggingProxy_v0;

/*
* Initialize the worker
*
* { ... }: Necessary for Firebase app initialization (since we are not in the main thread)
*/
function init({ apiKey, projectId, locationId }) {    // 'locationId' is optional (undefined == default region)

  const fns = (_ => {
    if (LOCAL) {    // "dev:local"
      const host = import.meta.env.VITE_EMUL_HOST || 'localhost';    // CI overrides it
      const FUNCTIONS_PORT = import.meta.env.VITE_FUNCTIONS_PORT;

      const fah= initializeApp( {
        projectId,
        apiKey: "none"
      });

      const fns = getFunctions(fah /*, regionOrCustomDomain*/ );
      connectFunctionsEmulator(fns, host,FUNCTIONS_PORT);
      return fns;

    } else {
      const fah = initializeApp({
        apiKey,
        projectId
      });

      return getFunctions( fah, locationId );
    }
  })();

  metricsAndLoggingProxy_v0 = httpsCallable(fns,"metricsAndLoggingProxy_v0");

  console.log("Worker initialized");
}

const pending= [];
let timer = schedule();    // ongoing timer; forces a shipment

function schedule() {   // () => Timer
  return setTimeout(ship, maxBatchDelayMs);
}

/*
* Ship things; don't alter the schedule.
*/
function ship() {
  clearTimeout(timer);

  if (pending.length === 0) {
    // nada
  } else {
    console.debug(`Shipping ${pending.length} ...`);

    // tbd. handle offline

    metricsAndLoggingProxy_v0( {arr: pending} );
    pending.length = 0;   // clear
  }

  // Reschedule after each successful shipment / empty visit.
  timer = schedule();
}

//--- Functions that feed the queue 🥄

/*
* Messages:
*
* {
*   "": "init",
*   apiKey: string,
*   projectId: string,
*   locationId: string
* }
*   Initialize the worker. This gets called before any of the other messages; once.
*
* {
*   "": "counter,
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
*   at: number,
*   uid: string
* }
*   Push a log entry for delivery. If 'level'==="fatal", the delivery may be done sooner than scheduled.
*/
onmessage = function(e) {
  console.log("Worker received:", e);

  if (e.data[""] !== "init") {    // DEBUG
    const dt_DEBUG = Date.now() - e.data["at"];     // Once we know the delay, consider picking time here.
    console.debug("Diff when passing to worker:", `${ dt_DEBUG }ms`);
  }

  const t = e.data[""] || fail("No '' field to indicate msg type.");    // just our convention
  const data = e.data;

  if (t === "init") {
    init(data);
    return;
  }

  pending.push(data);

  // If it's fatal, we might want to try shipping right away (so the user won't close the window and we lose the info).
  //
  const force = t === 'log' && data.level === 'fatal';

  if (force || pending.length >= maxBatchEntries) {   // always max 'maxBatchEntries' long (==)
    ship();
  }
}
