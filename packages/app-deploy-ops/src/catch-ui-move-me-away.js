/*
* src/catch-ui.js
*
* Catch uncaught errors and report them also on the UI.
*
* This is detached from the 'ops' management, only for the local user to know things aren't nominal.
*
* Note:
*   - consider if this should be in the 'app' (likely) instead of here. tbd.
*     ..or even as a web component (and then the app can decide whether they wish to use it!)
*/
const elFatal = document.getElementById("fatal");   // Element | ...

function isVisible(el) {
  const tmp= window.getComputedStyle(el).display;   // "block" if already shown
  return tmp !== 'none';
}

/*
* Show a banner for the first such message (because first might cause others).
*/
function revealUI(uiTitle, msg) {    // (string, string) => ()

  if (elFatal && !isVisible(elFatal)) {
    elFatal.innerText = `${uiTitle}\n"${msg}"`;   // don't show args (just a decision)
    elFatal.style.display = 'block';
  }
}

/*
* Catch any (uncaught by app) exceptions; show in the UI.
*/
const prevOnError = window.onerror;

window.onerror = function (msg, source, lineNbr, colNbr, error) {
  console.debug("onerror saw:", {msg, source, lineNbr, colNbr});    // DEBUG
    //
    // {msg: "Uncaught ReferenceError: env is not defined", source: "http://localhost:3012/worker/proxy.worker-62db5bc8…st6&max-batch-delay-ms=5000&max-batch-entries=100", lineNbr: 1307, colNbr: 16}
    // {msg: "Error: Unknown message: [object Object]", source: ".../worker/proxy.worker-...", ... }

  // Note: If the error comes from web worker, 'error' is 'undefined'

  revealUI("Unexpected ERROR", msg);

  if (prevOnError) prevOnError(arguments);
  //return true;    // "prevents the firing of the default error handler" (what would that do?)
}

/*
* Catches errors that happen within a Promise.
*
* This can be essentially anything.
*/
const prevOnUnhandledRejection = window.onunhandledrejection;

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

  revealUI("Unhandled Promise rejection", reason);

  if (prevOnUnhandledRejection) prevOnUnhandledRejection(arguments);
}
