/*
* functions/ops/index.js
*
* Expects (under emulation):
*   - FIREBASE_CONFIG     where Realtime Database is configured
*
* Callable for collecting front-end metrics and logs.
*
* References:
*   - "Call functions from your app [v2 beta]"
*     -> https://firebase.google.com/docs/functions/beta/callable
*/
import { initializeApp } from 'firebase-admin/app'    // don't want to use the './firebase.js' - keep that for app
import { getDatabase, ServerValue } from 'firebase-admin/database'

import { EMULATION } from '../config.js'

import https, { HttpsError } from 'firebase-functions/v2/https'

function fail_at_load(msg) { throw new Error(msg) }   // use at loading; NOT within a callable!!

const DATABASE_URL = (_ => {
  if (EMULATION) {
    const tmp = process.env["FIREBASE_CONFIG"] || fail_at_load("No 'FIREBASE_CONFIG' env.var.");
      // {"storageBucket":"demo-main.appspot.com","databaseURL":"http://127.0.0.1:6869/?ns=demo-main","projectId":"demo-main"}

    const { databaseURL } = JSON.parse(tmp);
    return databaseURL || fail_at_load(`No 'databaseURL' in 'FIREBASE_CONFIG': ${tmp}`);

    /*** OLD; may be removed
    // NOTE: Once Node.js 18 is supported by Cloud Functions, use 'import' (top-level await, importing a JSON..)
    //    to sniff the Realtime Database port (and whether it's enabled).
    //
    //    Until then, parsing the 'FIREBASE_DATABASE_EMULATOR_HOST' env.var. (undocumented??) is the best choice
    //    (was unable to pass DC 'environment: DATABASE_PORT=...' here, for some reason).
    //
    //    tbd. Rather, use the import 'firebase-functions/params' but it doesn't currently (4.0.1) work.
    //
    const tmp = process.env["FIREBASE_DATABASE_EMULATOR_HOST"];   // "0.0.0.0:6868" | undefined
    if (!tmp) {
      // Only using Realtime Database on the 'emul-for-app' backend; not plain backend. no need to warn.
      //console.warn("'FIREBASE_DATABASE_EMULATOR_HOST' env.var. not defined - metrics and logging to Realtime Database is disabled.");
      return null;
    }

    const [_,c1] = /.+:(\d+)$/ .exec(tmp) || [];
    const databasePort = c1 ? parseInt(c1) : fail_at_load(`Unable to parse 'FIREBASE_DATABASE_EMULATOR_HOST': ${tmp}`);

    return `http://localhost:${databasePort}?ns=${PROJECT_ID}`;   // note: '?ns=...' is required!
    ***/
  } else {
    const PROJECT_ID = process.env["GCLOUD_PROJECT"] || fail_at_load("No 'GCLOUD_PROJECT' env.var.");

    return `https://${ PROJECT_ID }.firebaseio.com`;
  }
})();
  // tbd. replace with (once works):
  //import { projectId, databaseUrl } from 'firebase-functions/params'

const db = (!DATABASE_URL) ? null : (_ => {
  // Create our own Firebase handle ("app"), because Realtime Database is only used for operations.
  //
  const app= initializeApp({
    databaseURL: DATABASE_URL
      // tbd. this would be regional; take the URL from a Firebase Functions config (with no defaults)
  }, "2");

  return getDatabase(app);
})();

/*
* Store a counter increment.
*/
async function inc({ id, inc, ctx }) {    // => Promise of ()

  // tbd. Is this layout fine?  Consider multiple clients simultaneously incrementing. What are the Realtime Database
  //    restrictions - bring them here.

  const refRaw = db.ref("incoming/incs");
  await refRaw.push({ id, inc, ctx });

  const refAggregate = db.ref(`inc/${id}`);
  await refAggregate.set( { "=": ServerValue.increment(inc) })    // Note: Tags can be added by '{k}={v}'
}

/*
* Store a log entry.
*/
async function log({ id, level, msg, args, ctx }) {   // => Promise of ()
  const refRaw = db.ref("incoming/logs");
  await refRaw.push({ id, level, msg, args, ctx });

  // Logs have no aggregation
}

/*
* Store a statistical sample.
*/
async function obs({ id, obs, ctx }) {   // => Promise of ()
  const refRaw = db.ref("incoming/obs");
  await refRaw.push({ id, obs, ctx });

  // Not doing an aggregation. Doing such would need knowledge about bucketing (i.e. rate of incoming observations).
  // That can vary - better have the visualization tools handle that.
}

function validateGen(t_OUTPUT, validKeys) {    // ("Inc"|"Log"|..., Array of string) => obj => ()   // may throw 'invalid-argument' or log to 'console.warn'

  // JavaScript note: 'Set' has no '.filter', and Array has no '.has' (but has '.indexOf(x) >= 0'). If Set had '.filter',
  //    we'd be able to run all with them.

  const validKeysSet = new Set(validKeys);

  return o => {
    const ks = Object.keys(o);
    const ksSet = new Set(ks);

    const missing = validKeys.filter( x => !ksSet.has(x) );
    const extra = ks.filter( x => !validKeysSet.has(x) );

    missing.length === 0 ||
      fail_invalid_argument(`${t_OUTPUT} entry with missing field(s): ${missing}`);

    extra.length === 0 ||
      console.warn(`${t_OUTPUT} entry with unknown field(s) (ignored):`, extra);
  }
}

const incValidate = validateGen("Inc", ["id","inc","ctx"]);
const logValidate = validateGen("Log", ["id","level","msg","args","ctx"]);
const obsValidate = validateGen("Obs", ["id","obs","ctx"]);

/*
* Create a validator to check:
*   - 'o' are of one expected type
*   - 'ctx.uid' (if provided) matches with the user authenticated with (impersonation would be malign)
*
*   If all is well, the validator provides a function for storing the entry.
*/
function pickTypeGen(realUid) {   // (string) => ({...}, integer) => () => ()

  return (o,i) => {   // ({...}, integer) => () => ()

    // Context is the same for all types
    //
    const claimedUid = o.ctx.uid;   // undefined | string
    if (claimedUid && claimedUid !== realUid) {
      fail_invalid_argument(`Claimed uid (in the data) and the one used in the call clash: ${claimedUid} !== ${realUid}`);
    }

    if (o.inc) {
      incValidate(o);
      return _ => inc( conv_blurUid(o) );
    } else if (o.level) {
      logValidate(o);
      return _ => log( conv(o) );
    } else if (o.obs) {
      obsValidate(o);
      return _ => obs( conv_blurUid(o) );
    } else {
      fail_invalid_argument(`Unexpected entry #${i}: ${o}`);
    }
  }

  /*
  * Blur '.ctx.uid' for operations we don't think need user-by-user storage.
  *
  * Still keeping the knowledge whether a user was logged in; this allows filtering guests (no uid).
  *
  * Also does what the plain 'conv' does.
  */
  function conv_blurUid(o) {
    return conv({ ...o, ctx: { ...o.ctx, uid: o.ctx.uid ? true : undefined } });
  }

  /*
  * Remove entries with 'undefined' value, e.g. 'ctx.uid'. They are not tolerated by Realtime Database.
  *
  * Note: Alternatively, we could use nulls.
  */
  function conv(o) {
    const tmp = Object.entries(o)
      .filter( ([_,v]) => v !== undefined )
      .map(([k,v]) => [k, (typeof v === "object") ? conv(v) : v] );

    return Object.fromEntries(tmp);
  }
}

/*
* { arr: Array of IncEntry|LogEntry|ObsEntry } -> ()
*
*   IncEntry: { id: string, inc: double (>= 0.0), ctx: Ctx }
*   LogEntry: { id: string, level: "info"|"warn"|"error"|"fatal", msg: string, args: Array of any, ctx: Ctx }
*   ObsEntry: { id: string, obs: double, ctx: Ctx }
*
*        Ctx: { clientTimestamp: number, stage?: string, release?: string, uid?: string, ... }
*
* NOTE (KEEP!!!):
*   If you need to signal errors, do it like so. Use codes only from 'FunctionsErrorCode' selection:
*     -> https://firebase.google.com/docs/reference/functions/common_providers_https#functionserrorcode
*   <<
*     throw new functions.https.HttpsError('unimplemented',"message",[...details]);
*   <<
*
* Curl sample:
*   <<
*     $ export TOKEN=eyJhb....319fQ.
*     $ curl -X POST -v -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
*       http://localhost:5003/demo-main/us-central1/metricsAndLoggingProxy_v0 -d '{ "data": {"arr": [{ "id": "a", "inc": 0.1, "ctx": { "clientTimeStamp": 123, "uid": "goofy" }}]} }'
*   <<
*/
const metricsAndLoggingProxy_v0 = https.onCall(callableRequest => {
  const { data, auth /*,app, instanceToken*/ } = callableRequest;

  if (EMULATION) {    // Use a special value for just waking up (no logs created)
    if (data === "wakeup") {
      return;
    }
  }

  const realUid = auth.uid || fail_unauthenticated();

  const { arr } = data;
  arr || fail_invalid_argument("Missing 'arr': Array of { id, inc|level|obs, ... }");

  //console.debug(`!!! Auth passed; taking cargo (${ arr.length } entries) from:`, realUid);

  // Validate all entries, get functions for storing them.
  arr.map( pickTypeGen(realUid) )
    .forEach( f => f() );

  //return;   // note: we don't need to return anything
});

function fail_invalid_argument(msg) {
  throw new HttpsError('invalid-argument', msg);
}
/*function fail_unimplemented() {
  throw new HttpsError('unimplemented', "");
}*/
function fail_unauthenticated() {
  throw new HttpsError('unauthenticated', "");
}

// Cloud Functions v2 only allow "lower case, numbers and hyphens" in function names.
//
export default {
  ["metrics-and-logging-proxy-v0"]: db ? metricsAndLoggingProxy_v0 : null
}
