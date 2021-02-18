/*
* tools/gen-vite-env-online.js
*
* Usage:
*   <<
*     node --harmony-top-level-await tools/<...myname...>   # no parameters
*   <<
*
* Writes the access values for the active Firebase project for browser consumption.
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
const cmd = 'firebase apps:sdkconfig';

const { stdout } = await( execProm(cmd) ).catch( ({ err, stdout, stderr }) => {
  // err.code: 1
  // stdout: "... No project active, but project aliases are available.\n ..."
  // stderr: ''

  // Note: Errors should be in 'stderr', but Firebase CLI consistently doesn't do it.

  if (!stdout.includes("No project active")) {
    console.error("Unexpected command output:", { err, stdout, stderr });
    process.exit(-3);
  }

  process.stderr.write("ERROR: No active Firebase project.\n\tPlease 'firebase use <alias>' or 'firebase use --add', and try again.\n");
  process.exit(-3);
});

/* Stdout: <<
// Copy and paste this into your JavaScript code to initialize the Firebase SDK.
// You will also need to load the Firebase SDK.
// See https://firebase.google.com/docs/web/setup for more details.

firebase.initializeApp({
  "projectId": "vue-rollup-example",
  "appId": "1:9909...dbf7",
  "databaseURL": "https://vue-rollup-example.firebaseio.com",
  "storageBucket": "vue-rollup-example.appspot.com",
  "locationId": "europe-west3",
  "apiKey": "...",
  "authDomain": "vue-rollup-example.firebaseapp.com",
  "messagingSenderId": "...",
  "measurementId": "..."
});
<< */

function pick(key) {    // (string) => string

  const re = new RegExp(`^\\s+"${key}": "(.+?)",?$`, 'm');

  const [_,capture] = stdout.match(re);
  return capture;
}

const a = pick("apiKey");
const b = pick("authDomain");
const c = pick("projectId");

const out =
`# Access values for the Firebase project.
# DON'T MAKE CHANGES HERE. THIS FILE IS OVERRIDDEN by 'npm run dev:online'.
#
VITE_API_KEY=${a}
VITE_AUTH_DOMAIN=${b}
VITE_PROJECT_ID=${c}
`;

process.stdout.write(out);