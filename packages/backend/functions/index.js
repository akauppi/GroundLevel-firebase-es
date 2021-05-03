/*
* functions/index.js
*
* Cloud Functions for our app.
*
* Back-end chores like moving data when triggered.
*
* Note! If one's front end code uses callables, it is no longer tolerant to offline work. Using Firestore with the
*     official client is; thus rather deal with database as the interface.
*
* ES modules support:
*   - [x] Cloud Functions supports node.js 14
*   - [ ] Firebase Emulator allows Cloud Functions to be expressed as ECMAScript modules (not yet)
*   - [ ] 'firebase-functions' and 'firebase-admin' are available as ESM exports (not yet)
*
* Configuration:
*   For production regional deployments, mention your region:
*     regions.0: e.g. "europe-west6"
*
* Note:
*   'HttpsError' 'code' values must be from a particular set
*     -> https://firebase.google.com/docs/reference/js/firebase.functions#functionserrorcode
*
* References:
*   - Call functions from your app (Firebase docs)
*     -> https://firebase.google.com/docs/functions/callable
*   - Add the Firebase Admin SDK to your server (Firebase docs)
*     -> https://firebase.google.com/docs/admin/setup
*/
const functions = require('firebase-functions');
//import * as functions from 'firebase-functions';
const logger = functions.logger;    // for backend logging

const admin = require('firebase-admin');
//import * as admin from 'firebase-admin';

const { Logging } = require('@google-cloud/logging');
// import { Logging } from '@google-cloud/logging'

function fail(msg) { throw new Error(msg); }

const EMULATION = !! process.env.FUNCTIONS_EMULATOR;    // "true"|...
//const BACKEND_TEST = !! process.env.BACKEND_TEST;   // to differentiate between backend 'npm test' and use in app development

admin.initializeApp();

/*
* For production (not emulation) and deploying to a region, provide the region where the Firebase project has been set up.
*/
function prodRegion() {   // () => string|null
  const arr = functions.config().regions;
  const ret = arr && arr[0];
  return ret;
}

// To have your Functions work, if you chose *ANY* other location than 'us-central1', you need to mention the region
// in CODE (that's against good principles of programming; this should be a CONFIGURATION!!!)
//
// See -> https://stackoverflow.com/questions/43569595/firebase-deploy-to-custom-region-eu-central1#43572246
//
const regionalFunctions = EMULATION ? functions : (() => {
  const reg = prodRegion();
  return !reg ? functions : functions.region(reg);
})();

/*** #rework tbd. Tie to authentication, instead
// UserInfo shadowing
//
// Track changes to global 'userInfo' table, and update projects where the changed user is participating with their
// renewed user info.
//
exports.userInfoShadow_2 = regionalFunctions.firestore
  .document('/userInfo/{uid}')
  .onWrite( async (change, context) => {
    const [before,after] = [change.before, change.after];   // [QueryDocumentSnapshot, QueryDocumentSnapshot]

    const db = admin.firestore();

    const uid = change.after.id;

    const newValue = after.data();      // { ... } | undefined
    console.debug(`Global userInfo/${uid} change detected: `, newValue);

    // Removal of userInfo is not propagated. Only tests do it, as 'beforeAll'.
    //
    if (newValue !== undefined) {

      // Find the projects where the person is a member.
      //
      // tbd. Once we're operational, consider whether having 'userInfo' within the project document is considerably
      //    cheaper. #rework #monitoring #billing
      //
      const qss = await db.collection('projects')
        .where('members', 'array-contains', uid)
        .select()   // don't ship the fields, just matching ref
        .get();

      if (qss.size === 0) {
        console.debug(`User '${uid}' not found in any of the projects.`);

      } else {
        const proms = qss.docs.map( qdss => {
          console.debug(`Updating userInfo for: projects/${qdss.id}/userInfo/${uid} ->`, newValue);

          return qdss.ref.collection("userInfo").doc(uid).set(newValue);    // Promise of WriteResult
        });
        await Promise.all(proms);
      }
    }
  });

// UserInfo cleanup
//
// Occasionally, see if there are projects where users have left, but their userInfo sticks around.
//
/_** tbd. likely not doing it so. Could track all changes to '.members'. If a uid is removed, remove the data
*     immediately also from 'userInfo'. Or... the removal of a user can do that. :)
*
exports.userInfoCleanup = regionalFunctions.pubsub.schedule('once a day')   // tbd. syntax?
  .onRun( async context => {

    /*** tbd. continue:
     * will likely need to scan through all projects, no 'where' that could do:
     *
     * - find projects where
     *    - /userInfo/{uid} exists
     *        - where the 'uid' is not within '.admins' or '.collaborators'
     *
    await admin.firestore().collection("/projects").where(

     ***_/
  })
*_/
***/

// --- Logging
//
// Cloud Logging does not support delivery of logs directly from browsers. They need to be routed through us.
// This allows us to e.g. limit logging to authenticated users only, or provide other kinds of throttling.
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
//    If so, place the logs in another log, keeping the production log prestine (otherwise 1-to-1 behaviour!)

/*
* EMULATION variant
*
* Used when running against locally emulated Cloud Functions:
*   - backend 'npm test'
*   - app 'npm run dev[:local]'
*   - app 'npm run dev:online'    <-- tbd. currently using its own logging server.
*
* Logs using Cloud Function 'logger' (since we don't have Cloud Logging credentials, nor want to rely on online-needing
* services).
*/
const cloudLoggingProxy_v0_EMUL = EMULATION && (les => {

  const backLookup = new Map([   // 'LogEvent' '.severity' to Cloud Function logging level
    ['INFO','info'],
    ['WARNING','warn'],
    ['ERROR','error'],
    ['CRITICAL','error']    // no 'logger.fatal' in Cloud Functions
  ]);

  les.forEach( le => {
    function failLE(prefix) { fail(`${prefix} ${ JSON.stringify(le) }`); }

    const level = backLookup.get(le.severity) || failLE("Unexpected 'severity' in:");
    const timestamp = le.timestamp || failLE("No 'timestamp' in:");
    const msg = le.jsonPayload?.msg || failLE("No 'jsonPayload.msg' in:");
    const args = le.jsonPayload?.args;    // omit from output if not there

    logger[level](msg, { timestamp, ...(args ? {args}:{}) } );
  })
});

/*
* REAL variant
*
* Used by:
*   - app-deploy-ops 'npm serve' (with 'ignore' marker in the calls)
*   - production deployed front-end
*
* Firebase provides credentials automatically so that we can use Cloud Logging APIs in production.
*/
const cloudLoggingProxy_v0 = (!EMULATION) && (_ => {
  // GCP project id is the same as Firebase project id
  const projectId = process.env.GCLOUD_PROJECT || fail("Env.var 'GCLOUD_PROJECT' not available!");

  const logging = new Logging({ projectId });    // @google-cloud/logging

  // Note: The same implementation may be taking in both production and development ('ignore == true') logs. Thus,
  //    it's not an either-or.
  //
  const appLog = logging.log('app-central');
  const appLog2 = logging.log('app-central.ignore');    // logs from development client

  return (les, ignore) => {
    const log = (!ignore) ? appLog:appLog2;
    const prom = log.write(les);

    prom.then(_ => {
      //logger.info(`Logged to ${log.name}: ${les.size()} entries`);
    }).catch(err => {
      logger.error("Failure to ship application logs:", err);
    })
  }
})();

exports.cloudLoggingProxy_v0 = regionalFunctions
  //const cloudLoggingProxy_v0 = regionalFunctions
  .https.onCall(({ les, ignore } /*, context*/) => {
    (cloudLoggingProxy_v0 || cloudLoggingProxy_v0_EMUL)(les, ignore);
  });

/*
export {
  userInfoShadow_2,
  cloudLoggingProxy_v0
}
*/
