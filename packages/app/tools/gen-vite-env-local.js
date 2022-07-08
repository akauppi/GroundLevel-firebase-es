#!/usr/bin/env node

/*
* tools/gen-vite-env-local.js
*
* Usage:
*   <<
*     [FIREBASE_APP_JS=...] [SENTRY_DSN=...] gen-vite-env-local --project=demo-...
*   <<
*
* Expects:
*   - top level await to be supported (node 18)
*
* Reads the node side Firebase configuration and produces Vite environment config out of it. This allows the browser
* side to get copies of these build values.
*
* Output to stdout.
*/
const FIREBASE_APP_JS = process.env['FIREBASE_APP_JS'] || "firebase.app.js";

const { emulators } = await import(`../${FIREBASE_APP_JS}`).then( mod => mod.default );

// DEBUG
console.debug("!!!", { emulators });

const [a] = process.argv.slice(2);
const [_,projectId] = /^--project=(.+)$/.exec(a);

// Safety check: no longer using 'FIREBASE_JSON'
if (process.env['FIREBASE_JSON']) {
  fail("INTERNAL: not expecting 'FIREBASE_JSON' be defined");
}

if (!projectId) {
  process.stderr.write(`\nUsage: gen-vite-env-local --project=demo-...\n`);
  process.exit(1);
}

const SENTRY_DSN = process.env['SENTRY_DSN'];     // optional

const [firestorePort, authPort, databasePort] = (_ => {   // => [int, int, int]

  const arr = ["firestore","auth","database"].map( k => {
    return (emulators && emulators[k] && emulators[k].port)    // cannot use '?.' because of the varying 'k'
      || fail(`Cannot read 'emulators.${k}.port' from 'firebase.json'`);
  });
  return arr;
})();

const emulHost = process.env["EMUL_HOST"];    // overridden by CI only

const out =
`# Generated based on 'firebase.json'.
#
VITE_FIRESTORE_PORT=${firestorePort}
VITE_AUTH_PORT=${authPort}
VITE_DATABASE_PORT=${databasePort}
VITE_PROJECT_ID=${projectId}${
  emulHost ? `\nVITE_EMUL_HOST=${emulHost}` : ''
}${
  SENTRY_DSN ? `\nVITE_SENTRY_DSN=${SENTRY_DSN}` : ''
}
`;

process.stdout.write(out);

function fail(msg) {
  process.stderr.write(`ERROR: ${msg}\n\n`);
  process.exit(2);
}
