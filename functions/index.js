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

const myRegion = 'europe-west3';  // Frankfurt

// Firebase Admin SDK
//const admin = require('firebase-admin');
//admin.initializeApp();

/***
// SAMPLE
// Take the text parameter passed to this HTTP endpoint and insert it into
// Cloud Firestore under the path /messages/:documentId/original
//
exports.addMessage = functions.https.onRequest(async (req, res) => {
  const original = req.query.text;

  const writeResult = await admin.firestore().collection('messages').add({original: original});

  res.json({result: `Message with ID: ${writeResult.id} added.`});
});

// SAMPLE
// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
//
exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
  .onCreate((snap, context) => {
    // Grab the current value of what was written to Cloud Firestore
    const original = snap.data().original;

    // Access the parameter `{documentId}` with `context.params`
    console.log('Uppercasing', context.params.documentId, original);

    const uppercase = original.toUpperCase();

    // Setting an 'uppercase' field in Cloud Firestore document returns a Promise.
    return snap.ref.set({uppercase}, {merge: true});
  });
***/

/***
// Logging
//
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

// Logs, as "callable function"
//
exports.logs_v1 = functions
  .region(myRegion)
  .https.onCall(({ level, msg }, context) => {

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
