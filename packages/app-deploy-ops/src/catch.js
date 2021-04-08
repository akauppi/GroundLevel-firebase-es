/*
* src/catch.js
*
* Catch uncaught errors and report them.
*
* Also indicates to the user (shows and fills the '#fatal' element) that there is a problem.
*
* Note: We *can* integrate this with '@ops/central' logging, but it is not imperative. It is up to the operational preferences
*     whether a crash should be seen in both log collection and crash reporting.
*/
import { assert } from './assert.js'

const elFatal = document.getElementById("fatal");   // Element | ...

/*** #rework
// Can have multiple error handlers (good for comparing alternatives)
//  - { }   // ignore
//  - { type: 'xxx', projectId: ..., projectKey: ... }
//
for( const o of opsCrashes ) {
  if (!o.type) {
    // skip

  } else {
    throw new Error( `Unexpected 'fatal[].type' in ops config: ${o.type}` );
      // Note: No eternal loop - we're just loading the module.
  }
}
***/

/*
* Report an error.
*
* Returns right away. If there are problems with reporting the errors, somehow reports those (at least on the UI,
* maybe central logging) but does not influence the caller.
*/
function hub(err) {    // (Error) => ()

  // Always show in browser console
  //
  console.error("Unexpected error:", err);

  // If the page has a '#fatal' element, show also there (always the latest message only).
  //
  if (elFatal) {
    elFatal.innerText = `Unexpected ERROR: "${err.stack}"`;
    elFatal.classList.remove("inactive");     // tbd. too tightly coupled with 'index.html' (can we just show/hide, yet have animations??)
  }
}

/*
* Integration with '@ops/central' (if used), is *lazy* on purpose.
*
* '@ops/central' is mainly intended for the app's logging. This allows us to be imported by 'main.js' statically,
* early on, without pulling also '@ops/central' with us - when we don't even need it yet, unless something goes bad
* before the app launches.
*
* Note: We don't *actually* know when the message would have been sent to the back end logging. Logging has its own
*   adapters and what not: '.fatal' returning only means the log entry is on the way.
*/
async function centralFatal(...args) {
  const central = await import('@ops/central').then( mod => mod.central );
  central.fatal(...args);
}

/*
* Catch any (uncaught by app) exceptions; show in the UI and report to central.
*/
const noop = () => {}

const prevOnError = window.onerror || noop;
const prevOnUnhandledRejection = window.onunhandledrejection || noop;

// BUG:
//    Errors during application loading (e.g. press 'MakeError' right after load) don't seem to reach here.
//    But once the app is up, they do. Bearable, for now. #help
//
window.onerror = function (msg, source, lineNbr, colNbr, error) {
  console.debug("centralError saw:", {msg, source, lineNbr, colNbr});    // DEBUG

  hub(error);

  prevOnError(arguments);
  return true;    // "prevents the firing of the default error handler" (what would that do?)
}

window.onunhandledrejection = function (promiseRejectionEvent) {
  const { reason } = promiseRejectionEvent;

  console.debug("centralError saw:", promiseRejectionEvent);    // DEBUG

  centralFatal("Unhandled Promise rejection:", reason);   // let run loosely

  // tbd. if these occur in real life, add the showing of '#fatal' (or would 'central' do that, that'd be sweet)!

  prevOnUnhandledRejection(arguments);

  // Samples don't return anything; see -> https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onunhandledrejection
}

export { }
