/*
* functions/warm-up/config.js
*/

//  GCLOUD_PROJECT: 'demo-2'
//  FIRESTORE_EMULATOR_HOST: '0.0.0.0:6767'
//
const projectId = process.env["GCLOUD_PROJECT"] || fail("Expected 'GCLOUD_PROJECT' env.var.");

const FUNCTIONS_URL = 'http://localhost:5002'   // Don't have; must just know. Could also read from 'firebase.json' upstairs

//const FIRESTORE_HOST = (process.env["FIRESTORE_EMULATOR_HOST"] || fail("Expected 'FIRESTORE_EMULATOR_HOST' env.var."))
//  .replace("0.0.0.0", "localhost");

function fail(msg) { throw new Error(msg); }

export {
  projectId,
  FUNCTIONS_URL,
  //FIRESTORE_HOST
}
