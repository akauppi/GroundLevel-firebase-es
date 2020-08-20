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
* Cloud Functions note:
*   - until Cloud Functions supports node.js 14, we're stuck using 'require' (no prob there, just hang on). Decided not
*     to use Babel but just wait until the native ES modules support surfaces.
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
//import * as functions from 'firebase-functions'   // tried with firebase 8.6.0

const admin = require('firebase-admin');
//import * as admin from 'firebase-admin';    // ..once node.js >= 13.2 is supported

admin.initializeApp();

// Note: You can run functions in multiple regions, and some functions in some etc. But for a start, it's likely best
//    to keep them in one, near you.
//
const regionalFunctions = functions.region('europe-west3');   // Frankfurt

// Logs, as "callable function"
//
// {
//    level: "debug"|"info"|"warn"|"error"
//    msg: string
//    payload: object   //optional
// }
//
// NOTE!!! Since callables require online connection, WE SHOULD RETHINK THIS APPROACH. Use Firestore, or a logging
//      provider (DataDog) that provides a client tolerant of offline moments.
//
exports.logs_v190720 = regionalFunctions
//const logs_v190720 = regionalFunctions
  .https.onCall(({ level, msg, payload }, context) => {

    const { debug, info, warn, error } = functions.logger;

    switch (level) {
      case "debug":
        debug(msg, payload);
        break;
      case "info":
        info(msg, payload);
        break;
      case "warn":
        warn(msg, payload);
        break;
      case "error":
        error(msg, payload);
        break;
      default:
        throw new functions.https.HttpsError('invalid-argument', `Unknown level: ${level}`);
    }
  });


// Something went awfully wrong.
//
// A central place to catch unexpected circumstances in already deployed code.
//
// Consider this a relay. We can change where to inform, e.g. devops monitoring tools directly with their APIs.
//
// {
//    msg: string
//    ex: exception object
// }
//
// NOTE!!! As with logging, should rethink the approach, for offline.
//
exports.fatal_v210720 = regionalFunctions.https
  .onCall(({ msg, ex }, context) => {

    functions.logger.error(`FATAL: ${msg}`, ex);    // keep an eye - is that good?
  });


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


/*
* Just for testing
*
* { msg: string } -> string
*/
exports.greet = regionalFunctions.https
  .onCall((msg, context) => {
    return `Greetings, ${msg}.`;
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
