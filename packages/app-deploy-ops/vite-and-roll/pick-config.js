/*
* Provide the active Firebase configuration
*
* Context:
*   - run in CI; there is an active Firebase project
*
* Note:
*   We could likely do this programmatically with the 'firebase-tools' APIs, but for legacy reasons, it's with CLI.
*/
import { execSync } from 'child_process'

function pickConfig() {   // () => { projectId, ... }
  const output = execSync("firebase apps:sdkconfig", {encoding: 'utf8'});

  /*
  * output:
  * <<
  *   // Copy and paste this into your JavaScript code to initialize the Firebase SDK.
  *   // You will also need to load the Firebase SDK.
  *   // See https://firebase.google.com/docs/web/setup for more details.
  *
  *   firebase.initializeApp({
  *     "projectId": "...",
  *     "appId": "...",
  *     "storageBucket": "...",
  *     "locationId": "...",
  *     "apiKey": "...",
  *     "authDomain": "...",
  *     "messagingSenderId": "...",
  *     "measurementId": "..."
  *   });
  * <<
  */

  const Re = /firebase\.initializeApp\(({.+})\)/ms;

  const [_, c1] = Re.exec(output);

  const {projectId, appId, locationId, apiKey, authDomain} = JSON.parse(c1);

  if (!(projectId && appId && locationId && apiKey && authDomain)) {
    throw new Error("Unexpected 'firebase apps:sdkconfig' output!");
  }

  return { projectId, appId, locationId, apiKey, authDomain }
}

export {
  pickConfig
}
