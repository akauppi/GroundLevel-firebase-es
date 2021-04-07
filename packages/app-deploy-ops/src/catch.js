/*
* src/catch.js
*
* Catch uncaught errors and report them.
*
* Also indicates to the user (shows and fills the '#fatal' element) that there is a problem.
*
* Note: We *can* integrate this with 'central' logging; it is up to the operational preferences whether a crash
*     should be seen in both log collection and crash reporting. #later
*/
import { assert } from './assert.js'
import { central } from '@ops/central'

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

  central.fatal("Unhandled Promise rejection:", reason);

  // tbd. if these occur in real life, add the showing of '#fatal' (or would 'central' do that, that'd be sweet)!

  prevOnUnhandledRejection(arguments);

  // Samples don't return anything; see -> https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onunhandledrejection
}

export { }
