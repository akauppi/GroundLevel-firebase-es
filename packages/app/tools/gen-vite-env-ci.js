/*
* tools/gen-vite-env-ci.js
*
* Usage:
*   <<
*     FIRESTORE_PORT=<num> AUTH_PORT=<num> \
*     EMUL_HOST=<port> \
*     [SENTRY_DSN=...] gen-vite-env-local --project=demo-...
*   <<
*
* Outputs an '.env' file to be used for CI testing.
*/

/*** disabled
const FIREBASE_APP_JS = process.env['FIREBASE_APP_JS'] || "firebase.app.js";    // run within DC, 'firebase.app.js' is mapped

const { emulators } = await import(`../${FIREBASE_APP_JS}`).then( mod => mod.default );
***/

const projectId = (_ => {
  const [a, b] = process.argv.slice(2);
  if (!a || b) {
    process.stderr.write(`\nUsage: gen-vite-env-local --project=demo-...\n\n`);
    process.exit(1);
  }

  const [__,c1] = /^--project=(.+)$/.exec(a);
  return c1;
})();

const SENTRY_DSN = process.env['SENTRY_DSN'];     // optional

/***
const [firestorePort, authPort, databasePort] = (_ => {   // => [int, int, int]

  const arr = ["firestore","auth","database"].map( k => {
    return (emulators && emulators[k] && emulators[k].port)    // cannot use '?.' because of the varying 'k'
      || fail(`Cannot read 'emulators.${k}.port' from '${FIREBASE_APP_JS}'`);
  });
  return arr;
})();
***/

const emulHost = process.env["EMUL_HOST"];

const firestorePort = process.env["FIRESTORE_PORT"] || fail("Expected 'FIRESTORE_PORT' env.var.");
const authPort = process.env["AUTH_PORT"] || fail("Expected 'AUTH_PORT' env.var.");

const out =
`# Generated
#
VITE_FIRESTORE_PORT=${firestorePort}
VITE_AUTH_PORT=${authPort}
VITE_PROJECT_ID=${projectId}
VITE_EMUL_HOST=${emulHost}
${
  SENTRY_DSN ? `VITE_SENTRY_DSN=${SENTRY_DSN}` : ''
}
`;

process.stdout.write(out);

function fail(msg) {
  process.stderr.write(`ERROR: ${msg}\n\n`);
  process.exit(2);
}
