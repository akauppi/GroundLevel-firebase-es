/*
* functions/ops/index.js
*
* Callable for collecting front-end metrics and logs.
*/
import { initializeApp } from 'firebase-admin/app'    // don't want to use the './firebase.js' - keep that for app
import { getDatabase, ServerValue } from 'firebase-admin/database'

import { regionalFunctions_v1 } from '../regional.js'

import { https as https_v1 } from 'firebase-functions/v1'

function fail(msg) { throw new Error(msg) }   // use at loading; not within a callable

const PROJECT_ID = process.env["GCLOUD_PROJECT"] || fail("No 'GCLOUD_PROJECT' env.var.");

/*
* Create our own Firebase handle ("app"), because Realtime Database is only used for operations.
*/
const app= initializeApp({
  databaseURL: `https://${ PROJECT_ID }.firebaseio.com`
    // tbd. this would be regional; take the URL from a Firebase Functions config (with no defaults)
}, "2");

const db = getDatabase(app);

/*
* Store a received counter to Realtime Database.
*/
async function counter({ id, diff, at }) {    // => Promise of ()

  const refRaw = db.ref("incoming/counts");

  await refRaw.push({
    id, diff, clientTimestamp: at
  });

  const refAggregate = db.ref(`counts/${id}`);    // Note: likely not sharing the doc with other counters would cause less collisions

  await refAggregate.set( { "=": ServerValue.increment(diff) })    // Note: Tags can be added by '{k}={v}'
}

function log({ id, level, msg, args, at, uid }) {   // => Promise of ()

  fail_unimplemented();
}

const lookup = {
  counter,
  log
}

function validateGen(t, vks) {    // (string, Array of string) => obj => ()   // may throw 'invalid-argument' or log to 'console.warn'
  const validKeys = new Set(vks);

  return o => {
    const ks = Object.keys(o);

    const missing = validKeys.filter( ks.has );
    const extra = ks.filter( x => !validKeys.has(x) );

    missing.length === 0 ||
      fail_invalid_argument(`${t} entry with missing fields: ${missing}`);

    extra.length === 0 ||
      console.warn(`${t} entry with unknown fields: ${extra}`);
  }
}

const validationLookup = {
  counter: validateGen("Counter", ["id","diff","at"]),
  log: validateGen("Log", ["id", "level", "msg", "args", "at"])
}

/*
* { arr: Array of LogEntry|CounterEntry } -> "ok"
*
*   CounterEntry:
*     { "": "counter", id: string, diff: double (>= 0.0), at: number }
*   LogEntry:
*     { "": "log", id: string, level: "info"|"warn"|"error"|"fatal", msg: string, args: ..., at: number }
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
    const { uid } = ctx.auth;

    if (!uid) {
      throw new https_v1.HttpsError('unauthenticated',"");
    }

    const { arr } = bulk;
    console.debug(`!!! Auth passed; taking cargo (${ arr.length } entries) from:`, uid);

    // Validate all entries first
    //
    arr.forEach( (e,i) => {
      const vf = validationLookup[e[""]] || fail_invalid_argument(`No type ([""]=counter|log|...) for entry ${i}.`);
      vf(e);  // throws if keys not as expected
    })

    arr.forEach( (e,i) => {
      const f = lookup[e[""]] || fail_invalid_argument(`No type ([""]=counter|log|...) for entry ${i}.`);
      f({ ...e, uid });
    })

    return "ok";    // note: we don't need to return anything
  });

function fail_invalid_argument(msg) {
  throw new https_v1.HttpsError_v1('invalid-argument', msg);
}
function fail_unimplemented() {
  throw new https_v1.HttpsError('unimplemented');
}
