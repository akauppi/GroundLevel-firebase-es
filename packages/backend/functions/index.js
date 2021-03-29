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

const admin = require('firebase-admin');
//import * as admin from 'firebase-admin';

const {Logging} = require('@google-cloud/logging');
// import { Logging } from '@google-cloud/logging'

const EMULATION = !! process.env.FUNCTIONS_EMULATOR;
const BACKEND_TEST = !! process.env.BACKEND_TEST;   // to differentiate between backend 'npm test' and use in app development

admin.initializeApp();

const logger = functions.logger;    // for backend logging

/*
* For production (not emulation), provide the region where the Firebase project has been set up (Firestore,
* in particular).
*/
function prodRegion() {   // () => string
  const arr = functions.config().regions;
  const reg0 = arr && arr[0];
  if (!reg0) {
    throw new Error("Please provide Firebase region by 'firebase functions:config:set regions.0=[europe-...|us-...|asia-...]'");
  }
  return reg0;
}

// To have your Functions work, if you chose *ANY* other location than 'us-central1', you need to mention the region
// in CODE (that's against good principles of programming; this should be a CONFIGURATION!!!)
//
// See -> https://stackoverflow.com/questions/43569595/firebase-deploy-to-custom-region-eu-central1#43572246
//
const regionalFunctions = EMULATION ? functions : functions.region( prodRegion() );

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
/** tbd. likely not doing it so. Could track all changes to '.members'. If a uid is removed, remove the data
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
*/

const severityMap = new Map([
  ['debug', 'DEBUG'],
  ['info', 'INFO'],
  ['warn', 'WARNING'],
  ['error', 'ERROR'],
  ['fatal', 'CRITICAL']
]);

// Logs, as "callable function"
//
// Receive an array of logging messages. The front end batches them together to reduce the number of calls, but also
// for the sake of offline mode.
//
// arr: Array of {
//    level: "debug"|"info"|"warn"|"error"|"fatal"
//    msg: string
//    created: long       // original time in epoch ms's ('Date.now()')
//    payload: object?
// }
//
// Ideally, the front end could log directly to Cloud Logging, instead of via us. It probably can, by using the
// node version of the library (though in browser), but needs to do some OAuth authentication. We did not try out
// this option. (Some logging frameworks allow browsers to log directly; Cloud Logging *does not mention this* in
// the docs.)
//
const logging = new Logging();    // @google-cloud/logging

const appLogName = `app-central${ EMULATION ? (BACKEND_TEST ? ".test" : ".dev"):"" }`;
const appLog = logging.log(appLogName);

exports.logs_v1 = regionalFunctions
  //const logs_v1 = regionalFunctions
  .https.onCall((arr /*, context*/) => {

    // Convert our API to Cloud Logging.
    //
    const les = arr.map( ({ level, msg, created, payload }) => {
      const severity = severityMap.get(level);
      if (!severity) {
        throw new functions.https.HttpsError('invalid-argument', `Unknown level: ${level}`);
      }

      const t = new Date(created);

      const metadata = {
        severity,
        //labels: { a: 'b' }
        //resource: { type: 'global' }

        //created: t    // tbd. can we somehow pass this as the real LogEntry's created timestamp
      };

      const message = { msg };    // tbd. can we send just text, this way (sample has object of a king..)

      return appLog.entry(metadata, message);
    });

    // NOTE: Within emulation, Firebase (rightfully) does not auth us to use the Cloud Logging.
    //  <<
    //    ⚠  Google API requested!
    //    - URL: "https://oauth2.googleapis.com/token"
    //    - Be careful, this may be a production service.
    //    {"severity":"ERROR","message":"Failure to ship application logs: Error: 7 PERMISSION_DENIED: The caller does not have permission\n
    //    at Object.callErrorFromStatus (/Users/asko/Git/GroundLevel-es-firebase/packages/backend/functions/node_modules/@grpc/grpc-js/build/src/call.js:31:26)\n
    //    at Object.onReceiveStatus (/Users/asko/Git/GroundLevel-es-firebase/packages/backend/functions/node_modules/@grpc/grpc-js/build/src/client.js:176:52)\n
    //    at Object.onReceiveStatus (/Users/asko/Git/GroundLevel-es-firebase/packages/backend/functions/node_modules/@grpc/grpc-js/build/src/client-interceptors.js:336:141)\n
    //    at Object.onReceiveStatus (/Users/asko/Git/GroundLevel-es-firebase/packages/backend/functions/node_modules/@grpc/grpc-js/bui PASS  test-fns/userInfo.test.js9:181)\n
    //    at /Users/asko/Git/GroundLevel-es-firebase/packages/backend/functions/node_modules/@grpc/grpc-js/build/src/call-stream.js:130:78\n
    //    at processTicksAndRejections (node:internal/process/task_queues:76:1  userInfo shadowing
    //  <<
    //
    // Note that we could excercise the production logging; now part of the functionality goes untested! :S
    //
    if (EMULATION) {
      logger.info( "NOT testing the Cloud Logging API - no access to it.")
    } else {
      // Write them at once
      //
      const prom = appLog.write(les);

      prom.then(_ => {
        logger.info(`Logged to ${appLogName}: ${les.size()} entries`);
      }).catch(err => {
        logger.error("Failure to ship application logs:", err);
      })
    }
  });

/*
export {
  userInfoShadow_2,
  logs_1
}
*/
