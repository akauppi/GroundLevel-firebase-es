/*
* tools/gen-vite-env-ci.js
*
* Prepare Vite environment variables, for CI test runs. Like 'gen-vite-env-local.js', but for CI runs.
*
* NOTE: We could use 'gen-vite-env-local.js' itself, with 'FIREBASE_APP_JS' pointing to '../backend/firebase.ci.js'
*     and 'CI_APP' defined. The decision to have this separated is part of eliminating dev/CI cross-talk (easier
*     maintainability).
*
* Expects:
*   - EMUL_HOST=emul-for-app
*
* Output to stdout.
*/
const FIREBASE_APP_JS = '../backend/firebase.ci.js';

const { emulators } = await import(`../${FIREBASE_APP_JS}`).then( mod => mod.default );

// tbd. This is unnecessarily complicated. Could take project id from 'PROJECT_ID' env.var. (consider same in '...-local.js')
const projectId = (_ => {
  const [a, b] = process.argv.slice(2);
  if (!a || b) {
    process.stderr.write(`\nUsage: gen-vite-env-ci --project=demo-...\n\n`);
    process.exit(1);
  }

  const [__,c1] = /^--project=(.+)$/.exec(a);
  return c1;
})();

const emulHost = process.env['EMUL_HOST'] || fail("Expected 'EMUL_HOST' env.var.");

const [firestorePort, functionsPort, authPort, databasePort] = (_ => {   // => [int, int, int, int]

  const arr = ["firestore","functions","auth","database"].map( k => {
    return (emulators && emulators[k] && emulators[k].port)    // cannot use '?.' because of the varying 'k'
      || fail(`Cannot read 'emulators.${k}.port' from '${FIREBASE_APP_JS}'`);
  });
  return arr;
})();

const out =
`#
VITE_FIRESTORE_PORT=${firestorePort}
VITE_FUNCTIONS_PORT=${functionsPort}
VITE_AUTH_PORT=${authPort}
VITE_DATABASE_PORT=${databasePort}
VITE_PROJECT_ID=${projectId}
VITE_EMUL_HOST=${emulHost}
`;

process.stdout.write(out);

function fail(msg) {
  process.stderr.write(`ERROR: ${msg}\n\n`);
  process.exit(2);
}
