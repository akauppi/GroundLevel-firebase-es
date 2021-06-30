#!/usr/bin/env node

/*
* tools/gen-vite-env-local.js
*
* Usage:
*   <<
*     gen-vite-env-local --project=demo-...
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

if (!projectId) {
  process.stderr.write(`\nUsage: gen-vite-env-local --project=demo-...\n`);
  process.exit(1);
}

const [firestorePort, functionsPort, authPort] = (_ => {   // => [int, int, int]
  const raw = readFileSync('./firebase.json');
  const json = JSON.parse(raw);

  const arr = ["firestore","functions","auth"].map( k => {
    return (json.emulators && json.emulators[k] && json.emulators[k].port)    // cannot use '?.' because of the varying 'k'
      || fail(`Cannot read 'emulators.${k}.port' from 'firebase.json'`);
  });
  return arr;
})();

const out =
`# Generated based on 'firebase.json'.
# DON'T MAKE CHANGES HERE. THIS FILE IS OVERRIDDEN by 'npm run dev[:local]'
#
VITE_FIRESTORE_PORT=${firestorePort}
VITE_FUNCTIONS_PORT=${functionsPort}
VITE_AUTH_PORT=${authPort}
VITE_PROJECT_ID=${projectId}
`;

process.stdout.write(out);
