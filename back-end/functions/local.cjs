/*
* back-end/functions/local.cjs
*
* tbd. Is there a way to NOT deploy this to production (emulation only)?
*/
const functions = require('firebase-functions');

// tbd. Change 'firebase-jest-testing' so that region comes from us. No need for region, here.
//
const regionalFunctionsBS = functions.region('europe-west3');

// Logs, as "callable function"
//
// {
//    level: "debug"|"info"|"warn"|"error"|"fatal"
//    msg: string
//    payload: object   //optional
// }
//
// NOTE!!! Callables require online connection. WE SHOULD ONLY USE THIS FOR LOCAL DEVELOPMENT, not online.
//
exports.logs_v190720 = regionalFunctionsBS  //functions
  //const logs_v190720 = functions
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
exports.greet = regionalFunctionsBS.https    // functions.https
  .onCall((msg, context) => {
    return `Greetings, ${msg}.`;
  });
