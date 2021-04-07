/*
* adapters/logging/proxy.js
*
* Provide means to log to Google Cloud Logging, via the app's Cloud Functions backend.
*
* Note:
*   Must implement batching of logs and support for offline mode. Not sure why Firebase doesn't have central logging
*   (it _does_ have "Events" but those require enabling Analytics, so... were only briefly considered).
*/

function createLogger(/*{ maxBatchDelayMs = 123, maxBatchSize = 2000 }*/) {   // () => (string) => (msg, opt) => ()

  const myWorker = new Worker('proxy.worker.js');

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
