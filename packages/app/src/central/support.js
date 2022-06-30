/*
* src/central/support.js
*/
import {getDatabase, push, ref, set, child, update, increment} from "@firebase/database"

import {getCurrentUserId} from "../user.js";

const DEV = import.meta.env.MODE .startsWith("dev");    // "dev_{local|online}"; place logs to a different database path

function fail(msg) { throw new Error(msg) }

//--- Logging ---

const loggingPath = "logging_v0";

const pushRef = push( ref( getDatabase(), `${loggingPath}${ DEV ? ":dev":"" }`));   // note: '.' not allowed in database key

function createLog(id /*, level = "info"*/) {   // (string, "info"|"warn"|"error"|"fatal") => (msg, ...) => Promise of ()

  /*
  * Send a log. Only allowed for logged-in users.
  */
  return async (msg, ...args) => {
    const uid = await getCurrentUserId()
      || fail("Central logging requires a user id, to post.");

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

//--- Counters ---

function createCounter(name) {    // (string) => (diff = 1.0, { <tag>: string|number|boolean }?) => Promise of ()

  /*
  * Note: There are two ways we can do this.
  *   1. Client sends all sub-increments, as a transaction
  *     Pro: simple
  *     Con: more transport
  *
  *   2. Client sends just one change, and a Cloud Function turns it into the sub-increments.
  *     Pro: more scalable
  *         Realtime Database still takes care of offline situations (callables wouldn't do it, needing custom logic)
  *     Con: need to maintain (and test etc.) the Cloud Function, listening to the Realtime Database changes
  *
  * Note: Potential scalability issue. If there are many users, might be best to
  */
  const WAY_1 = true;
  const MAX_TAGS = 10;

  const BASE_NAME = "counters_v0";    // "counters_v0[:dev]" / "{_|tag}"

  const countersRef = child(
    ref( getDatabase(), `${BASE_NAME}${ DEV ? ":dev":"" }`),   // note: '.' not allowed in database key
    name
  );

  return async (diff = 1.0, tags = {}) => {
    (diff >= 0.0) || fail( `Increments only: ${diff}` );

    const tagsN = Object.keys(tags).length;
    (tagsN < MAX_TAGS) || fail( `Too many tags (> ${MAX_TAGS}): ${ Object.keys(tags) }`);

    const tmp = Object.entries(tags).map( ([k,v]) => `${k}=${v}` );

    if (WAY_1) {
      const subPaths = ["_", ...tmp].map( s => `/${s}` );
      const v = increment(diff);
      const o = Object.fromEntries( subPaths.map( k => [k,v] ) );    // { "{_|tag}": increment(diff) }

      await update(countersRef, o);

    } else {
      alert("Not implemented");
    }

    console.debug("!!! Counter incremented")
  }
}


export {
  createLog,
  createCounter
}
