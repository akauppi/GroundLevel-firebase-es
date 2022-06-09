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
*/

//---
// This gets loaded ONCE PER EACH FUNCTION actually being used.
//
//    - userInfoShadow_2
//    - cloudLoggingProxy_v0
//
// Environment (emulator):
//  <<
//    FIREBASE_EMULATORS_PATH: '/root/.cache/firebase/emulators'
//    IS_FIREBASE_CLI: 'true'
//    GCLOUD_PROJECT: 'demo-2'
//    FUNCTION_TARGET: 'userInfoShadow_2' | 'cloudLoggingProxy_v0' | ...
//    FUNCTION_SIGNATURE_TYPE: 'event' | 'http' | ...
//    K_SERVICE: 'userInfoShadow_2' | 'cloudLoggingProxy_v0' | ...
//    FUNCTIONS_EMULATOR: 'true',
//    FIREBASE_DEBUG_MODE: 'true',
//    FIREBASE_DEBUG_FEATURES: '{"skipTokenVerification":true,"enableCors":true}',
//    FIRESTORE_EMULATOR_HOST: '0.0.0.0:6767',
//    FIREBASE_CONFIG: '{"storageBucket":"demo-2.appspot.com","databaseURL":"https://demo-2.firebaseio.com","projectId":"demo-2"}'
//    ...
//  <<
//
// Would be nice if this was documented (it's not; 'firebase-tools' 11.0.1).
//---
//console.log("!!! ENV", process.env)   // DEBUG

export { cloudLoggingProxy_v0 } from './callables/loggingProxy.js'
export { counterProxy_v0 } from './callables/counterProxy.js'
export { userInfoShadow_2 } from './userInfoShadow.js'
