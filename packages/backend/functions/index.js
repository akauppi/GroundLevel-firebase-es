/*
* functions/index.js
*
* Cloud Functions entry point.
*
* References:
*   - Call functions from your app (Firebase docs)
*     -> https://firebase.google.com/docs/functions/callable
*   - Add the Firebase Admin SDK to your server (Firebase docs)
*     -> https://firebase.google.com/docs/admin/setup
*
* tbd. Advance to 'v2' ONCE FIRESTORE SUPPORT IS THERE.
*/

/*
* Environment variables
*
* Compare with [1]. Output of actually seen env.vars. ('firebase-tools' 11.3.0)
*
*   [1]: Runtime environment variables set automatically > Newer runtimes (Cloud Functions docs)
*     -> https://cloud.google.com/functions/docs/configuring/env-var#newer_runtimes
*
* Note: Cloud Functions (v1) loads files multiple times, and the differences in the sets can be partly due to this.
*   1st load:   study the contents
*   2nd load:   initiate one function at a time
*
* CI ('up emul' output):
*   <<
*     GCLOUD_PROJECT: 'demo-2',
*     K_REVISION: '1',                      **documented**
*     PORT: '9005',                         **documented**
*     FUNCTIONS_EMULATOR: 'true',
*     TZ: 'UTC',
*     FIREBASE_DEBUG_MODE: 'true',
*     FIREBASE_DEBUG_FEATURES: '{"skipTokenVerification":true,"enableCors":true}',
*     FIRESTORE_EMULATOR_HOST: '0.0.0.0:6767',
*     FIREBASE_DATABASE_EMULATOR_HOST: '0.0.0.0:6800',
*     FIREBASE_CONFIG: '{"storageBucket":"demo-2.appspot.com","databaseURL":"http://0.0.0.0:6800/?ns=demo-2","projectId":"demo-2"}',
*     FUNCTIONS_CONTROL_API: 'true',
*     HOME: '/root',
*     PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'
*   <<
*
* dev, in addition to the above (lacks 'FUNCTIONS_CONTROL_API'):
*   <<
*     FIREBASE_EMULATORS_PATH: '/root/.cache/firebase/emulators',     // weird, also CI should have that (same Docker image)
*     IS_FIREBASE_CLI: 'true',
*     GCLOUD_PROJECT: 'demo-2',
*     FUNCTION_TARGET: 'userInfoShadow_2',    **documented**
*     FUNCTION_SIGNATURE_TYPE: 'event',       **documented**
*     K_SERVICE: 'userInfoShadow_2',          **documented**
*   <<
*
* This is mostly "good to know".
*/
//console.error("!!!", process.env);

export { metricsAndLoggingProxy_v0 } from './ops/index.js'
export { userInfoShadow_2 } from './userInfoShadow.js'
