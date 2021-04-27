/*
* src/catch.js
*
* Catch uncaught errors and report them.
*
* Note: This is imported by 'main.js, statically. The idea is that during launch, any fatal errors get caught.
*
* Loads '@ops/central' (which is otherwise only used from application code) lazily. IF there are problems not related
* to loading central itself, keep those until central is available.
*
* Also indicates to the user (shows and fills the '#fatal' element) that there is a problem.
*/
import { assert } from './assert.js'

const elFatal = document.getElementById("fatal");   // Element | ...

import { fatalProm } from '@ops/central'

function isVisible(el) {
  const tmp= window.getComputedStyle(el).display;   // "block" if already shown
  return tmp !== 'none';
}

/*
* Send to 'central.fatal' once it is available.
*/
async function centralFatal(uiTitle, msg, { source, lineNbr, colNbr, error }) {

  // If the page has a '#fatal' element, show also there (always the FIRST message only, since a failure can lead to
  // others).
  //
  // Note: This is before calling 'central.fatal' in case the problem was exactly in loading of it.
  //
  if (elFatal && !isVisible(elFatal)) {
    const s = msg;
    elFatal.innerText = `${uiTitle}\n"${s}"`;
    elFatal.style.display = 'block';
  }

  // If the error is from proxy-worker (adapter internals), let's not even consider feeding it to 'central.log'.
  // This may be errors during loading of the worker.
  //
  if (source && source.includes("/worker/")) {
    console.warn("Skipping sending this to 'central.fatal':", msg, { source, lineNbr, colNbr, error });
    return;
  }

  // Catch errors that would happen within calling 'central.fatal' (via adapters), so that there's no eternal looping.
  //
  try {
    const f = await fatalProm;

    // Note: Unlike other 'central' functions, 'central.fatal' could be 'async', and only fulfill the promise when the
    //    message has shipped.
    //
    /*await*/ f(msg, { source, lineNbr, colNbr, error });
  }
  catch(err) {
    // Seen:
    //    - DataCloneError: The object cannot be cloned.

    console.error("Failure calling 'central.fatal':", err);
  }
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

  centralFatal("Unexpected ERROR", msg, { source, lineNbr, colNbr, error });

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

  centralFatal("Unhandled rejection", reason, {});   // let run loosely
}

export { }
