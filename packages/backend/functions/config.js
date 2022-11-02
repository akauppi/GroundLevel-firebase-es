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

const firebaseConfig = JSON.parse(
  process.env.FIREBASE_CONFIG || fail_at_load("No 'FIREBASE_CONFIG' env.var.")
);

/*
* Firebase "Default GCP Resource location", used for:
*   - Cloud Firestore
*   - Cloud Storage
*
* See:
*   - "Default GCP resource location" (Cloud Firestore docs)
*     -> https://firebase.google.com/docs/firestore/locations#default-cloud-location
*/
const LOCATION_ID = (!EMULATION) && (firebaseConfig?.locationId || fail_at_load("No '.locationId' in 'FIREBASE_CONFIG' env.var."));
const projectId = firebaseConfig?.projectId || fail_at_load("No '.projectId' in 'FIREBASE_CONFIG' env.var.");
const databaseURL = firebaseConfig?.databaseURL || fail_at_load("No '.databaseURL' in 'FIREBASE_CONFIG' env.var.");

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
* Initial load: (**)
*   <<
*     CI  dev deploy
*     --- --- ---
*     x   x   x   GCLOUD_PROJECT: 'demo-main'           (actual project id in deployment)
*     x   x   -   K_REVISION: '1'                       **documented**
*     x   x   x   PORT: '9005'                          **documented**
*     x   x   -   FUNCTIONS_EMULATOR: 'true'
*     x   x   -   TZ: 'UTC'
*     x   x   -   FIREBASE_DEBUG_MODE: 'true'
*     x   x   -   FIREBASE_DEBUG_FEATURES: '{"skipTokenVerification":true,"enableCors":true}'
*     x   x   -   FIREBASE_DATABASE_EMULATOR_HOST: '127.0.0.1:6869'
*     x   x   -   FIRESTORE_EMULATOR_HOST: '127.0.0.1:6768'
*     ?   x   -   FIREBASE_FIRESTORE_EMULATOR_ADDRESS: '127.0.0.1:6768'
*     ?   x   -   FIREBASE_AUTH_EMULATOR_HOST: '127.0.0.1:9101'
*     ?   x   -   FIREBASE_EMULATOR_HUB: '127.0.0.1:4400'
*     ?   x   -   CLOUD_EVENTARC_EMULATOR_HOST: '127.0.0.1:9299'
*     x   x   x   FIREBASE_CONFIG:                      **documented**
*     ^---^------   '{"storageBucket":"demo-main.appspot.com","databaseURL":"http://127.0.0.1:6869/?ns=demo-main","projectId":"demo-main"}'
*             ^--   '{"projectId":"groundlevel-sep22","databaseURL":"https://groundlevel-sep22-default-rtdb.europe-west1.firebasedatabase.app","storageBucket":"groundlevel-sep22.appspot.com","locationId":"europe-central2"}'
*     x   x   x   FUNCTIONS_CONTROL_API: 'true'
*     -   -   x   CLOUD_RUNTIME_CONFIG: '{"firebase":{"projectId":"groundlevel-sep22","databaseURL":"https://groundlevel-sep22-default-rtdb.europe-west1.firebasedatabase.app","storageBucket":"groundlevel-sep22.appspot.com","locationId":"europe-central2"}}'
*   <<
*
*     'FIREBASE_CONFIG' is important. It carries 'locationId' when there's an active Firebase project (deployment, cloud,
*         not emulation). This makes sense, since 'locationId' is about "Default GCP resource location", and thus comes
*         from the cloud.
*
*     Note: 'FIREBASE_CONFIG' contains (under emulation, at least) 'databaseURL' and 'storageBucket' even if the
*         those emulators were not enabled.
*
*     (**): Firebase calls this "deploy", it's a cycle where the exports are listed, in order to set them up. Since
*         it also happens under emulation, we use the term "initial load".
*
* Runtime load (for Callables, Firestore triggers, ...):
*   <<
*     callable invocation (emul)
*      |  Firestore trigger (emul)
*      |   |   callable invocation (prod)
*     --- --- ---
*     x           FIREBASE_EMULATORS_PATH: '/root/.cache/firebase/emulators'
*     x           IS_FIREBASE_CLI: 'true'
*     x           GCLOUD_PROJECT: 'demo-main'
*     x           K_REVISION: '1'
*     x           PORT: '/tmp/fire_emu_3b738218f4cec97e.sock'
*     x           FUNCTIONS_EMULATOR_TIMEOUT_SECONDS: '60'
*     x           FUNCTION_TARGET: 'metrics.and.logging.proxy.v0'
*     x           FUNCTION_SIGNATURE_TYPE: 'http'
*     x           K_SERVICE: 'metrics-and-logging-proxy-v0'
*     x           FUNCTIONS_EMULATOR: 'true'
*     x           TZ: 'UTC'
*     x           FIREBASE_DEBUG_MODE: 'true'
*     x           FIREBASE_DEBUG_FEATURES: '{"skipTokenVerification":true,"enableCors":true}'
*     x           FIREBASE_DATABASE_EMULATOR_HOST: '127.0.0.1:6869'
*     x           FIRESTORE_EMULATOR_HOST: '127.0.0.1:6768'
*     x           FIREBASE_FIRESTORE_EMULATOR_ADDRESS: '127.0.0.1:6768'
*     x           FIREBASE_AUTH_EMULATOR_HOST: '127.0.0.1:9101'
*     x           FIREBASE_EMULATOR_HUB: '127.0.0.1:4400'
*     x           CLOUD_EVENTARC_EMULATOR_HOST: 'http://127.0.0.1:9299'
*     x           FIREBASE_CONFIG: '{"storageBucket":"demo-main.appspot.com","databaseURL":"http://127.0.0.1:6869/?ns=demo-main","projectId":"demo-main"}'
*   <<
*
*   In particular, note the absence of 'FUNCTIONS_CONTROL_API' (which seems to indicate deploy vs. runtime load).
*
* This is mostly "good to know".
*/
if (true) {   // DEBUG
  if (process.env["FUNCTIONS_CONTROL_API"]) {   // Initial load
    console.debug("Initial load:", process.env);    // visible in Docker Desktop

  } else {
    const callableName = process.env["FUNCTIONS_TARGET"];

    console.debug( callableName ? `Loading callable '${callableName}:` : 'Other:', process.env);
      // NOT visible in Docker Desktop; Q: Where does this end up??
  }
}

//---
// NOTE: 'firebase-functions' 4.0.x brings a new way [3] to get also "built in parameters". Only, it remains unusable for
//    us.
//
//  - "Built-in parameters" (Firebase docs) [3]
//    -> https://firebase.google.com/docs/functions/beta/config-env#built-in_parameters
//
//    This is "nice, but unnecessary", since we can reach the same information in the 'FIREBASE_CONFIG' env.var.
//    with hardly any clutter.
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

//!const { projectId, databaseUrl } = require('firebase-functions/params');
//!console.error("!!!", { projectId, databaseUrl } );

function fail_at_load(msg) { throw new Error(msg) }

//---
// Region.
//
// Cloud Function callables (in production) need to be married to their region, IN CODE (not in config). This is a bit
// ..weird (this author thinks).
//
// We use the "Default GCP resource location" for the overall region as well. On its own, it caters to Cloud Firestore,
// Cloud Functions and Cloud Storage, and is given online, when creating the Firebase project. THIS KEEPS THE
// CONFIGURATION "OUTSIDE" OF THE CODE.

// Note:
//    According to [4], _all regions already support "v2"_ (Oct 2022).
//
//    - "Cloud Functions Locations" [4]
//      -> https://cloud.google.com/functions/docs/locations
//
//    However, the author noticed "europe-north1" and "europe-west4" misbehaving, thus don't use them, at the moment.
//
const region_v2 = !EMULATION && LOCATION_ID;
const region_v1 = !EMULATION && LOCATION_ID;    // just for Firestore

//---
// Application specific config (and/or secrets)
//
// Note: 'firebase-functions/params' offers an API to these, but - apart from type checking - it doesn't seem to offer
//    any added value over reading the environment, directly. One middle man less.
//
//import { defineString } from 'firebase-functions/params'
//
//const confPromUserId = defineString('PROM_USER_ID', { description: 'Prometheus user id'});
//const confLokiUserId = defineString('LOKI_USER_ID', { description: 'Loki user id'});
//const confMetricsApiKey = defineSecret('METRICS_API_KEY');    // no description for secrets?? tbd.
//
const promUserId = process.env["PROM_USER_ID"];
const lokiUserId = process.env["LOKI_USER_ID"];
const metricsApiKey = process.env["METRICS_API_KEY"];

export {
  EMULATION,
  INITIAL_LOAD,
    //
  projectId,
  databaseURL,
  region_v1,
  region_v2,

  promUserId,
  lokiUserId,
  metricsApiKey
}
