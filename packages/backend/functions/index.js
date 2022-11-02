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
*/
import { EMULATION, databaseURL } from "./config.js";

// 'firebase-tools' (11.15.0) provides 'databaseURL' under emulation, regardless whether it's actually usable or not.
// We counteract that.
//
const reallyHaveDatabaseURL = (!EMULATION || process.env["FIREBASE_DATABASE_EMULATOR_HOST"]) && databaseURL;

// tbd. Add logging to Grafana Cloud to see, how often cold starts happen (could even measure their time, by logging
//    also in function execution itself). Maybe writing a tmp file in load cycle, resolving it in actual function.

//---
// Always
//
export { userInfoShadow_2 } from './userInfoShadow.js'

//---
// metricsAndLoggingProxy
//
// Needed for: app/production (not backend testing)
//
const metricsAndLoggingProxy_v0 = reallyHaveDatabaseURL &&
  await import("./ops/index.js").then( mod => mod.metricsAndLoggingProxy_v0 );

//---
// {prom|loki|clean}Bridge
//
// Scheduled functions; only needed for production (if loaded under emulation, needs Pub/Sub emulator enabled)
//
// tbd. TEST ALSO IN PRODUCTION, WHETHER THE 'METRICS_API_KEY' SECRET IS PROVIDED (non-empty), and import only then! :)
//
const promBridge = false; /*tbd.*/   // !EMULATION && await import("./ops/promBridge.js").then( mod => mod.promBridge );

// NOTE:
//    Cloud Functions v2 does not _yet_ ('firebase-functions' 4.0.1) support upper case letters, but it should,
//    eventually. [1] Underscores might never be supported.
//
//    - "Coming soon in Cloud Functions (2nd gen)" [1]
//      -> https://cloud.google.com/functions/docs/concepts/version-comparison#coming_soon_in_2nd_gen
//

// A) Below _declares_ the functions, but they are not found at runtime:
//    <<
//      Error: Failed to find function metrics.and.logging.proxy.v0 in the loaded module
//    <<
//
//export const metrics = { ...metricsAndLoggingProxy_v0 ? {  ["and-logging-proxy-v0"]: metricsAndLoggingProxy_v0 } : {} }   // metrics-and-logging-proxy-v0
//export const once = { ...onceADay ? {  ["a-day"]: onceADay } : {} }   // once-a-day

// 🧟‍) Utterly ugly - but works.
//
export const metrics = metricsAndLoggingProxy_v0 ? { and: { logging: { proxy: { v0: metricsAndLoggingProxy_v0 }}}} : {};   // metrics-and-logging-proxy-v0

export const prom = promBridge ? { bridge: promBridge } : {};   // prom-bridge
