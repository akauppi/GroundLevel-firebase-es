/*
* tools/gen-vite-env-local.js
*
* Usage:
*   <<
*     [FIREBASE_APP_JS=...] EMUL_HOST=... gen-vite-env-local --project=demo-...
*   <<
*
* Reads the node side Firebase configuration and produces Vite environment config out of it. This allows the browser
* side to get copies of these build values.
*
* Output to stdout.
*/
const FIREBASE_APP_JS = process.env["FIREBASE_APP_JS"] || "../backend/firebase.app.js";
const { emulators } = await import(`../${FIREBASE_APP_JS}`).then( mod => mod.default );

const projectId = (_ => {
  const [a, b] = process.argv.slice(2);
  if (!a || b) {
    process.stderr.write(`\nUsage: gen-vite-env-local --project=demo-...\n\n`);
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
