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

const PROXY_WORKER_HASH = env.PROXY_WORKER_HASH;    // injected by Rollup build
const REGION = env.REGION;    // injected by Rollup build

function fail(msg) {
  throw new Error(msg);
}

function paramCheck(opts,k) {
  const v= opts[k] || fail(`Missing adapter param: ${k}`);
  delete opts[k];
  return v;
}

function createLogger(opts) {   // ({ maxBatchDelayMs, maxBatchEntries }) => (string) => (msg, opt) => ()
  const
    maxBatchDelayMs = paramCheck(opts,'maxBatchDelayMs'),
    maxBatchEntries = paramCheck(opts,'maxBatchEntries');

  const unusedKeys = Object.keys(opts);
  if (unusedKeys.length > 0) {
    throw new Error(`Unexpected adapter parameters: ${unusedKeys.join(', ')}`);
  }

  const myWorker = new Worker(`/worker/proxy.worker-${PROXY_WORKER_HASH}.js?` +
    `region=${REGION}` +
    `&max-batch-delay-ms=${maxBatchDelayMs}` +
    `&max-batch-entries=${maxBatchEntries}`
  );

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
