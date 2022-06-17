/*
* src/central/logs.js
*
* Client side support for central logs.
*/
import { push, set } from '@firebase/database'

import { dbRefGen } from '/@firebase/database'
import { getCurrentUserId } from '../user'

function fail(msg) { throw new Error(msg) }

const DEV = import.meta.env.MODE .startsWith("dev");    // Place development stuff to a separate logging path.

const pushRef = push( dbRefGen(`logging_v0${ DEV ? ":dev":"" }`));
  // note: '.' not allowed in key name

function createLog(id /*, level = "info"*/) {   // (string, "info"|"warn"|"error"|"fatal") => (msg, ...) => Promise of ()

  /*
  * Send a log. Only allowed for logged in users (an attempt to keep improper postings few).
  */
  return async (msg, ...args) => {
    const uid = await getCurrentUserId()
      || fail("Central logging needs the user id.");

    const entry = {
      user: uid,
      id,
      msg: msg || "",       // string
      args                  // Array of Any
      // tbd. context
    }

    await set(pushRef, entry);
  }
}

const logHey = createLog("hey!");

export {
  logHey
}
