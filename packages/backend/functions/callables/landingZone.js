/*
* functions/callables/landingZone.js
*
* Receive logging and counter batches from the front end. Distribute these to the logging/counter functions.
*
* Reason these two are shipped together is simply an optimization. They could be separate.
*
* Note:
*   'HttpsError' 'code' values must be from a particular set
*     -> https://firebase.google.com/docs/reference/js/firebase.functions#functionserrorcode
*
* References:
*   - "Callable functions from your app" (Firebase docs)
*     -> https://firebase.google.com/docs/functions/callable
*/
import { EMULATION, regionalFunctions_v1, HttpsError } from '../common.js'
const { https: /*as*/ rf1_https } = regionalFunctions_v1;

import { shipLogEntry } from './loggingProxy.js'
import { shipIncEntry } from './counterProxy.js'

// log: Array of { ... }
// inc: Array of { ... }
//
const landingZone_v0 = rf1_https
  .onCall(async ({ log, inc }, context) => {
    const uid = context.auth?.uid;

    /**if (!uid) {   // skip if not authenticated (doesn't seem we can define a Cloud Function that would only get called on valid users, can we?)
      throw new HttpsError('unauthenticated', "You must be logged in.");
    }**/

    // Logs and counters have no mutual relation (both can be handled in parallel).

    async function handleLogs() {
      for(const entry in log ) {    // logs need to be stored in-order
        await shipLogEntry(entry);
      }
    }

    await Promise.all(
      handleLogs(),
      Promise.all( inc.map(shipIncEntry) )    // counters can be applied in any order
    )
  });

export {
  landingZone_v0
}
