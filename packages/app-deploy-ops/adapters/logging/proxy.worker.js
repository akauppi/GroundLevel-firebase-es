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
*/
import { getApp } from '@firebase/app'
import { getFunctions, httpsCallable } from '@firebase/functions'

const REGION = env.REGION;    // injected at build

// Launch parameters via the URL.
//
/*
* 🔥 It is dispicable that Firebase requires the *CODE* to provide the "region or custom domain" where it's been
*   deployed to. This should be configuration. /🔥
*/
const args = new URLSearchParams(window.location.search);

//const locationId =      args.get("locationId");
const maxBatchDelayMs = args.get("max-batch-delay-ms");
const maxBatchEntries = args.get("max-batch-entries");

if (/*!locationId ||*/ !maxBatchDelayMs || !maxBatchEntries) {
  throw new Error( "Expecting web worker to be launched with '?locationId=...&max-batch-delay-ms=...&max-batch-entries=...");
}

const fnsRegional = getFunctions( getApp(), REGION /*locationId*/ );

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
