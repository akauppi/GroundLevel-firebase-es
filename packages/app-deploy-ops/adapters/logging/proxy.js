/*
* adapters/logging/proxy.js
*
* MAIN THREAD side of the logging proxy.
*
* Provide means to log to Google Cloud Logging, via the app's Cloud Functions backend.
*
* Note:
*   Must implement batching of logs and support for offline mode. Not sure why Firebase doesn't have central logging
*   (it _does_ have "Events" but those require enabling Analytics, so... were only briefly considered).
*/
const [esmHash, iifeHash] = env.PROXY_WORKER_HASHES;    // injected by Rollup build

import { getFirebase } from "../../src/firebaseConfig"

function fail(msg) {
  throw new Error(msg);
}

// REMOVE? if we do feature detection, below... tbd.
// Find the right worker JS to load.
//
// MDN > Web APIs > Worker > Browser compatibility (Support for ECMAScript modules):
//  -> https://developer.mozilla.org/en-US/docs/Web/API/Worker#browser_compatibility
//
// As of Apr 2021:
//  Firefox, Safari don't support ESM as a worker (feed them IIFE).
//

const PROXY_WORKER_PATH = `/worker/proxy.worker-${esmHash}.js`;
const PROXY_WORKER_IIFE_PATH = `/worker/proxy.worker-${iifeHash}.iife.js`;

function paramCheck(opts,k) {
  const v= opts[k] || fail(`Missing adapter param: ${k}`);
  delete opts[k];
  return v;
}

async function createLogger(opts) {   // ({ maxBatchDelayMs, maxBatchEntries }) => (string) => (msg, opt) => ()
  const
    maxBatchDelayMs = paramCheck(opts,'maxBatchDelayMs'),
    maxBatchEntries = paramCheck(opts,'maxBatchEntries');

  const unusedKeys = Object.keys(opts);
  if (unusedKeys.length > 0) {
    throw new Error(`Unexpected adapter parameters: ${unusedKeys.join(', ')}`);
  }

  const o = getFirebase() || fail("Missing Firebase configuration.");
  const fbConfig = {
    //apiKey: o.apiKey,
    //appId: o.appId,
    locationId: o.locationId,
    //projectId: o.projectId,
    //authDomain: o.authDomain
  };

  const myWorker = new Worker(`${PROXY_WORKER_PATH}?` +
    `max-batch-delay-ms=${maxBatchDelayMs}` +
    `&max-batch-entries=${maxBatchEntries}`,
    { type: 'module' }
  );

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
