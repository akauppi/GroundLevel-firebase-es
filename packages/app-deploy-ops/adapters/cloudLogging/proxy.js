/*
* adapters/cloudLogging/proxy.js
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
import { getApp } from '@firebase/app'

const esmHash = env.PROXY_WORKER_HASH;    // injected by Rollup build
//const iifeHash = env.PROXY_WORKER_HASH_IIFE;    // not needed

function fail(msg) { throw new Error(msg); }
function assert(cond,msg) { if (!cond) fail(msg || "(assert failed)"); }

// MDN > Web APIs > Worker > Browser compatibility (Support for ECMAScript modules):
//  -> https://developer.mozilla.org/en-US/docs/Web/API/Worker#browser_compatibility
//
// The page is correct, but our build still runs also on:
//  - Safari 14.0.3 (macOS)
//  - Firefox 88 (macOS)
//
// The reason likely is that the worker is a single chunk, not using 'import' or 'export' (and the browsers ignore
// the '{ type: "module" }' though they technically should reject it).
//
const PROXY_WORKER_PATH = `/worker/proxy.worker-${esmHash}.js`;
//const PROXY_WORKER_IIFE_PATH = `/worker/proxy.worker-${iifeHash}.iife.js`;

let myWorker;

/*
* To be called _after_ Firebase app is initialized.
*/
function init({ maxBatchDelayMs, maxBatchEntries }) {   // ({ maxBatchDelayMs: int, maxBatchEntries: int }) => Promise of ()

  // Pick Firebase app information, to be passed to the Worker.
  //
  // We _could_ also bake this in at build time (but at the least it'd make it impossible to detach the adapter as a separate package).
  //
  const fah = getApp();
  console.debug("OPTIONS", { options: fah.options })

  myWorker = new Worker(`${PROXY_WORKER_PATH}?` +
    `max-batch-delay-ms=${maxBatchDelayMs}` +
    `&max-batch-entries=${maxBatchEntries}`,
    { type: 'module' }
  );

  const {
    apiKey,
    locationId,
    projectId
  } = fah.options;
  assert(locationId, "No 'locationId'!");

  myWorker.postMessage({ "":"init",
    apiKey,
    locationId,
    projectId
  });
}

function loggerGen(level) {   // ("info"|"warn"|"error"|"fatal") => (msg, ...) => ()
  myWorker || fail("Call 'init' first");

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

export {
  init,
  loggerGen
}
