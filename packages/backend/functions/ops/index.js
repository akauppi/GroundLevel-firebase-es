/*
* functions/ops/index.js
*
* Expects:
*   - GCLOUD_PROJECT    project id
*
* Expects (under emulation):
*   - FUNCTIONS_EMULATOR  to be defined to non-empty value
*   - DATABASE_PORT     <number>  where Realtime Database is configured; 0 for none (CI might have it so)
*
* Callable for collecting front-end metrics and logs.
*/
import { initializeApp } from 'firebase-admin/app'    // don't want to use the './firebase.js' - keep that for app
import { getDatabase, ServerValue } from 'firebase-admin/database'

import { regionalFunctions_v1 } from '../regional.js'

import { https as https_v1 } from 'firebase-functions/v1'

function fail(msg) { throw new Error(msg) }   // use at loading; not within a callable

const EMULATION = !! process.env.FUNCTIONS_EMULATOR;    // set to "true" by Firebase Emulators

const PROJECT_ID = process.env["GCLOUD_PROJECT"] || fail("No 'GCLOUD_PROJECT' env.var.");

/*** disabled
// Read from '../firebase.json' (within DC!), whether Realtime Database is set up, and what its port is.
//
const databasePort_EMUL = EMULATION &&
  await import("firebase.json").then(
    mod => mod.emulators.database?.port    // 6868 | undefined
  );
***/

const DATABASE_URL = (_ => {
  if (EMULATION) {
    // NOTE: Once Node.js 18 is supported by Cloud Functions, use 'import' (top-level await, importing a JSON..)
    //    to sniff the Realtime Database port (and whether it's enabled).
    //
    //    Until then, parsing the 'FIREBASE_DATABASE_EMULATOR_HOST' env.var. (undocumented??) is the best choice
    //    (was unable to pass DC 'environment: DATABASE_PORT=...' here, for some reason).
    //
    const tmp = process.env["FIREBASE_DATABASE_EMULATOR_HOST"];   // "0.0.0.0:6868" | undefined
    if (!tmp) {
      console.warn("'FIREBASE_DATABASE_EMULATOR_HOST' env.var. not defined - metrics and logging to Realtime Database is disabled.");
      return null;
    }

    const [_,c1] = /.+:(\d+)$/ .exec(tmp) || [];
    const databasePort = c1 ? parseInt(c1) : fail(`Unable to parse 'FIREBASE_DATABASE_EMULATOR_HOST': ${tmp}`);

    return `http://localhost:${databasePort}?ns=${PROJECT_ID}`;   // note: '?ns=...' is required!

  } else {
    return `https://${ PROJECT_ID }.firebaseio.com`
  }
})();

const db = (!DATABASE_URL) ? null : (_ => {
  // Create our own Firebase handle ("app"), because Realtime Database is only used for operations.
  //
  const app= DATABASE_URL && initializeApp({
    databaseURL: DATABASE_URL
      // tbd. this would be regional; take the URL from a Firebase Functions config (with no defaults)
  }, "2");

  return getDatabase(app);
})();

/*
* Store a received counter increment to Realtime Database.
*/
async function inc({ id, diff, at }) {    // => Promise of ()

  // tbd. Is this layout fine?  Consider multiple clients simultaneously incrementing. What are the Realtime Database
  //    restrictions - bring them here.

  const refRaw = db.ref("incoming/incs");

  await refRaw.push({
    id, diff, clientTimestamp: at
  });

  const refAggregate = db.ref(`inc/${id}`);

  await refAggregate.set( { "=": ServerValue.increment(diff) })    // Note: Tags can be added by '{k}={v}'
}

/*
* Store a received log entry to Realtime Database.
*/
async function log({ id, level, msg, args, at, uid }) {   // => Promise of ()

  const refRaw = db.ref("incoming/logs");
  await refRaw.push({ id, level, msg, args, clientTimestamp: at, uid });

  // Logs have no aggregation
}

function validateGen(t_OUTPUT, validKeys) {    // ("Inc"|"Log"|..., Array of string) => obj => ()   // may throw 'invalid-argument' or log to 'console.warn'

  // JavaScript note: 'Set' has no '.filter', and Array has no '.has' (but has '.indexOf(x) >= 0'). If Set had '.filter',
  //    we'd be able to run all with them.

  const validKeysSet = new Set(validKeys);

  return o => {
    const ks = Object.keys(o) .filter( x => x !== '' );   // Note: Cannot remove the key by '{ ...o, [""]: undefined }'
    const ksSet = new Set(ks);

    const missing = validKeys.filter( x => !ksSet.has(x) );
    const extra = ks.filter( x => !validKeysSet.has(x) );

    missing.length === 0 ||
      fail_invalid_argument(`${t_OUTPUT} entry with missing field(s): ${missing}`);

    extra.length === 0 ||
      console.warn(`${t_OUTPUT} entry with unknown field(s) (ignored):`, extra);
  }
}

const lookup = {
  inc: [validateGen("Inc", ["id","diff","at"]), inc],
  log: [validateGen("Log", ["id", "level", "msg", "args", "at"]), log]
}

/*
* { arr: Array of LogEntry|IncEntry } -> ()
*
*   IncEntry:
*     { "": "inc", id: string, diff: double (>= 0.0), at: number }
*   LogEntry:
*     { "": "log", id: string, level: "info"|"warn"|"error"|"fatal", msg: string, args: Array of any, at: number }
*
* NOTE (KEEP!!!):
*   If you need to signal errors, do it like so. Use codes only from 'FunctionsErrorCode' selection:
*     -> https://firebase.google.com/docs/reference/functions/common_providers_https#functionserrorcode
*   <<
*     throw new functions.https.HttpsError('unimplemented',"message",[...details]);
*   <<
*/
export const metricsAndLoggingProxy_v0 = regionalFunctions_v1.https
  .onCall((bulk, ctx) => {

    // Even during emulation, we get the user information from the token.
    //
    console.debug("!!! Auth context:", ctx.auth);
      /*{
      *   uid: 'dev',
      *   token: {
      *     name: 'Just Me',
      *     picture: 'https://no.such.domain',
      *     email_verified: false,
      *     auth_time: 1661716983,
      *     user_id: 'dev',
      *     firebase: [Object],
      *     iat: 1661716983,
      *     exp: 1661720583,
      *     aud: 'demo-main',
      *     iss: 'https://securetoken.google.com/demo-main',
      *     sub: 'dev',
      *     uid: 'dev'
      *   }
      * }
      */

    const uid = ctx.auth.uid || fail_unauthenticated();

    const { arr } = bulk;
    console.debug(`!!! Auth passed; taking cargo (${ arr.length } entries) from:`, uid);

    const fs = arr.map( (e,i) =>
      lookup[e[""]] || fail_invalid_argument(`No type ([""]=inc|log|...) for entry ${i}.`)
    );

    // Validate all entries, before storing any of them (just because, no harm if doing differently..)
    //
    arr.forEach( (e,i) => {
      console.debug(`!!! Validating entry:`, { e });
      fs[i][0](e);  // throws if keys not as expected
    });

    arr.forEach( (e,i) => {
      console.debug("!!! Storing entry:", { e });
      fs[i][1]({ ...e, uid });
    });

    return "ok";     // note: we don't need to return anything
  });

function fail_invalid_argument(msg) {
  throw new https_v1.HttpsError('invalid-argument', msg);
}
function fail_unimplemented() {
  throw new https_v1.HttpsError('unimplemented');
}
function fail_unauthenticated() {
  throw new https_v1.HttpsError('unauthenticated');
}
