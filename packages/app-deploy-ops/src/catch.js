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

// 'central' is still being initialized. Observe 'central.isReady' (a Promise) before referencing its other fields.
//
import { central } from '@ops/central'

/*
* Send to 'central.fatal' once it is available.
*/
async function centralFatal(msg, ...args) {

  // If the page has a '#fatal' element, show also there (always the latest message only).
  //
  // Note: This is before calling 'central.fatal' in case the problem was exactly in loading of it.
  //
  if (elFatal) {
    const errStack = args?.error?.stack;

    elFatal.innerText = `Unexpected ERROR: "${msg}"` +
      (errStack ? `\n\n${errStack}` : "");

    elFatal.classList.remove("inactive");     // tbd. too tightly coupled with 'index.html' (can we just show/hide, yet have animations??)
  }

  const f = await central.isReady.then( _ => central.fatal );

  // Note: Unlike other 'central' functions, 'central.fatal' could be 'async', and only fulfill the promise when the
  //    message has shipped.
  //
  /*await*/ f(msg, ...args);
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

  // Note: If the error comes from web worker, 'error' is 'undefined'

  centralFatal(msg, { source, lineNbr, colNbr, error });

  prevOnError(arguments);
  return true;    // "prevents the firing of the default error handler" (what would that do?)
}

window.onunhandledrejection = function (promiseRejectionEvent) {
  const { reason } = promiseRejectionEvent;

  console.debug("onunhandledrejection saw:", promiseRejectionEvent);    // DEBUG
    //
    // PromiseRejectionEvent{ isTrusted: true, promise: ..., reason: "TypeError: a is not a function" }

  // "TypeError: a is not a function\n..." is likely a failure importing 'central' (a bug); skip such to avoid eternal loops.
  //
  if (! /^TypeError: [a-z] is not a function/.test(reason)) {
    centralFatal("Unhandled Promise rejection:", reason);   // let run loosely
  }

  prevOnUnhandledRejection(arguments);

  return; // samples don't return anything; see -> https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onunhandledrejection
}

export { }
