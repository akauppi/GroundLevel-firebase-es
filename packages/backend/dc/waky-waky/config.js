/*
* dc/waky-waky/config.js
*
* Provides access to emulator and project configuration.
*/
const projectId = process.env["PROJECT_ID"] || fail("No 'PROJECT_ID' env.var.");

const FIREBASE_APP_JSON = "firebase.app.json";    // DC mapped

// Note: Base the relative import to the current working directory (instead of where this script is, in the filesystem).
//    Avoids problems if (when!) DC maps us in a less deep directory.
//
const cwd = process.cwd();
const functionsPort = await import(`${ cwd }/${ FIREBASE_APP_JSON }`, { assert: { type: 'json' }}).then( mod =>
  mod.default?.emulators?.functions?.port || fail("Unable to read 'emulators.functions.port'")
);

const emulHost = process.env["EMUL_HOST"] || fail("No 'EMUL_HOST' env.var.");

function fail(msg) { throw new Error(msg); }

export {
  projectId,
  functionsPort,
  emulHost
}
