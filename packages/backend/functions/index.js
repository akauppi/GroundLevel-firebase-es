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
import { INITIAL_LOAD } from "./config.js";   // to print any debug output

// tbd. Add logging to Grafana Cloud to see, how often cold starts happen (could even measure their time, by logging
//    also in function execution itself). Maybe writing a tmp file in load cycle, resolving it in actual function.

const malp_v0 = await import('./ops/index.js').then( mod => mod.default["metrics-and-logging-proxy-v0"] );    // function?

export { userInfoShadow_2 } from './userInfoShadow.js'

// No way to export a function with dashes in the name directly (is there?), but we can do it via "groups".
//
// Note: 'export default {...}' would itself just be seen as a group, by Cloud Functions, leading to "default" in the
//    callable's URL.
//

/*
export const metrics = {
  ["and-logging-proxy-v0"]: malp_v0
}
// Gives (in client):
//  <<
//    functions: Error: Failed to find function metrics.and.logging.proxy.v0 in the loaded module
//  <<
*/

export const metrics = { and: { logging: { proxy: { v0: malp_v0 } } } }   // works (but UGLY!! 🧟‍)
