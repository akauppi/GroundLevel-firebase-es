/*
* back-end/functions/local.cjs
*
* tbd. Is there a way to NOT deploy this to production (emulation only)?
*
* Note: No need for a region. We only use these under 'dev:local'.
*/
const functions = require('firebase-functions');

// Logs, as "callable function"
//
// {
//    level: "debug"|"info"|"warn"|"error"|"fatal"
//    msg: string
//    payload: object   //optional
// }
//
exports.logs_v190720 = functions
  .https.onCall(({ level, msg, payload }, context) => {

    // See sources of 'functions.logger' for what's going on here.. We craft messages directly (so we can support
    // 'CRITICAL'), instead of using 'logger.debug' etc.
    //
    const severity = severityMap[level];
    if (!severity) {
      throw new functions.https.HttpsError('invalid-argument', `Unknown level: ${level}`);
    }

    const entry = {
      ...payload,
      severity,
      message: msg
    }
    functions.logger.write(entry);
  });

const severityMap = {   // values are 'LogSeverity'
  debug: "DEBUG",
  info: "INFO",
  warn: "WARNING",
  error: "ERROR",
  fatal: "CRITICAL"
};

/*
* Just for testing
*
* { msg: string } -> string
*/
exports.greet = functions
  .https.onCall((msg, context) => {
    return `Greetings, ${msg}.`;
  });
