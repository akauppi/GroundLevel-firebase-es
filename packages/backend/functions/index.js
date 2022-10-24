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
*   - Cloud Functions v2 public preview
*     -> https://firebase.google.com/docs/functions/beta
*
* tbd. Move to 'v2' once:
*   a) we can use a supported region (e.g. 'europe-north-1')
*   b) Firestore triggers are supported
*/
import './config.js'  // to print any debug output

export { metricsAndLoggingProxy_v0 } from './ops/index.js'
export { userInfoShadow_2 } from './userInfoShadow.js'
