/*
* functions/index.js
*
* Note:
*   When defining functions with Firebase short syntax, methods (e.g. POST) are not defined. Anything goes.
*   Also, path parameters cannot be defined. To do these, an Express API could be used, but we go with the
*   simple model, for now.
*
* "With callables, Firebase Authentication and FCM tokens, when available, are automatically included in requests."
*
* References:
*   - Call functions via HTTP requests (Firebase docs)
*     -> https://firebase.google.com/docs/functions/http-events
*/
const functions = require('firebase-functions');

const myRegion = 'europe-west3';  // Frankfurt

// Firebase Admin SDK to access Cloud Firestore
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

// Same, as a "callable function"
//
exports.logs2 = functions
  .region(myRegion)
  .https.onCall((data, context) => {

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
