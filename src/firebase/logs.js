/*
* src/firebase/logs.js
*
* Create central logs. Used for being able to detect what's going on - and sometimes for debugging cases where
* the page refreshes (e.g. authentication flow).
*/

// tbd. Should we use 'callables' or HTTPS?

const log = firebase.functions().httpsCallable('logs2');

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
