/*
* functions/index.js
*
* Cloud Functions for our app.
*
* This level handles the Functions API nuances; individual functions are in their own files.
*
* ES modules support:
*   - [x] Cloud Functions supports node.js 14
*   - [x] Firebase Emulator allows Cloud Functions to be expressed as ECMAScript modules
*   - [~] 'firebase-functions' is available as ESM exports
*         - explicitly importing '@google-cloud/functions-framework' 1.9.0 makes it so
*   - [x] 'firebase-admin' is available as ESM exports
*
* References:
*   - Call functions from your app (Firebase docs)
*     -> https://firebase.google.com/docs/functions/callable
*   - Add the Firebase Admin SDK to your server (Firebase docs)
*     -> https://firebase.google.com/docs/admin/setup
*/
const admin = require('firebase-admin');
//import * as admin from 'firebase-admin';

const functions = require('firebase-functions');
//import * as functions from 'firebase-functions';
const logger = functions.logger;

const EMULATION = !! process.env.FUNCTIONS_EMULATOR;    // "true"|...

admin.initializeApp();

// Under emulation, run as the default region (makes testing simpler).
// In production, the region is brought via Cloud Function configuration.
//
const region = EMULATION ? null : functions.config().regions[0];
const regionalFunctions = region ? functions.region(region) : functions;

const { cloudLoggingProxy_v0 } = require('./cloudLoggingProxy.js');

exports.cloudLoggingProxy_v0 = regionalFunctions.https
  .onCall(({ les, ignore }, context) => {
    const uid = context.auth?.uid;

    logger.debug("Logging request from:", uid || "(unknown user)");

    return cloudLoggingProxy_v0(les, { ignore, uid });
  });


// UserInfo shadowing
//
// Track changes to global 'userInfo' table, and update projects where the changed user is participating with their
// renewed user info.
//
// tbd. Needs #rework
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

/** tbd. likely not doing it so. Could track all changes to '.members'. If a uid is removed, remove the data
 *     immediately also from 'userInfo'. Or... the removal of a user can do that. :)
// UserInfo cleanup
//
// Occasionally, see if there are projects where users have left, but their userInfo sticks around.
//
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

