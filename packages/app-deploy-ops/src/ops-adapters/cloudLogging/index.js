/*
* ops-adapters/cloudLogging/index.js
*
* MAIN THREAD side of the logging proxy.
*
* Provide means to log to Google Cloud Logging, via the app's Cloud Functions backend.
*
* Context:
*   Firebase is initialized before the adapter is loaded.
*
* Note:
*   Must implement batching of logs and support for offline mode. Not sure why Firebase doesn't have central logging
*   (it has "Events" but won't turn to those because they require Google Analytics).
*
*   Initialized in parallel with 'main.js' initializing Firebase for itself.
*/
import { getApp } from '@firebase/app'

const esmHash = import.meta.env.PROXY_WORKER_HASH;
//const iifeHash = import.meta.env.PROXY_WORKER_HASH_IIFE;    // not needed

function fail(msg) { throw new Error(msg); }

// If we are hosted at 'localhost', use a separate log online.
//
const ignore = location.hostname === "localhost" || location.hostname === "127.0.0.1";

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
const PROXY_WORKER_PATH = `/worker/worker-${ esmHash }.js`;
//const PROXY_WORKER_IIFE_PATH = `/worker/worker-${iifeHash}.iife.js`;

let myWorker;

/*
* To be called _after_ Firebase app is initialized.
*/
function init({ maxBatchDelayMs, maxBatchEntries }) {   // ({ maxBatchDelayMs: int, maxBatchEntries: int }) => Promise of ()

  // Pick Firebase app information, to be passed to the Worker.
  //
  // Note: The options are available as 'meta.import.env.[API_KEY|...]' as well, but reading it like this keeps us
  //    a bit detached from the app.
  //
  const fah = getApp();
  //console.debug("OPTIONS", { options: fah.options })  // DEBUG

  const {
    apiKey,
    projectId,
    locationId    // available if 'main.js' has placed it, at initialization (also available as 'meta.import.env.LOCATION_ID')
  } = fah.options;

  myWorker = new Worker(`${PROXY_WORKER_PATH}?` +
    `max-batch-delay-ms=${maxBatchDelayMs}` +
    `&max-batch-entries=${maxBatchEntries}` +
    (ignore ? '&ignore=true':''),
    { type: 'module' }
  );

  myWorker.postMessage({ "":"init",
    apiKey,
    projectId,
    locationId
  });
}

function loggerGen(level) {   // ("info"|"warn"|"error"|"fatal") => (msg, ...) => ()
  myWorker || fail("Call 'init' first");

  return (msg, ...args) => {   // (string [,any [,...]]) => ()

    // Sending to the worker is a fire-and-forget operation. It converts the log entry to 'LogEntry', bundles them
    // together, for shipment, and retries over offline gaps.
    //
    myWorker.postMessage({ "":"log", level, msg, args });
  }
}

export {
  init,
  loggerGen
}
