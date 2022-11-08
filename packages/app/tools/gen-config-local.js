/*
* tools/gen-config-local.js
*
* Usage:
*   <<
*     $ node [FIREBASE_APP_JS=...] PROJECT_ID=demo-main EMUL_HOST=emul-for-app gen-cy-config-local
*   <<
*
* Imitates the production Firebase config (for consistency in the app code; we could pass these as 'VITE_...' env vars
* just the same).
*
* Used by Cypress, but also available to the front end code, as an import.
*
* Note:
*   Desktop Cypress replaces the DC domain ('emul-for-app') in 'databaseURL' with 'localhost' (so we don't need multiple
*   files).
*
* Output to stdout.
*/
const PROJECT_ID = process.env.PROJECT_ID || fail("Missing 'PROJECT_ID' env.var.");

const FIREBASE_APP_JS = process.env.FIREBASE_APP_JS || "../backend/firebase.app.js";    // CI overrides it

const EMUL_HOST = process.env.EMUL_HOST || fail("Missing 'EMUL_HOST' env.var.");

const o = await import(`../${FIREBASE_APP_JS}`).then( mod => mod.default );

const databaseURL = (_ => {
  const databasePort = o?.emulators?.database?.port || fail("Failed to read RTDB emulator port");

  return `http://${ EMUL_HOST }:${ databasePort }?ns=${ PROJECT_ID }`;   // note: '?ns=...' is required!
})();

const oo = {
  projectId: PROJECT_ID,
  databaseURL
}
process.stdout.write(
  JSON.stringify(oo, null, 2)
);

function fail(msg) {
  process.stderr.write(`ERROR: ${msg}\n\n`);
  process.exit(2);
}
