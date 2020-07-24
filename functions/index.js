/*
* functions/index.js
*
* REST API note:
*   When defining REST functions with Firebase syntax, methods (e.g. POST) are not defined. Anything goes.
*   Also, path parameters cannot be defined. To do these, an Express API could be used. We use "callable functions"
*   instead.
*
* Design note:
*   We choose "callable functions" (over REST API) since there is no extra benefit of using REST in our use case.
*   With callables (think: RPC!), parsing is done for us and authentication information is included in the requests.
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

// Tell local emulation from being run in the cloud. This is exposed to the front end.
//
const LOCAL = !! process.env["FUNCTIONS_EMULATOR"];    // "true" | undefined

// Note: You can run functions in multiple regions, and some functions in some etc. But for a start, it's likely best
//    to keep them in one, near you.
//
// Sad that the default region needs to be in the code. There is no configuration for it. 😢
//
const regionalFunctions = functions.region('europe-west3');   // Frankfurt

// Logs, as "callable function"
//
// {
//    level: "debug"|"info"|"warn"|"error"
//    msg: string
//    payload: object   //optional
// }
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

// Legacy
//
// Sample on how to keep old versions.
//
// {
//    level: "debug"|"info"|"warn"|"error"
//    msg: string
// }
// DEPRECATED 19-Jul-2020
exports.logs_v1 = regionalFunctions
//const logs_v1 = regionalFunctions
  .https.onCall(({ level, msg }, context) => {

    console.warn("Deprecated function called: 'logs_v1'");
    switch (level) {
      case "debug":
        console.debug(msg);
        break;
      case "info":
        console.info(msg);
        break;
      case "warn":
        console.warn(msg);
        break;
      case "error":
        console.error(msg);
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
exports.fatal_v210720 = regionalFunctions.https
  .onCall(({ msg, ex }, context) => {

    functions.logger.error(`FATAL: ${msg}`, ex);    // keep an eye - is that good?
  });


// Temp function, for helping learn fns/firestore testability.
//
// Mirrors changes to 'temp.in' (string) in 'temp.out' (string).
//
exports.temp = regionalFunctions.firestore
  .document('/temp/A')
  .onWrite( async (event, context) => {

    const [before,after] = [event.before, event.after];   // [QueryDocumentSnapshot, QueryDocumentSnapshot]

    if (after.get("in") != before.get("in")) {
      const v = after.get("in");

      // Write to '.out' of the same document
      //
      // Note: Alternative 'after.ref.set(...)' would work as well.
      //
      await admin.firestore().doc("/temp/A").set({ out: v }, { merge: true });

      console.debug("/temp '.in' -> '.out':", v);
    }
  })

/*** REMOVE (works)
// TEMP to debug
exports.addMessage = functions.https.onRequest (async (req, res) => {
  const original = req.query.text;
  const writeResult = await admin.firestore().collection ('messages').add ({text: original});
  const docSnap = await writeResult.get();
  const writtenText = docSnap.get ('text');
  res.send (`Message with text: ${writtenText} added.`);
});
***/

/***  // sample of using REST API
 // POST /logs
 //    body: { level: "debug"|"info"|"warn"|"error", msg: string }
 //
 // Usage:
 //    <<
 //      curl -X POST -H "Content-Type:application/json" $ENDPOINT -d '{"level":"debug", "msg":"Hey Earth!"}'
 //    <<
 //
 exports.logs = functions
 .region(myRegion)
 .https.onRequest((req, resp) => {

  const level = req.body.level;
  const msg = req.body.msg;

  switch (level) {
    case "debug":
      console.debug(msg);
      break;
    case "info":
      console.info(msg);
      break;
    case "warn":
      console.warn(msg);
      break;
    case "error":
      console.error(msg);
      break;
    default:
      resp.status(400).send("Unknown level: "+level);
      return;
  }

  resp.status(200).send("");
});
 ***/

/*** ES6 to-come
export {
  logs_v200719,
  logs_v1
}
***/


/*** UNNEEDED: was chicken-egg
/*
* Expose the emulated or not to the front end (called at app launch)
*
* Note: Only used in dev mode (not production).
*_/
exports.isDevLocal = regionalFunctions
  //const isLocal = regionalFunctions
  .https.onCall(( context) => {

    return LOCAL;   // 'true' if under local emulation
  });
***/

