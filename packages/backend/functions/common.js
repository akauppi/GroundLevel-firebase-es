/*
* Common config stuff for actual routines.
*/
const functions = require('firebase-functions');
//import * as functions from 'firebase-functions';
const logger = functions.logger;    // for backend logging

const EMULATION = !! process.env.FUNCTIONS_EMULATOR;    // "true"|...
//const BACKEND_TEST = !! process.env.BACKEND_TEST;   // to differentiate between backend 'npm test' and use in app development

// If callables need to throw errors, they should use dedicated codes from:
//  https://firebase.google.com/docs/reference/functions/providers_https_#functionserrorcode
//
const HttpsError = functions.https.HttpsError;

function failInvalidArgument(msg) {
  throw new HttpsError('invalid-argument',msg);
}

exports.logger = logger;
exports.EMULATION = EMULATION;
exports.HttpsError = HttpsError;
exports.failInvalidArgument = failInvalidArgument;

/*export default {
  logger,
  EMULATION,
  HttpsError
}*/
