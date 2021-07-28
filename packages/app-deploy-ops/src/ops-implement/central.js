/*
* src/ops-implement/central.js
*
* Context:
*   - Firebase has been initialized
*   - loaded implicitly when the application loads (if it uses '@ops/central')
*
* Edit the file to change, which adapter(s) are active (and their parameters).
*
* Unlike 'perf.js', this also converts the adapter API to that used in application code.
*/
// Cloud Logging, via proxy
import { init as cloudLoggingInit, loggerGen as cloudLoggingLoggerGen } from '/@adapters/cloudLogging/index'

cloudLoggingInit( {
  maxBatchDelayMs: 5000,
  maxBatchEntries: 100
} );

const gen = cloudLoggingLoggerGen;    // ("info"|"warn"|"error"|"fatal") => ((msg, ...args) => ())

const central = {
  info: gen('info'),
  warn: gen('warn'),
  error: gen('error')
};

const fatal = gen('fatal');

// Pass errors caught to 'fatal'. This works alongside other crash reporting measures.
//
// Note: The focus is not in precise line reporting, but getting a notice of fatal failures also to the logs.
//
const prevOnError = window.onerror;

window.onerror = function (msg, source, lineNbr, colNbr, error) {
  //
  // {
  //    msg: "Uncaught ReferenceError: env is not defined",
  //    source: "http://localhost:3012/worker/proxy.worker-62db5bc8…st6&max-batch-delay-ms=5000&max-batch-entries=100",
  //    lineNbr: 1307,
  //    colNbr: 16
  // }
  // {
  //    msg: "Error: Unknown message: [object Object]",
  //    source: ".../worker/proxy.worker-...",
  // }
  //
  // Note: If the error comes from web worker, 'error' is 'undefined'

  fatal(msg, { source, lineNbr, colNbr });

  if (prevOnError) prevOnError(arguments);
  //return true;    // "prevents the firing of the default error handler" (what would that do?)
}

/*
* Catches errors that happen within a Promise.
*
* This can be essentially anything.
*/
const prevOnUnhandledRejection = window.onunhandledrejection;
let im_in = false;

window.onunhandledrejection = function (promiseRejectionEvent) {
  const { reason } = promiseRejectionEvent;
    // { isTrusted: true, promise: ..., reason: string }

  // Snowball protection: skip handling if the rejection could have been within 'fatal' itself. (have seen this early
  // in development; do we still have promises, there?).
  //
  if (!im_in) {
    im_in = true;
    fatal(`Unhandled promise rejection: ${reason}`);
    im_in = false;

    if (prevOnUnhandledRejection) prevOnUnhandledRejection(arguments);
  }
}

export {
  central
}
