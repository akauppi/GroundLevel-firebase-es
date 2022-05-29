#!/usr/bin/env node

/*
* tools/gen-vite-env-local.js
*
* Usage:
*   <<
*     [SENTRY_DSN=...] FIREBASE_JSON=<path> gen-vite-env-local --project=demo-...
*   <<
*
* Reads the node side Firebase configuration and produces Vite environment config out of it. This allows the browser
* side to get copies of these build values.
*
* Output to stdout.
*/
import { readFileSync } from 'fs'

const [a] = process.argv.slice(2);
const [_,projectId] = /^--project=(.+)$/.exec(a);

const FIREBASE_JSON = process.env['FIREBASE_JSON'] || 'firebase.json'

if (!projectId) {
  process.stderr.write(`\nUsage: gen-vite-env-local --project=demo-...\n`);
  process.exit(1);
}

const SENTRY_DSN = process.env['SENTRY_DSN'];     // optional

const [firestorePort, functionsPort, authPort] = (_ => {   // => [int, int, int]
  const raw = readFileSync( FIREBASE_JSON );
  const json = JSON.parse(raw);

  const arr = ["firestore","functions","auth"].map( k => {
    return (json.emulators && json.emulators[k] && json.emulators[k].port)    // cannot use '?.' because of the varying 'k'
      || fail(`Cannot read 'emulators.${k}.port' from 'firebase.json'`);
  });
  return arr;
})();

const emulHost = process.env["EMUL_HOST"];    // overridden by CI only

const out =
`# Generated based on 'firebase.json'.
#
VITE_FIRESTORE_PORT=${firestorePort}
VITE_FUNCTIONS_PORT=${functionsPort}
VITE_AUTH_PORT=${authPort}
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
