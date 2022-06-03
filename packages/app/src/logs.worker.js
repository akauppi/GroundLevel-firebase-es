/*
* src/logs.worker.js
*
* References:
*   - Vite > Web Workers
*     -> https://vitejs.dev/guide/features.html#web-workers
*/
import { initializeApp } from '@firebase/app'
import {connectFunctionsEmulator, getFunctions, httpsCallable} from '@firebase/functions'

import { logWorker } from '/@/config.js';
const { maxBatchDelayMs, maxBatchEntries } = logWorker;

const LOCAL = import.meta.env.MODE === "dev_local";

function fail(msg) { throw new Error(msg); }

if (!maxBatchDelayMs || !maxBatchEntries) {
  fail( "Expecting web worker to be launched with '?max-batch-delay-ms=...&max-batch-entries=...'");
}

let cloudLoggingProxy_v0;

/*
* Initialize the worker
*
*   config: Necessary fields for Firebase app initialization (since we are not in the main thread)
*
* 🔥 The WHOLE approach to (Cloud Functions v1) regions looks and feels like an afterthought. This stuff should not
*   need to be in CODE, but config. /🔥
*/
function init({ apiKey, projectId, locationId }) {    // 'locationId' is optional (undefined == default region)

  if (LOCAL) {    // "dev:local"; logs visible in Docker console
    const host = import.meta.env.VITE_EMUL_HOST || 'localhost';    // CI overrides it
    const FUNCTIONS_PORT = import.meta.env.VITE_FUNCTIONS_PORT;

    const fah= initializeApp( {
      projectId,
      apiKey: "none"
    });

    const fns = getFunctions(fah /*, regionOrCustomDomain*/ );
    connectFunctionsEmulator(fns, host,FUNCTIONS_PORT);

    cloudLoggingProxy_v0 = httpsCallable(fns,"cloudLoggingProxy_v0");

  } else {
    const fah = initializeApp({
      apiKey,
      projectId
    });

    const fnsRegional = getFunctions( fah, locationId );

    cloudLoggingProxy_v0 = httpsCallable(fnsRegional,"cloudLoggingProxy_v0");
  }

  console.log("Worker initialized");
}

console.log("Worker loaded");

const pending= [];
let timer = schedule();    // ongoing timer, which forces a shipment

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
    console.debug(`Shipping ${pending.length} 🪵🪵...`);

    // tbd. handle offline

    cloudLoggingProxy_v0({les: pending /*, ignore*/});
    pending.length = 0;   // clear
  }

  // Reschedule after each successful shipment / empty visit.
  timer = schedule();
}

/*
* Queue a log entry for shipping.
*/
function log({ msg, args, level }) {    // ({ msg: string, args: Array of any, level: string }) => ()

  const le = createLogEntry(level, msg, args);

  pending.push(le);

  // If it's fatal, we might want to try shipping right away (so the user won't close the window and we lose the info).
  //
  if (level === 'fatal' || pending.length >= maxBatchEntries) {   // always max 'maxBatchEntries' long (==)
    ship();
  }
}

/*
* Turn the received format to CloudLogging 'LogEntry'.
*
* Note: The documentation for such is not very clear (as often the case with log entries). It is preferable to
*   support preferred schema, but the docs don't clearly state such. This is our best effort - please suggest
*   improvements! :)
*
*   Cloud Logging API docs > LogEntry
*     -> https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry
*/
function createLogEntry(level, msg, args) {    // (string, string, Array of any) => LogEntry
  const severity = severityLookup.get(level) || fail(`Unknown logging level: ${level}`);

  const timestamp = new Date().toISOString();   // "2021-05-02T15:08:09.073Z"
  const jsonPayload = { msg, args };

  return {
    severity,
    timestamp,
    jsonPayload
  }
}

const severityLookup = new Map([
  ["info","INFO"],
  ["warn","WARNING"],
  ["error","ERROR"],
  ["fatal","CRITICAL"]
]);

const lookup = {
  init,
  log
};

/*
* Messages:
*
* {
*   "": "init",
*   apiKey: string,
*   projectId: string,
*   locationId: string
* }
*
* Initialize the worker. First message after creation.
*
* {
*   "": "log",
*   msg: string,
*   args: Array of any,
*   level: "info"|"warn"|"error"|"fatal"
* }
*
* Logging. Handles that the message gets delivered - eventually - if possible.
*/
onmessage = function(e) {
  console.log("Worker received:", e);

  const t = e.data[""] || fail("No '' field to indicate msg type.");    // just our convention
  const data = e.data;

  const f = lookup[t] || fail(`Unknown message: ${ JSON.stringify(e.data) }`);
  f(data);
}
