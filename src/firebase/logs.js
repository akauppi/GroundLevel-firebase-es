/*
* src/firebase/logs.js
*
* Create central logs. Used for being able to detect what's going on - and sometimes for debugging cases where
* the page refreshes (e.g. authentication flow).
*
* Reference:
*   - Write and view logs (Firebase functions docs)
*     -> https://firebase.google.com/docs/functions/writing-and-viewing-logs
*/
import {fns} from './fns'

const log = fns.httpsCallable('logs_v190720');

  //
  // in local dev: "http://localhost:5001/vue-rollup-example/europe-west3/logs_v200719"
  // in prod: ...

function logGen(level) {    // (string) => (string [, object]) => ()
  return (msg, opt) => {
    log({level, msg, payload: opt})   // tbd. catch errors and report to the user
  }
}

const logs = {
  debug: logGen("debug"),
  info: logGen("info"),
  warn: logGen("warn"),
  error: logGen("error")
}

export { logs };
