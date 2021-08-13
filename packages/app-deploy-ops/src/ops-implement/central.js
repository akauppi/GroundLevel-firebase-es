/*
* src/ops-implement/central.js
*
* Central logging. Imported by either:
*   - application code (uses 'central')
*   - 'main.js' after Firebase has been set up
*
* Context:
*   - Firebase has been initialized when we are loaded
*
* Edit the file to change, which adapter(s) are active (and their parameters).
*
* Unlike 'ops/perf.js', this also converts the adapter API to that used in application code.
*/
import { centralIsAvailable } from '../catch'

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

// Inform 'crash.js' that fatal logging is now available.
//
// Note: This allows 'crash' to be loaded before Firebase is initialized, and also allows us to expose 'fatal' only
//    targeted to that module. :)
//
centralIsAvailable(fatal);

export {
  central
}
