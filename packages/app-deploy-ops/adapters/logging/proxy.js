/*
* adapters/logging/proxy.js
*
* MAIN THREAD side of the logging proxy.
*
* Provide means to log to Google Cloud Logging, via the app's Cloud Functions backend.
*
* Note:
*   Must implement batching of logs and support for offline mode. Not sure why Firebase doesn't have central logging
*   (it has "Events" but won't turn to those because they require Google Analytics).
*
*   Initialized in parallel with 'main.js' initializing Firebase for itself.
*/
const esmHash = env.PROXY_WORKER_HASH;    // injected by Rollup build
//const iifeHash = env.PROXY_WORKER_HASH_IIFE;    // not needed

import { firebaseProm } from "../../src/firebaseConfig"

function fail(msg) {
  throw new Error(msg);
}

// MDN > Web APIs > Worker > Browser compatibility (Support for ECMAScript modules):
//  -> https://developer.mozilla.org/en-US/docs/Web/API/Worker#browser_compatibility
//
// The page seems to be behind:
//  - Safari 14.0.3 (macOS) looks fine with ESM Worker threads.
//  - Firefox 88 (macOS) seems fine with ESM Worker threads.
//
const PROXY_WORKER_PATH = `/worker/proxy.worker-${esmHash}.js`;
//const PROXY_WORKER_IIFE_PATH = `/worker/proxy.worker-${iifeHash}.iife.js`;

function paramCheck(opts,k) {
  const v= opts[k] || fail(`Missing adapter param: ${k}`);
  delete opts[k];
  return v;
}

async function loggerGenGen(opts) {   // ({ maxBatchDelayMs, maxBatchEntries }) => Promise of (string) => (msg, opt) => ()
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

  const {
    apiKey,
    //appId,
    locationId,
    projectId,
    //authDomain
  } = await firebaseProm;

  // tbd. Test with Firebase and Safari: what kind of error - then load IIFE.

  myWorker.postMessage({ "":"init",
    apiKey,
    locationId,
    projectId
  });

  return (level) => {    // ("debug"|"info"|"warn"|"error"|"fatal") => (msg, ...) => ()

    return (msg, ...args) => {   // (string [,any [,...]]) => ()
      // JavaScript
      const now = Date.now();   // e.g. 1619536750627

      const o = {
        msg,
        args,
        createdMs: now
      };

      // Sending to the worker is a fire-and-forget operation. It bundles the log entries together, and may send them
      // only later.
      //
      myWorker.postMessage({ "":level, ...o });
    }
  }
}

export {
  loggerGenGen
}
