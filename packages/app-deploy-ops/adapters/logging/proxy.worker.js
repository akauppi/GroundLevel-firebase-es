/*
* adapters/logging/proxy.worker.js
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
import { getApp } from '@firebase/app'
import { getFunctions, httpsCallable } from '@firebase/functions'

// Launch parameters via the URL.
//
const args = new URLSearchParams(location.search);

const region = args.get("region"),
  maxBatchDelayMs = args.get("max-batch-delay-ms"),
  maxBatchEntries = args.get("max-batch-entries");

if (/*!locationId ||*/ !maxBatchDelayMs || !maxBatchEntries) {
  throw new Error( "Expecting web worker to be launched with '?locationId=...&max-batch-delay-ms=...&max-batch-entries=...");
}

/*
* 🔥 It is despicable that Firebase requires the *CODE* to provide the "region or custom domain" where it's been
*   deployed to. This should be configuration, and Firebase client should just know it!!!
*
*   The WHOLE approach to regions looks and feels like an afterthought. Nothing wrong with a default region - but it
*   should be _just_ a configuration entry to change it to something else.
* /🔥
*/
const fnsRegional = getFunctions( getApp(), region );

const logs_v1 = httpsCallable(fnsRegional,"logs_v1");

console.log("Worker loaded");

/* {
  msg,
  payLoad,
  createdMs: t,
}*/

/*
* Messages:
*
* "init", { regionOrCustomDomain: string }
*
*     Initialize the worker. First message after creation (since one cannot provide construction parameters for a worker?)
*
* "debug"|"info"|"warning"|"error"|"fatal", object?
*
*     Logging.
*/
onmessage = function(e) {
  console.log("Worker received:", e);
}
