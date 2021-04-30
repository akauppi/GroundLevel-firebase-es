/*
* src/ops/central.js
*
* Central logging.
*
* Imported directly by _application_ code; also used by eg. 'crash.js'.
*
* Edit the file to change, which adapter(s) are active (and their parameters).
*
* Note: Unlike with 'perf', this is not just a pass-through but also
*/

import { firebaseProm } from "../firebaseConfig";

// Cloud Logging, via proxy
import { init as cloudLoggingInit, loggerGen as cloudLoggingLoggerGen } from '/@adapters/cloudLogging/proxy.js'

const central = {};    // { info|warn|error: (msg, ...) => () }
let fatal;

const initializedProm = firebaseProm.then( config => {

  cloudLoggingInit( {
    maxBatchDelayMs: 5000,
    maxBatchEntries: 100,
    fbConfig: config
  } );

  const logGen = cloudLoggingLoggerGen;    // ("info"|"warn"|"error"|"fatal") => ((msg, opt) => ())
  central.info = logGen('info');
  central.warn = logGen('warn');
  central.error = logGen('error');

  fatal = logGen('fatal');
})

const fatalProm = initializedProm.then( _ => fatal );

export {
  initializedProm,    // indicates when loading is complete
  central,
  fatalProm   // for 'crash.js', only
}
