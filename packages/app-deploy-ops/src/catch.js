/*
* src/catch.js
*
* Catch uncaught errors and report them.
*
* Context:
*   Is loaded *before* Firebase is initialized. Initializes central logging only after 'ops/central.js' has set it up
*   (it informs us; the two know about each other).
*/
import { assert } from './assert.js'

const elFatal = document.getElementById("fatal");   // Element | ...

function isVisible(el) {
  const tmp= window.getComputedStyle(el).display;   // "block" if already shown
  return tmp !== 'none';
}

/*
* Show a banner for the first such message (because first might cause others).
*/
function revealUI(uiTitle, msg) {    // (string, string) => ()

  // Note: This is before calling 'central.fatal' in case the problem was exactly in loading of it.  (tbd. revise comment???)
  //
  if (elFatal && !isVisible(elFatal)) {
    elFatal.innerText = `${uiTitle}\n"${msg}"`;   // don't show args (just a decision)
    elFatal.style.display = 'block';
  }
}

/*
* Show a banner and log to 'central.fatal' (or place messages pending, until - hopefully - it's up).
*/
function revealUIAndLog(uiTitle, msg, ...args) {    // (string, string, ...any) => ()
  revealUI(uiTitle, msg);
  logFatal(msg, ...args);
}

let initialMsgs = [];   // Array of [msg, ...args] | null

/*
* Log to 'central.fatal' if it's initialized. Otherwise, hold to the entries until - maybe - it becomes available.
*/
let logFatal = (msg, ...args) => {
  initialMsgs.push([msg,...args]);
}

/*
* Called by 'ops/central' when it's available (no guarantee it is, an early problem may cause it not to load, in which
* case we only get the on-screen crash announcement).
*/
function centralIsAvailable( fatal ) {    // ((msg,...args) => ()) => ()

  // Catch problems within logging itself (eg. adapters), so that those won't cause eternal recursion.
  //
  function guardedFatal(...all) {   // (msg, ...args) => ()
    try {
      fatal(...all);
    }
    catch(err) {
      revealUI(true, "Failure within logging", err.reason);
      console.error("Failure within logging", err);
    }
  }

  initialMsgs.forEach( guardedFatal );
  initialMsgs = null;

  logFatal = guardedFatal;
}

/*
* Catch any (uncaught by app) exceptions; show in the UI and report to central.
*/
const noop = () => {}

const prevOnError = window.onerror || noop;
const prevOnUnhandledRejection = window.onunhandledrejection || noop;

window.onerror = function (msg, source, lineNbr, colNbr, error) {
  console.debug("onerror saw:", {msg, source, lineNbr, colNbr});    // DEBUG
    //
    // {msg: "Uncaught ReferenceError: env is not defined", source: "http://localhost:3012/worker/proxy.worker-62db5bc8…st6&max-batch-delay-ms=5000&max-batch-entries=100", lineNbr: 1307, colNbr: 16}
    // {msg: "Error: Unknown message: [object Object]", source: ".../worker/proxy.worker-...", ... }

  // Note: If the error comes from web worker, 'error' is 'undefined'

  revealUIAndLog("Unexpected ERROR", msg, { source, lineNbr, colNbr, error });

  prevOnError(arguments);
  return true;    // "prevents the firing of the default error handler" (what would that do?)
}

/*
* Catches errors that happen within a Promise.
*
* This can be essentially anything.
*/
window.onunhandledrejection = function (promiseRejectionEvent) {
  const { reason } = promiseRejectionEvent;

  console.debug("onunhandledrejection saw:", promiseRejectionEvent);    // DEBUG
    //
    // PromiseRejectionEvent{ isTrusted: true, promise: ..., reason: string }

  /*** Not needed? (different protection
  // Beware for getting in eternal loop (seen cases):
  //
  //  - "TypeError: a is not a function\n..." is likely a failure importing 'central' (a bug); skip such to avoid eternal loops.
  //
  if (/^TypeError: [a-z] is not a function/.test(reason) ||
    /_*reason.contains("Cannot be cloned")*_/ true) {
    prevOnUnhandledRejection(arguments);

 } else {
  ***/

  revealUIAndLog("Unhandled rejection", reason);
}

/*** remove
let resolveBroken;

const firebaseIsInitializedProm = new Promise( (resolve) => {   // resolves when 'canImportLogging' has been called (by 'main.js')
  resolveBroken = resolve;
})

function canImportLogging() {
  resolveBroken();
}

export { canImportLogging }
***/
export {
  centralIsAvailable
}
