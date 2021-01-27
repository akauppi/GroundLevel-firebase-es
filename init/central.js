/*
* init/central.js
*
* Central logging.
*
* The idea is to be able to pass logs (also offline logging, once there is a re-connection) from the client to
* a centralized location, for study.
*/
//import { assert } from './assert.js'

import { logs as opsLogs } from './opsConfig.js'
import { WrappedError } from "./WrappedError"

/*** disabled
// Note: Rollup has difficulties importing '@airbrake/browser' (under Vite, loads fine).
//
//import { Notifier } from "@airbrake/browser"    // causes problems with 'npm run prod:serve' (Rollup)

let airbrake;   // 'Notifier' | undefined
***/

// Can have multiple logs handlers (good for comparing alternatives)
//  - { }   // ignore
//  - { type: 'airbrake', projectId: ..., projectKey: ... }   // airbrake.io    DISABLED, had difficulties with it
//  - { type: ... }
//
for( const o of opsLogs ) {
  if (!o.type) {
    // skip
  /*** disabled
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
  ***/
  } else {
    throw new Error( `Unexpected 'logs[].type' in ops config: ${o.type}`);
  }
}

let logGen;   // (string) => (string [, object]) => ()

/*** disabled
if (airbrake) {
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
          const err= notice.error;

          if (err.message === "airbrake: error is filtered") {  // what is this? not even sent to Airbrake? (based on looking at 'error' details)
            console.warn('Airbrake error is filtered out by the client');
          } else {
            console.warn('Airbrake notify failed', notice.error);
          }
        }
      });
    }
  }

} else { ***/
if (true) {   // no central logging
  logGen = _ => (/*msg, opt*/) => {}
}

const lf = logGen("fatal");

const central = {
  debug: logGen("debug"),
  info: logGen("info"),
  warn: logGen("warn"),
  error: logGen("error"),

  fatal: (msg, opt) => {    // (msg,object|XxxError|undefined) => Error;    use as 'throw central.fatal(...,{ opt } | err)'
    if (opt instanceof Error) {
      lf(msg, { error: opt });    // #tune

      return new WrappedError(msg,opt);
    } else {
      lf(msg,opt);
      return new Error( `${msg} ${ JSON.stringify(opt) }` );
    }
  }
}

export {
  central
}
