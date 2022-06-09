/*
* src/central/ship.worker.js
*
* Ship log and counter information to Firebase Cloud Functions, in batches.
*
* References:
*   - Vite > Web Workers
*     -> https://vitejs.dev/guide/features.html#web-workers
*/
import { initializeApp } from '@firebase/app'
import {connectFunctionsEmulator, getFunctions, httpsCallable} from '@firebase/functions'

import { logWorker } from '/@/config.js';
const { maxBatchDelayMs, maxBatchEntries } = logWorker;

if (!maxBatchDelayMs || !maxBatchEntries) {
  fail( "Missing configuration: 'max-batch-delay-ms' and/or 'max-batch-entries'");
}

const LOCAL = import.meta.env.MODE === "dev_local";

function fail(msg) { throw new Error(msg); }

let landingZone_v0;

/*
* Initialize the worker
*
*   config: Necessary fields for Firebase app initialization (since we are not in the main thread)
*
* 🔥 The WHOLE approach to (Cloud Functions v1) regions looks and feels like an afterthought. This stuff should not
*   need to be in CODE, but config. /🔥
*/
function init({ apiKey, projectId, locationId }) {    // 'locationId' is optional (undefined == default region)

  if (LOCAL) {    // "dev:local"; logs visible in DC output
    const host = import.meta.env.VITE_EMUL_HOST || 'localhost';    // CI overrides it
    const FUNCTIONS_PORT = import.meta.env.VITE_FUNCTIONS_PORT;

    const fah= initializeApp( {
      projectId,
      apiKey: "none"
    });

    const fns = getFunctions(fah /*, regionOrCustomDomain*/ );
    connectFunctionsEmulator(fns, host,FUNCTIONS_PORT);

    landingZone_v0 = httpsCallable(fns,"landingZone_v0");

  } else {
    const fah = initializeApp({
      apiKey,
      projectId
    });

    const fnsRegional = getFunctions( fah, locationId );

    landingZone_v0 = httpsCallable(fnsRegional,"landingZone_v0");
  }

  console.log("Worker initialized");
}

console.log("Worker loaded");

const pending= [];    // Array of { "": "log"|"counter", { ... } }
let timer;    // Timer; ongoing timer, which forces a shipment

/*
* Ship things; reschedule.
*/
function ship() {
  if (timer) clearTimeout(timer);

  if (pending.length === 0) {
    // nada
  } else {
    console.debug(`Shipping ${pending.length} logs/counters...`);

    // tbd. handle offline

    landingZone_v0( pending );
    pending.length = 0;   // clear
  }

  // Reschedule after each successful shipment / empty visit.
  timer = setTimeout(ship, maxBatchDelayMs);
}
ship();   // gets the timer started

/*
*/
function push(o, force = false) {   // ({ "": "log"|"inc", ... }, true?) => ()

  pending.push(o);

  if (force || pending.length >= maxBatchEntries) {
    ship();
  }
}

/*
* Queue a log entry for shipping.
*/
function pushLog({ msg, args, level }) {    // ({ msg: string, args: Array of any, level: string }) => ()

  const entry = createLogEntry(level, msg, args);

  // If it's fatal, we might want to try shipping right away (if the user were to close the browser, not to lose logs).
  //
  push({ "": "log", entry }, level === 'fatal');
}

/*
* Turn the received format to CloudLogging 'LogEntry'.
*
* Note: The documentation for such is not very clear (as often the case with log entries). This is a best effort.
*   Please suggest improvements! :)
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

/*
* Queue a counter.
*/
function pushInc({ name, diff, tags }) {    // ({ name: string, diff: number, tags: object }) => ()

  push({ "": "inc", name, diff, tags });
}

const lookup = {
  init,
  pushLog,
  pushInc
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
*   Initialize the worker. First message after creation.
*
* {
*   "": "log",
*   msg: string,
*   args: Array of any,
*   level: "info"|"warn"|"error"|"fatal"
* }
*
*   Logging. Handles that the message gets delivered - eventually - if possible.
*
* {
*   "": "inc",
*   name: string,
*   diff: number,
*   tags: object
* }
*
*   Counter.
*/
onmessage = function(e) {
  console.log("Worker received:", e);

  const t = e.data[""] || fail("No '' field to indicate msg type.");    // just our convention
  const data = e.data;

  const f = lookup[t] || fail(`Unknown message: ${ JSON.stringify(e.data) }`);
  f(data);
}
