/*
* Generates a 'firebase.json' for CI tests (app side).
*
* Note:
*   Unlike most of CI, this file _does_ import from 'firebase.app.js'. We can do this because that file is used
*   in actual CD deployments, and thus seen as being in both the dev and the CI domains.
*
* References:
*   - Schema
*     -> https://github.com/firebase/firebase-tools/blob/master/schema/firebase-config.json
*/
const { database } = await import('./firebase.app.js').then(mod => mod.default);
database || fail();

const o = await import('./firebase.ci.js').then(mod => mod.default);

// Fix ports here, any ports would be fine.
const AUTH_PORT = 9100;
const DATABASE_PORT = 6868;

function fail(msg) { throw new Error(msg) }

export default { ...o,
  ...database,
  emulators: {
    ...o.emulators,
    database: {
      port: DATABASE_PORT,
      host: "0.0.0.0"
    },
    auth: {
      port: AUTH_PORT,
      host: "0.0.0.0"
    }
  }
}
