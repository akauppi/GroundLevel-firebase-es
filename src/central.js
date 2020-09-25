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
import { assert } from './assert.js'

const _MODE = import.meta.env?.MODE || 'production';    // default is for Rollup (no 'import.meta.env' support, yet Sep-20)
const LOCAL = _MODE === "dev_local";   // note: 'import.meta.env' not defined for Rollup

import { firebase } from '@firebase/app/dist/index.esm.js'    // works; index2017.esm.js doesn't
import '@firebase/functions'

import { ops } from './ops-config.js'

// Note: Rollup has difficulties importing '@airbrake/browser' (under Vite, loads fine).
//
//import { Notifier } from "@airbrake/browser"    // causes problems with 'npm run prod:serve' (Rollup)

assert(_MODE === 'production' || window.Notifier);   // from the init scripts (DISABLED for prod)

let airbrake;   // 'Notifier' | undefined

if (!LOCAL) {
  // Can have multiple logs handlers (good for comparing alternatives)
  //  - { }   // ignore
  //  - { type: 'airbrake', projectId: ..., projectKey: ... }   // airbrake.io
  //  - { type: ... }
  //
  for( const o of ops.logs ) {
    if (!o.type) {
      // skip
    } else if (o.type === 'airbrake') {
      const { projectId, projectKey } = o;
      assert(projectId && projectKey);    // already tested by 'ops-config.js' that they exist

      if (!Notifier) {
        throw new Error("Airbrake configured to be used for ops, but 'window.Notifier' not available.");
      }

      airbrake = new Notifier({
        projectId,
        projectKey,
        environment: _MODE   // 'production'|'development'
      });

    } else {
      throw new Error( `Unexpected 'logs[].type' in ops config: ${o.type}`);
    }
  }
}

let logGen;   // (string) => (string [, object]) => ()

// tbd. if we go to FOUR REPOS model, this (and need for Firebase) would disappear.
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
  assert(airbrake.notify);

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
function central({ level }, msg, opt) {   // ({ level: 'debug'|'info'|'warn'|'error'|'fatal' }, string, object?) => ()
  //REMOVE? const s = opt === undefined ? msg : `${msg}: ${JSON.stringify(opt)}`;

  /*** disabled
  if (ops.toastThis(id)) {
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
  ***/

  console.debug(`logs[${level}]`, logs[level]); // DEBUG
  logs[level](msg, opt);
}

// EXPERIMENTAL: trying out different APIs
//
central.fatal = (msg, opt) => {
  central( { level: 'fatal' }, msg, opt);
}

export {
  central
}
