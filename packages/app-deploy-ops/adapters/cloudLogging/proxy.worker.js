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
  maxBatchEntries = args.get("max-batch-entries");

if (!maxBatchDelayMs || !maxBatchEntries) {
  fail( "Expecting web worker to be launched with '?max-batch-delay-ms=...&max-batch-entries=...");
}

let logs_v1;

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
function init({ apiKey, appId, locationId, projectId, authDomain }) {
  assert(locationId,"Missing 'locationId' in proxy worker.");

  const fah = initializeApp({
    apiKey,
    projectId
  });

  const fnsRegional = getFunctions( fah, locationId );

  logs_v1 = httpsCallable(fnsRegional,"logs_v1");

  console.log("Worker initialized");
}

console.log("Worker loaded");

/* {
  msg,
  payLoad,
  createdMs: t,
}*/

function logGen(level) {
  return (msg, ...args) => {
    logs_v1(level,msg,...args);
  }
}

const lookup = {
  init,
  ...Object.fromEntries( ["info","warn","error","fatal"].map( s =>
    [s,logGen(s)]
  ))
};

/*
* Messages:
*
* {
*   "": "init",
*   apiKey: string,
*   locationId: string,
*   projectId: string
* }
*
* Initialize the worker. First message after creation.
*
* {
*   "": "info"|"warning"|"error"|"fatal",
*   args: [...]
* }
*
* Logging.
*/
onmessage = function(e) {
  console.log("Worker received:", e);

  const t = e.data[""] || fail("No '' field to indicate msg type.");    // just our convention
  const data = e.data;

  const f = lookup[t] || fail(`Unknown message: ${ JSON.stringify(e.data) }`);
  f(data);
}
