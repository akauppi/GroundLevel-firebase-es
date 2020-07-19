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
import {functionsRegion} from "../config";

assert(firebase.functions);

// In order for local emulation to work, there must NOT be any regions.
//
// NOTE: If you give emulated a region, things will just silently stop working! (would be appropriate to get browser
//    console errors)
//
const fns = window.LOCAL ? firebase.app().functions(/*functionsRegion*/) :
  firebase.app().functions(functionsRegion);

const log = fns.httpsCallable('logs_v200719');

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
