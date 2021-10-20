#!/usr/bin/env node

/*
* tools/gen-dc-env.js
*
* Usage:
*   <<
*     gen-dc-env
*   <<
*
* Prepares the '.env.dc' file so that Docker Compose uses the port numbers from 'firebase.json'.
*/
import { readFileSync, writeFileSync } from 'fs'

const [firestorePort, functionsPort, authPort, uiPort] = (_ => {   // => [int, int, int, int]
  const raw = readFileSync('./firebase.json');
  const json = JSON.parse(raw);

  const arr = ["firestore","functions","auth","ui"].map( k => {
    return (json.emulators && json.emulators[k] && json.emulators[k].port)    // cannot use '?.' because of the varying 'k'
      || fail(`Cannot read 'emulators.${k}.port' from 'firebase.json'`);
  });
  return arr;
})();

const out =
  `# Generated based on 'firebase.json'.
# DON'T MAKE CHANGES HERE. THIS FILE IS OVERRIDDEN by 'npm run dev[:local]' and 'npm test'.
#
EMUL_FIRESTORE_PORT=${firestorePort}
EMUL_FUNCTIONS_PORT=${functionsPort}
EMUL_AUTH_PORT=${authPort}
EMUL_UI_PORT=${uiPort}
`;

writeFileSync('.env.dc', out);

function fail(msg) {
  process.stderr.write(`ERROR: ${msg}\n\n`);
  process.exit(2);
}
