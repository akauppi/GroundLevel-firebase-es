/*
* functions/index.js
*
* Cloud Functions for our app.
*
* Some of these do back-end chores like moving data when triggered. Others are for monitoring (getting central logging).
* Yet others can be "callables" (like RPC), to interact with the backend.
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

admin.initializeApp();

// Note: You can run functions in multiple regions, and some functions in some etc. But for a start, it's likely best
//    to keep them in one, near you.
//
const regionalFunctions = functions.region('europe-west3');   // Frankfurt

//const EMULATION = !! process.env.FUNCTIONS_EMULATOR;

// UserInfo shadowing
//
// Track changes to global 'userInfo' table, and update projects where the changed user is participating with their
// renewed user info.
//
exports.userInfoShadow = regionalFunctions.firestore
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

/***  // sample of using REST API
* Note: There's little benefit for making REST API for the client (use 'callables' instead). If you wish to do those
*      for other integrations, that's another case (i.e. not requiring the user to have a Firebase client). /AK
*
// POST /logs
//    body: { level: "debug"|"info"|"warn"|"error", msg: string }
//
// Usage:
//    <<
//      curl -X POST -H "Content-Type:application/json" $ENDPOINT -d '{"level":"debug", "msg":"Hey Earth!"}'
//    <<
//
exports.logs = regionalFunctions
 .https.onRequest((req, resp) => {

  const level = req.body.level;
  const msg = req.body.msg;

  switch (level) {
    case "debug":
      console.debug(msg);
      break;
    default:
      resp.status(400).send("Unknown level: "+level);
      return;
  }

  resp.status(200).send("");
});
***/
