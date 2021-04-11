/*
* adapters/logging/proxy.js
*
* MAIN THREAD side of the logging proxy.
*
* Provide means to log to Google Cloud Logging, via the app's Cloud Functions backend.
*
* Note:
*   Must implement batching of logs and support for offline mode. Not sure why Firebase doesn't have central logging
*   (it has "Events" but won't turn there because they require Analytics).
*
*   Initialized in parallel with 'main.js' initializing Firebase for itself.
*/
const [esmHash, iifeHash] = env.PROXY_WORKER_HASHES;    // injected by Rollup build

import { firebaseProm } from "../../src/firebaseConfig"

function fail(msg) {
  throw new Error(msg);
}

// Some browsers (Firebase, Safari, as of April 2021) don't yet support ES modules, for workers:
//
// MDN > Web APIs > Worker > Browser compatibility (Support for ECMAScript modules):
//  -> https://developer.mozilla.org/en-US/docs/Web/API/Worker#browser_compatibility
//
const PROXY_WORKER_PATH = `/worker/proxy.worker-${esmHash}.js`;
const PROXY_WORKER_IIFE_PATH = `/worker/proxy.worker-${iifeHash}.iife.js`;

function paramCheck(opts,k) {
  const v= opts[k] || fail(`Missing adapter param: ${k}`);
  delete opts[k];
  return v;
}

async function createLogger(opts) {   // ({ maxBatchDelayMs, maxBatchEntries }) => Promise of (string) => (msg, opt) => ()
  const
    maxBatchDelayMs = paramCheck(opts,'maxBatchDelayMs'),
    maxBatchEntries = paramCheck(opts,'maxBatchEntries');

  const unusedKeys = Object.keys(opts);
  if (unusedKeys.length > 0) {
    throw new Error(`Unexpected adapter parameters: ${unusedKeys.join(', ')}`);
  }

  const myWorker = new Worker(`${PROXY_WORKER_PATH}?` +
    `max-batch-delay-ms=${maxBatchDelayMs}` +
    `&max-batch-entries=${maxBatchEntries}`,
    { type: 'module' }
  );

  const o = await firebaseProm;
  const fbConfig = {
    //apiKey: o.apiKey,
    //appId: o.appId,
    locationId: o.locationId,
    //projectId: o.projectId,
    //authDomain: o.authDomain
  };

  // tbd. Test with Firebase and Safari: what kind of error - then load IIFE.

  myWorker.postMessage("init", fbConfig );

  return function (level) {    // ("debug"|"info"|"warn"|"error"|"fatal") => (msg, opts) => ()

    return function log(/*msg, payload*/) {   // (string, object?) => ()
      const o = workerData(arguments);

      // Sending to the worker is a fire-and-forget operation. It bundles the log entries together, and may send them
      // only later.
      //
      myWorker.postMessage(level,o);
    }
  }
}

/*
* Convert (and enrich with time stamp) a log entry for transmission to the worker.
*/
function workerData(msg,payLoad) {
  const t = Date.now();   // time now, in Epoch ms's

  return {
    msg,
    payLoad,
    createdMs: t,
  }
}

export {
  createLogger
}
