/*
* adapters/cloudLogging/proxy.worker.js
*
* WEB WORKER side for 'proxy.js'.
*
* Note: Since this is created as a Web Worker, it *does not* have access to the main application's runtime.
*   Try to keep it as self-contained as possible. Dependencies likely get built separately from the main app (including
*   separate tree-shaking; up to how we do it with Rollup).
*
* Batches the log entries, handles things like batch size limit, batch age limit, offline awareness.
*
* DEBUGGING HELP:
*   On Chrome 89, Developer Tools > (right panel) > Threads shows the web worker.
*   - Try the "pause on caught exceptions" - if that is on, you'll automatically get a debugger (also in web worker)
*
*   Note that:
*     - 'debugger' is ignored in web worker!
*     - 'console.log' does not show on console, from web worker!
*     - 'window' does not exist
*
*   [ ] Make more detailed helps in '../../DEVS/Debugging\ Web\ Workers\ (Chrome).md'?
*/
import { initializeApp } from '@firebase/app'
import { getFunctions, httpsCallable } from '@firebase/functions'

function fail(msg) { throw new Error(msg); }

function assert(cond,msg) { if (!cond) fail(msg); }

// Launch parameters via the URL
//
// Approach: One can configure a worker either via query params (here) or via the 'init' message. We do both but you can
//    certainly prefer one over the other. Few params is good as query; a lot feels easier via the message.
//
const args = new URLSearchParams(location.search);

const maxBatchDelayMs = args.get("max-batch-delay-ms"),
  maxBatchEntries = args.get("max-batch-entries"),
  ignore = args.get("ignore");

if (!maxBatchDelayMs || !maxBatchEntries) {
  fail( "Expecting web worker to be launched with '?max-batch-delay-ms=...&max-batch-entries=...");
}

let cloudLoggingProxy_v0;

/*
* Initialize the worker
*
*   config:   Necessary fields for Firebase app initialization (since we are not in the main thread)
*/
/*
* 🔥 It is despicable that Firebase requires the *CODE* to provide the "region or custom domain" where it's been
*   deployed to. This should be configuration, and Firebase client should just know it!!!
*
*   The WHOLE approach to regions looks and feels like an afterthought. Nothing wrong with a default region - but it
*   should be _just_ a configuration entry to change it to something else.
* /🔥
*/
function init({ apiKey, projectId, locationId }) {    // 'locationId' is optional (undefined == default region)

  const fah = initializeApp({
    apiKey,
    projectId
  });

  const fnsRegional = getFunctions( fah, locationId );

  cloudLoggingProxy_v0 = httpsCallable(fnsRegional,"cloudLoggingProxy_v0");

  console.log("Worker initialized");
}

console.log("Worker loaded");

/*
* Queue a log entry for shipping.
*/
function log({ msg, args, level }) {    // ({ msg: string, args: Array of any, level: string }) => ()

  const le = createLogEntry(level, msg, args);

  cloudLoggingProxy_v0( { les: [le], ignore } );
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
  const severity = severityLookup[level] || fail(`Unknown logging level: ${level}`);

  const timestamp = new Date().toISOString();   // "2021-05-02T15:08:09.073Z"

  /*** consider:
   *
   * - should we use 'textPayload' if there are no args?
   const textPayload = (args.length == 0) ? msg : undefined;
   * - ..and otherwise this?
   const jsonPayload = (args.length > 0) ? { msg, args };
   ***/

  const jsonPayload = { msg, args };    // to get things started (#tmp?)

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
