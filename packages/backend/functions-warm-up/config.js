/*
* functions/warm-up/config.js
*/
const host = process.env["EMUL_HOST"] || "localhost";

// GCLOUD_PROJECT: 'demo-2'
//
const projectId = process.env["GCLOUD_PROJECT"] || fail("Expected 'GCLOUD_PROJECT' env.var.");

const FUNCTIONS_URL = `http://${host}:5002`   // Could also read the port from 'firebase.json' upstairs

function fail(msg) { throw new Error(msg); }

export {
  projectId,
  FUNCTIONS_URL
}
