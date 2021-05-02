#!/usr/bin/env node

/*
* tools/gen-env-js.js
*
* Usage:
*   <<
*     node --harmony-top-level-await tools/<...myname...>   # no parameters
*   <<
*
* Writes the access values for the active Firebase project for browser consumption, as an ES module that can be
* 'import'ed to the sources.
*
* Output to stdout.
*
* References:
*   - child_process (Node.js documentation)
*     -> https://nodejs.org/api/child_process.html
*/
import { exec } from 'child_process';

// Helper (node.js does not have a Promises based 'exec', does it?)
//
function execProm(cmd) {    // string => Promise of { stdout: string, stderr: string }
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject( { err, stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

// Get access values of the active Firebase project (fail when no active project).
//
const cmd = 'npx firebase-tools apps:sdkconfig';

const { stdout } = await( execProm(cmd) ).catch( ({ err, stdout, stderr }) => {
  // err.code: 1
  // stdout: "... No project active, but project aliases are available.\n ..."
  //        or: "... No currently active project.\n ..."
  // stderr: ''

  // Note: Errors should be in 'stderr', but Firebase CLI consistently doesn't do it.

  if (! (stdout.includes("No project active") || stdout.includes("No currently active"))) {
    console.error("Unexpected command output:", { err, stdout, stderr });
    process.exit(-3);
  }

  process.stderr.write("ERROR: No active Firebase project.\n\tPlease 'npm run activate' at the top level.\n");
  process.exit(-3);
});

/* Stdout: <<
// Copy and paste this into your JavaScript code to initialize the Firebase SDK.
// You will also need to load the Firebase SDK.
// See https://firebase.google.com/docs/web/setup for more details.

firebase.initializeApp({
  "projectId": "...",
  "appId": "1:9909...dbf7",
  "databaseURL": "https://your-project.firebaseio.com",
  "storageBucket": "your-project.appspot.com",
  "locationId": "europe-west3",
  "apiKey": "...",
  "authDomain": "your-project.firebaseapp.com",
  "messagingSenderId": "...",
  "measurementId": "..."
});
<< */

function pick(key) {    // (string) => string | undefined

  const re = new RegExp(`^\\s+"${key}": "(.+?)",?$`, 'm');

  const [_,capture] = stdout.match(re) || [];
  return capture;   // undefined if no match
}

const locationId = pick("locationId");    // may be undefined (Firebase default)

const out =
`// Access values for the Firebase project.
// DON'T MAKE CHANGES HERE. THIS FILE IS OVERRIDDEN by build scripts.
//
const API_KEY="${ pick("apiKey") }"
const APP_ID="${ pick("appId") }"
const AUTH_DOMAIN="${ pick("authDomain") }"
const PROJECT_ID="${ pick("projectId") }"
const LOCATION_ID=${ locationId ? `"${locationId}"` : 'undefined' }

export {
  API_KEY,
  APP_ID,
  AUTH_DOMAIN,
  PROJECT_ID,
  LOCATION_ID
}
`;

process.stdout.write(out);
