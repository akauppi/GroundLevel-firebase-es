/*
* src/util/logCloud.js
*
* Log events to your centralized solution, whether it is:
*   - Firebase Analytics
*   - Sentry
*
* See 'README' for details on how to prepare the logging back-ends.
*/
const logFirebase = firebase.analytics.logEvent || false;

function logCloud(eventId) {

  if (logFirebase) logFirebase(eventId);
}

export { logCloud };
