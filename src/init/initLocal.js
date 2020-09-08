/*
* src/init/initLocal.js
*
* ONLY FOR 'dev:local' MODE.
*
* Using Firebase callables for logging. Generally a bad idea, since it requires an online connection, but suitable for
* 'dev:local', so the user does not need to worry about cloud accounts.
*/
assert( LOCAL, "Setting up Firebase callable logs from 'dev:online' or 'production'. ⛔️");

import {fns} from '../firebase/fns'
const log = fns.httpsCallable('logs_v190720');

function logGen(level) {    // (string) => (string [, object]) => ()
  return (msg, opt) => {
    log({level, msg, payload: opt})   // tbd. catch errors and report to the user
  }
}

const logs = {
  debug: logGen("debug"),
  info: logGen("info"),
  warn: logGen("warn"),
  error: logGen("error"),
  fatal: logGen("fatal")
}

window.logs = logs;

export { }

