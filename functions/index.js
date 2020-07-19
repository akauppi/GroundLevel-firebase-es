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
*/
const functions = require('firebase-functions');
//import * as functions from 'firebase-functions'   // tried with firebase 8.6.0
/*
$ npm run dev
...
⚠  Error [ERR_REQUIRE_ESM]: Must use import to load ES Module: /Users/asko/Git/GroundLevel-es6-firebase-web/functions/index.js
  [emul] require() of ES modules is not supported.
*/

const myRegion = 'europe-west3';  // Frankfurt

// Tell local emulation from being run in the cloud
//
const LOCAL = process.env["FUNCTIONS_EMULATOR"] == "true";    // "true" | ??? tbd. what's it in the cloud

//console.log("ENV:", process.env);

// Firebase Admin SDK
//const admin = require('firebase-admin');
//admin.initializeApp();

// Logs, as "callable function"
//
// {
//    level: "debug"|"info"|"warn"|"error"
//    msg: string
//    payload: object   //optional
// }
exports.logs_v200719 = functions
//const logs_v200719 = functions
  .region(myRegion)
  .https.onCall(({ level, msg, payload }, context) => {

    if (LOCAL) {
      msg = `[${level.toUpperCase()}] ${msg}`;
    }

    switch (level) {
      case "debug":
        console.debug(msg, payload);
        break;
      case "info":
        console.info(msg, payload);
        break;
      case "warn":
        console.warn(msg, payload);
        break;
      case "error":
        console.error(msg, payload);
        break;
      default:
        throw new functions.https.HttpsError('invalid-argument', `Unknown level: ${level}`);
    }

    return "";
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
exports.logs_v1 = functions
//const logs_v1 = functions
  .region(myRegion)
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

    return "";
  });


/***  // keep as sample of using REST API
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
