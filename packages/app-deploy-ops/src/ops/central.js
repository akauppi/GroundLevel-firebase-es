/*
* src/ops/central.js
*
* Central logging. Imported by application code (or 'fatalProm' from 'crash.js').
*
* Loads asynchronously, so that application launch is not held back by logging adapter initialization. During
* the loading, possible logs are still accepted.
*
* Edit the file to change, which adapter(s) are active (and their parameters).
*
* Unlike 'ops/perf.js', this also converts the adapter API to that used in application code.
*/
import { firebaseProm } from "../firebaseConfig";
import { init as cloudLoggingInit, loggerGen as cloudLoggingLoggerGen } from '/@adapters/cloudLogging/proxy.js';

let initialLogs=[];   // Array of [level, msg, ...]

function initialLogGen(level) {
  return (...args) => { initialLogs.push(level, ...args); }
}

const central = Object.fromEntries( ['info','warn','error'].map( level =>
  [level, initialLogGen(level)]
));    // { info|warn|error: (msg, ...) => () }

let fatal = initialLogGen('fatal');

verySoon(_ => {   // Without this, gives "Cannot access 'firebaseProm' before initialization".
  firebaseProm.then( async _ => {
    // Cloud Logging, via proxy

    cloudLoggingInit( {
      maxBatchDelayMs: 5000,
      maxBatchEntries: 100
    } );

    const f = cloudLoggingLoggerGen;    // ("info"|"warn"|"error"|"fatal") => ((msg, opt) => ())
    central.info = f('info');
    central.warn = f('warn');
    central.error = f('error');

    fatal = f('fatal');

    // These calls happen in the original order, before further ones.
    //
    initialLogs.forEach( ([level, ...args]) => {
      (central[level] || (level === 'fatal' && fatal))(...args);
    })
    initialLogs = null;

    console.debug("Central initialized.");
  });
});

function verySoon(f) {
  setTimeout(f,0);
}

export {
  central,
  fatal   // for 'crash.js', only
}
