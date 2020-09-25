/*
* src/centralError.js
*
* Central error collection.
*
* Also indicates to the user (if there is a '#fatal' element to fill) that there is a problem (better than silently
* acting weird).
*
* Note: Error collection is separate from logging. These cases SHOULD NOT HAPPEN (failed asserts, etc.) and we don't
*     know more about them than what's in the 'Error' object.
*/
import { assert } from './assert.js'

const _MODE = import.meta.env?.MODE || 'production';    // default is for Rollup (no 'import.meta.env' support, yet Sep-20)
const LOCAL = _MODE === "dev_local";

import { ops } from './ops-config.js'
import { central } from './central.js'

const elFatal = document.getElementById("fatal");   // Element | ...

// Note: We have difficulties importing '@airbrake/browser' within Rollup (under Vite, it seems to work).
//
//import { Notifier } from "@airbrake/browser"    // causes problems with 'npm run prod:serve' (Rollup)

assert(_MODE === 'production' || window.Notifier);   // from the init scripts (DISABLED for prod)

let airbrake;   // 'Notifier' | undefined

if (!LOCAL) {
  // Can have multiple error handlers (good for comparing alternatives)
  //  - { }   // ignore
  //  - { type: 'airbrake', projectId: ..., projectKey: ... }   // airbrake.io
  //
  for( const o of ops.fatal ) {
    if (!o.type) {
      // skip
    } else if (o.type === 'airbrake') {
      const { projectId, projectKey } = o;
      assert(projectId && projectKey);  // 'ops-config' has already given an error message

      if (!Notifier) {
        throw new Error("Airbrake configured to be used for ops, but 'window.Notifier' not available.");
      }

      airbrake = new Notifier({
        projectId,
        projectKey,
        environment: _MODE   // 'production'|'development'
      });

    } else {
      throw new Error( `Unexpected 'fatal[].type' in ops config: ${o.type}` );
        // Note: No eternal loop - we're just loading the module.
    }
  }
}

/*
* Report an error.
*
* Returns right away. If there are problems with reporting the errors, somehow reports those (at least on the UI)
* but does not influence the caller.
*/
function centralError(err) {    // (Error) => ()

  // Collect to central monitoring

  if (airbrake) {
    (async _ => {
      central( uncaughtErrorFatal, 'Error caught', err );

      const notice = await airbrake.notify(err)
      if (notice.id) {
        console.debug('Error notified successful, id:', notice.id);
      } else {
        console.error('Error notifying an error to Airbrake', notice.error);

        //central( centralErrorNoDelivery, 'Error notifying an error to Airbrake', notice.error );

        const msg = `Error notifying an error to Airbrake: ${notice.error.message}`;
        alert(msg);
      }
    })();
  }

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
//assert (!window.onerror);   // defined. Q: Does Airbrake do this, automatically?
const prevOnError = window.onerror || (_ => {});

window.onerror = function(msg, source, lineNbr, colNbr, error) {    // other
  console.debug("Uncaught error:", {msg, source, lineNbr, colNbr, error});    // DEBUG

  centralError(error);
  prevOnError();
}

const uncaughtErrorFatal = { level: 'fatal' }

export { }
