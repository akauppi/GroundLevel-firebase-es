/*
* adapters/logging/cfProxy.js
*
* Provide means to log to Google Cloud Logging, via the app's Cloud Functions backend.
*
* Note:
*   Must implement batching of logs and support for offline mode.
*/
import { httpsCallable } from '@firebase/functions'
import { fnsRegional } from '/@src/fns'   // handle to Firebase Cloud Functions; with region

const logs_v1 = httpsCallable(fnsRegional,"logs_v1");

function createLogger(/*{ maxBatchDelayMs = 123, maxBatchSize = 2000 }*/) {

  // tbd.
  console.warn("'cfProxy logging: OFFLINE MODE and batching of log entries (optimization) not implemented, yet.");

  /*
  * Schedule a logging entry. These are collected together for a while, and also over offline conditions.
  */
  function log(level, msg, payload) {   // ("debug"|"info"|"warn"|"error"|"fatal", string, object?) => ()

    const t = Date.now();   // time now, in Epoch ms's

    /*** not yet (feature pending)
    if (pending.length < maxBatchSize) {
      pending.push({level, msg, t, payload});
    } else {
      // tbd. give once a console warning about exceeding the limit
    }
    ***/

    logs_v1([{ level, msg, payload, created: t }]).then( (res) => {
      // Logging went fine
    }).catch( err => {
      // tbd. We could have some user-visible panel coming up if there are real errors. Better to show we're failing.
      //
      console.error("Unable to deliver central log(s):", err);
    })
  }

  return {
    log
  }
}

export {
  createLogger
}
