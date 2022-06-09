/*
* functions/callables/loggingProxy.js
*
* Proxy for passing log entries to Cloud Logging (or showing them among the emulator console, if emulated).
*/

import { Logging } from '@google-cloud/logging'

import { EMULATION, regionalFunctions_v1, HttpsError } from '../common.js'
const { https: /*as*/ rf1_https } = regionalFunctions_v1;

function failWhileLoading(msg) { throw new Error(msg) }

function failInvalidArgument(msg) {
  throw new HttpsError('invalid-argument',msg);
}

//---
// Cloud Logging does not support delivery of logs directly from browsers. They need to be routed through us.
// This allows/requires? to e.g. limit logging to authenticated users only, or provide other kinds of throttling.
//
// The data schema is Cloud Logging's 'LogEntry':
//  -> https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry
//
// References:
//    - Logging Client Libraries
//      https://cloud.google.com/logging/docs/reference/libraries
//    - Cloud Logging > Basic Concepts > Log Entries
//      https://cloud.google.com/logging/docs/basic-concepts#log-entries

// Receive an array of logging messages. The front end batches them together to reduce the number of calls, but also
// for the sake of offline gaps.
//
// les: Array of 'LogEvent'
//
//    LogEvent:
//    {
//      severity: "INFO"|"WARNING"|"ERROR"|"CRITICAL"
//      timestamp: ISO 8601 string, eg. "2021-05-02T15:08:09.073Z"
//      jsonPayload: {
//        msg: string,
//        args: Array of any
//      }
//    }
//
// ignore: undefined | true | string
//    provided if the logging arises from:
//      - tests
//      - 'npm run serve' under localhost
//
//    tbd. <write about 'ignore'>   WAS: If so, place the logs in another log, keeping the production log prestine (otherwise 1-to-1 behaviour!)

/*
* EMULATION variant
*
* Used when running against locally emulated Cloud Functions:
*   - backend 'npm test'
*   - app 'dev[:local]'
*
* Logs using Cloud Function 'logger' (since we don't have Cloud Logging credentials, nor want to rely on online-needing
* services).
*/
const cloudLoggingProxy_v0_EMUL = EMULATION && await (async () => {

  const ffLogger = await import('firebase-functions/v1').then( mod => mod.logger );

  const backLookup = new Map([   // 'LogEvent' '.severity' to Cloud Function logging level
    ['INFO','info'],
    ['WARNING','warn'],
    ['ERROR','error'],
    ['CRITICAL','error']    // no 'logger.fatal' in Cloud Functions
  ]);

  return (les, { _ }) => {    // (Array of LogEntry, { }) => true
    function failLE(prefix) { failInvalidArgument(`${prefix} ${ JSON.stringify(les) }`); }

    les.forEach(le => {
      const level = backLookup.get(le.severity) || failLE("Unexpected 'severity' in:");
      const timestamp = le.timestamp || failLE("No 'timestamp' in:");
      const msg = le.jsonPayload?.msg || failLE("No 'jsonPayload.msg' in:");
      const args = le.jsonPayload?.args;    // omit from output if not there

      ffLogger[level](msg, {timestamp, ...(args ? {args} : {})});
    })

    return true;    // to help tests and make sure the emulation variant was run
  }
})();

/*
* REAL variant
*
* Used by:
*   - 'dev:online' (with 'ignore' marker in the calls)
*   - 'npm serve' (with 'ignore' marker in the calls)
*   - production deployed front-end
*
* Firebase provides credentials automatically so that we can use Cloud Logging APIs in production.
*/
const cloudLoggingProxy_v0_PROD = (!EMULATION) && (_ => {
  // GCP project id is the same as Firebase project id
  const projectId = process.env.GCLOUD_PROJECT || failWhileLoading("Env.var 'GCLOUD_PROJECT' not available!");

  const logging = new Logging({ projectId });    // @google-cloud/logging

  // Note: The same implementation takes in both production and development ('ignore == true') logs.    <-- tbd. Do we need the 'ignore'? Let's provide stage support!!
  //
  const appLog = logging.log('app-central');
  const appLog2 = logging.log('app-central.ignore');    // logs from development client

  return (les, {ignore,uid}) => {
    const log = (!ignore) ? appLog:appLog2;
    const les2 = les.map( le => ({ ...le, jsonPayload: { ...le.jsonPayload, uid } }));    // attach 'uid' to payload

    const prom = log.write(les2);

    prom.then(_ => {
      //logger.info(`Logged to ${log.name}: ${les.size()} entries`);
    }).catch(err => {
      console.error("Failure to ship application logs:", err);
    })
  }
})();

const f = cloudLoggingProxy_v0_PROD || cloudLoggingProxy_v0_EMUL;

const cloudLoggingProxy_v0 = rf1_https
  .onCall(({ les, ignore }, context) => {
    const uid = context.auth?.uid;

    /**if (!uid) {   // skip if not authenticated
      throw new HttpsError('unauthenticated', "You must be logged in.");
    }**/

    console.debug("Logging request from:", uid || "(unknown user)");

    return f(les, { ignore, uid });
  });

export {
  cloudLoggingProxy_v0
}
