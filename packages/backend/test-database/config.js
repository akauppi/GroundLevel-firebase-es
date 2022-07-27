/*
* test-database/config.js
*/
const projectId = "demo-2";    // keep in sync with 'npm run start': allows seeing values in the Emulator UI

// We can read 'firebase.js' directly
//
import m from '../firebase.js'
const databasePort = m?.emulators?.database?.port || fail("INTERNAL: failed to import 'emulators.database.port'.");

function fail(msg) { throw new Error(msg) }

export {
  projectId,
  databasePort
}
