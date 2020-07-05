/*
* src/firebase/logs.js
*
* Create central logs. Used for being able to detect what's going on - and sometimes for debugging cases where
* the page refreshes (e.g. authentication flow).
*/
assert(firebase.functions);


import { functionsRegion } from '../config';

const log = firebase.app().functions(functionsRegion).httpsCallable('logs_v1');

function logGen(level) {    // (string) => (string) => ()
  return (msg) => {
    log({level, msg})   // tbd. catch errors and report to the user
  }
}

const logs = {
  debug: logGen("debug"),
  info: logGen("info"),
  warn: logGen("warn"),
  error: logGen("error")
}

export { logs };
