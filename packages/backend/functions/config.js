/*
* functions/config.js
*
* Configuration of various kinds, about the runtime environment.
*
* Kept in its own module, until the logic is so trivial it can be distributed in the various other places.
* That is not the case in Oct 2022.
*
*   - detection of Database URL is either against the docs ('import .../params'; broken) or undocumented (env.vars)
*
* Also works as a debugging mechanism and a place to document the different states.
*
* TWO PHASES OF LOADING:
* ======================
*   Cloud Function loads the same files, with two different purposes (this is not necessarily documented, anywhere, is it?):
*
*     1. Initial load = times 1
*
*       The 'index.js' is loaded, to see what kind of functions it exports. None of actual functionality is needed,
*       in this phase.
*
*     2. Actual load = times number of (callable??) functions
*
*       _All_ the files (well, 'index.js') is loaded, for each function themselves, to be activated.
*
*       tbd. is this phase happening only per callable, or also for things like Firestore triggers?
*
*   Note: Cloud Functions codespaces [1] may help in this, but the author hasn't started using them, yet.
*
*   Implications:
*     - DO NOT INITIALIZE anything heavy in the import bodies (this is regular good advice on ES modules, anyhow).
*
* References:
*   - "Organize functions" (Firebase docs) [1]
*     -> https://firebase.google.com/docs/functions/beta/organize-functions
*/
import process from 'node:process'

const EMULATION = !! process.env.FUNCTIONS_EMULATOR;    // set to "true" by Firebase Emulators

const INITIAL_LOAD = process.env.FUNCTIONS_CONTROL_API === "true";

/*
* Environment variables
*
* Compare with [2]. Output of actually seen env.vars.
*
*   [2]: Runtime environment variables set automatically > Newer runtimes (Cloud Functions docs)
*     -> https://cloud.google.com/functions/docs/configuring/env-var#newer_runtimes
*
* CI run ('up emul' output; 'firebase-tools' 11.3.0):
* dev ('make app:start') ('firebase-tools' 11.15.0):
*
* Initial load:
*   <<
*     CI  dev
*     --- ---
*     x   x   GCLOUD_PROJECT: 'demo-main'
*     x   x   K_REVISION: '1'                       **documented**
*     x   x   PORT: '9005'                          **documented**
*     x   x   FUNCTIONS_EMULATOR: 'true'
*     x   x   TZ: 'UTC'
*     x   x   FIREBASE_DEBUG_MODE: 'true'
*     x   x   FIREBASE_DEBUG_FEATURES: '{"skipTokenVerification":true,"enableCors":true}'
*     x   x   FIREBASE_DATABASE_EMULATOR_HOST: '127.0.0.1:6869'
*     x   x   FIRESTORE_EMULATOR_HOST: '127.0.0.1:6768'
*     ?   x   FIREBASE_FIRESTORE_EMULATOR_ADDRESS: '127.0.0.1:6768'
*     ?   x   FIREBASE_AUTH_EMULATOR_HOST: '127.0.0.1:9101'
*     ?   x   FIREBASE_EMULATOR_HUB: '127.0.0.1:4400'
*     ?   x   CLOUD_EVENTARC_EMULATOR_HOST: '127.0.0.1:9299'
*     x   x   FIREBASE_CONFIG: '{"storageBucket":"demo-main.appspot.com","databaseURL":"http://127.0.0.1:6869/?ns=demo-main","projectId":"demo-main"}'
*     x   x   FUNCTIONS_CONTROL_API: 'true'
*   <<
*
* Actual load (for Callables, Firestore triggers, ...):
*   ... same as above, except:
*    - no FIREBASE_CONFIG for callables; for Firestore trigger it's there..
*    - no FUNCTIONS_CONTROL_API
*
*   ..with these:
*   <<
>    FIREBASE_EMULATORS_PATH: '/root/.cache/firebase/emulators'
>    PROJECT_ID: 'demo-main'
>    IS_FIREBASE_CLI: 'true'
>    FUNCTIONS_EMULATOR_TIMEOUT_SECONDS: '60'
>    FUNCTION_TARGET: 'metricsAndLoggingProxy_v0'     // or 'userInfoShadow_2' (name of callable/trigger function)
>    FUNCTION_SIGNATURE_TYPE: 'http'
>    K_SERVICE: 'metricsAndLoggingProxy_v0'
*   <<
*
* This is mostly "good to know".
*/
if (true) {   // DEBUG
  if (process.env["FIREBASE_CONFIG"]) {   // Initial load
    console.debug("Initial load:", process.env);    // visible in Docker Desktop

  } else {
    const callableName = process.env["FUNCTIONS_TARGET"];

    console.debug(`Loading callable '${ callableName }:`, process.env );    // NOT visible in Docker Desktop; Q: Where does this end up??
  }
}

//---
// NOTE: 'firebase-functions' 4.0.x brings a new way [3] to get also "built in parameters". Only, it remains unusable for
//    us.
//
//    tbd. DEBUG, REPORT TO FIREBASE, and EVENTUALLY USE THIS?
//
//  - "Built-in parameters" (Firebase docs) [3]
//    -> https://firebase.google.com/docs/functions/beta/config-env#built-in_parameters
//
// Below gives:
//  <<
//    ⬢  functions: Failed to load function definition from source: FirebaseError: Failed to load function definition \
//        from source: Failed to generate manifest from function source: SyntaxError: Named export 'databaseUrl' not found. \
//        The requested module 'firebase-functions/params' is a CommonJS module, which may not support all module.exports as named exports.
//  <<
//import { projectId, databaseUrl } from 'firebase-functions/params'    // does NOT WORK
//import { projectID, databaseURL } from 'firebase-functions/params'    // does NOT WORK (closer, but the values are getters)

//const { projectID, databaseURL } = await import('firebase-functions/params').then( mod => mod.default );    //
//console.error("!!!", { projectID: projectID, databaseURL });   // prints getters

// tbd. ABOVE, so we can use this for taking in Database URL (instead of env.vars)

//!const { projectId, databaseUrl } = require('firebase-functions/params');
//!console.error("!!!", { projectId, databaseUrl } );

const projectId = process.env["GCLOUD_PROJECT"] || fail_at_load("No 'GCLOUD_PROJECT' env.var.");

function fail_at_load(msg) { throw new Error(msg) }

//---
// Region.
//
// Cloud Function callables (in production) need to be married to their region, IN CODE (not in config). This is a bit
// ..weird, and maybe due to Firebase having been a regionless platform in its early life? Who knows...
//
// We require this information to come from "outside" (configuration), one way or the other.
//
// The current way is that production build _WRITES IT STRAIGHT HERE_, replacing 'import.meta.env.LOCATION_ID' with
// the location id that it knows will be used. #hack
//
// Note: Tried using '.env' file for passing the location but they don't seem to kick in at the initial load.
//
const region = !EMULATION && import.meta.env.LOCATION_ID;
  // Firebase Emulators shouldn't get to 'import.meta...' - only for production

export {
  EMULATION,
  INITIAL_LOAD,
    //
  projectId,
  //databaseUrl
  region
}
