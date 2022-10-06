/*
* Generates a 'firebase.json' for CI tests; both backend and app.
*
* Expects:
*   CI_APP (optional)   non-empty string indicated building for CI app run; enables auth and database emulation
*
* Note:
*   We base this on 'firebase.app.js' (which is used for CI deployments); only emulation ports are overrun and UI
*   emulation turned off.
*
* References:
*   - Schema
*     -> https://github.com/firebase/firebase-tools/blob/master/schema/firebase-config.json
*/
const { firestore, functions, database } = await import('./firebase.app.js').then(mod => mod.default);
firestore && functions && database || fail();

//const CI_APP = true;  // #hack: always launch auth & database
const CI_APP = !! process.env["CI_APP"];

// Fix ports here, any ports would be fine.
//
const [FIRESTORE_PORT, FUNCTIONS_PORT, AUTH_PORT, DATABASE_PORT] = [6767, 5002, CI_APP && 9100, CI_APP && 6868];

function fail(msg) { throw new Error(msg) }

export default {
  firestore,
  functions,
  ...DATABASE_PORT ? { database } : {},
  emulators: {
    firestore: {
      port: FIRESTORE_PORT,
      host: "0.0.0.0"
    },
    functions: {
      port: FUNCTIONS_PORT,
      host: "0.0.0.0"
    },
    ...DATABASE_PORT ? { database: { port: DATABASE_PORT, host: "0.0.0.0" } } : {},
    ...AUTH_PORT ? { auth: { port: AUTH_PORT, host: "0.0.0.0" } } : {},
    ui: {   // no need for UI in CI
      enabled: false
    }
  }
}
