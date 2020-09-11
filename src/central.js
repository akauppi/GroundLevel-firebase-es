/*
* src/central.js
*
* Central logging.
*
* Called between Firebase initialization and app launch.
*
* The idea is to be able to pass logs (also offline logging, once there is a re-connection) from the client to
* a centralized location, for study.
*
* Such logs can also be shown as Toasts, in the UI. Which logs ignite toasts is configurable.
*/

// Rollup doesn't build these:
//  <<
//    TypeError: object null is not iterable
//  <<
//
// Instead of doing if/else on Rollup vs. Vite here, we set the 'Toastify' in the init blocks. Once/if Toastify becomes
// at friends with Rollup (targeting ES modules is likely the problem?), return to modular design and 'import' here.
//
//import Toastify from 'toastify-js'
//import 'toastify-js/src/toastify.css'

assert(Toastify);

import { ops } from './config.js'
import { Fatal, fatalConfigurationMismatch } from './fatal.js'

// Note: We have difficulties importing '@airbrake/browser' within Rollup (under Vite, it seems to work).
//
//import { Notifier } from "@airbrake/browser"    // causes problems with 'npm run prod:serve' (Rollup)
assert(Notifier);   // from the init scripts

let airbrake;   // 'Notifier' | undefined

const mode = import.meta.env.MODE;    // needs to be at the root (Rollup)

// Note: We _know_ that we get called before 'app.js', so it's safe to throw a 'Fatal' at initialization - it won't
//    lead to an infinite loop.

if (!LOCAL) {
  if (ops.logs.type === 'airbrake') {
    const { projectId, projectKey } = ops.airbrake;
    if (! (projectId && projectKey)) {
      throw Fatal( fatalConfigurationMismatch,"Configuration mismatch: 'ops.airbrake.projectId' and/or 'ops.airbrake.projectKey' missing");
    }

    airbrake = new Notifier({
      projectId,
      projectKey,
      environment: mode   // 'production'|'development'
    });

  } else if (ops.logs.type) {
    throw Fatal( fatalConfigurationMismatch,`Unexpected 'ops.logs.type' in config: ${ops.logs.type}`);
  }
}

let logGen;   // (string) => (string [, object]) => ()

if (LOCAL) {
  // Using Firebase callables for 'dev:local'. Generally a bad idea, since it requires an online connection, but
  // suitable for development.
  //
  // Note: Let's not use './firebase/fns' since it's supposed to be an app level module.
  //
  const fns = firebase.app().functions();
  const log = fns.httpsCallable('logs_v190720');

  logGen = level => {    // (string) => (string [, object]) => ()
    return (msg, opt) => {
      log({level, msg, payload: opt})   // tbd. catch errors and report to the user
    }
  };
} else if (airbrake) {

  const severityMap = {
    'debug': "DEBUG",
    'info': "INFO",
    'warn': "WARN",
    'error': "ERROR",
    'fatal': "CRITICAL"
  };

  logGen = level => {
    const severity = severityMap[level];

    return (msg, opt) => {   // (string) => (string, object|undefined) => ()

      // Pass the signed-in user id if we know it (who was affected).
      //
      const userId = firebase.auth().currentUser?.uid;    // string | undefined

      // Q: is there a way to provide severity for Airbrake textual messages?

      const context = {
        severity,
        user: {
          id: userId
          // note: also '.name', '.email', '.userName' mentioned in Airbrake docs
        }
      };

      // Q: @Airbrake: is providing as a string better (with '.context') or should we create an 'Error' for these (even
      //    for levels 'info' and 'debug')?
      //
      const payload = `${msg}: ${{ ...opt, context }}`;   // anything JSON within the string is taken as parameters

      airbrake.notify(payload).then(notice => {
        if (notice.id) {
          console.info('notify successful, id:', notice.id);
        } else {
          console.error('notify failed', notice.error);
        }
      });
    }
  }

} else {    // no central logging
  logGen = _ => (msg, opt) => {}
}

const logs = {
  debug: logGen("debug"),
  info: logGen("info"),
  warn: logGen("warn"),
  error: logGen("error"),
  fatal: logGen("fatal")
}


/*
* The app interface for logging.
*
*
*/
function central(id, msg) {   // ({ level: 'debug'|'info'|'warn'|'error'|'fatal' }, string) => ()
  const { level } = id;

  if (toastThese[id]) {
    Toastify({
      text: msg,
      duration: 3000,
      //destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      close: true,
      gravity: "top", // 'top'|'bottom'
      position: 'right', // 'left'|'center'|'right'
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
      stopOnFocus: true,  // prevent dismissing of toast on hover
      onClick: () => {
        // nada
      }
    }).showToast();
  }

  logs[level](msg);
}

/*
* Logging id's
*
* Note: Use of the id's allows us to defined centrally, which get toasted (shown in the UI), and ..maybe.. in the future
*     provide translations.
*/
const testDebug = { level: 'debug' };
const testInfo = { level: 'info' };
const testWarn = { level: 'warn' };
const testError = { level: 'error' };

const toastThese = new Set([
  testDebug, testWarn   // TESTING...
]);

export {
  testDebug,
  testInfo,
  testWarn,
  testError,
  central
}
