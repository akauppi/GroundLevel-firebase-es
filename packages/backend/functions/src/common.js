/*
* Common config stuff for actual routines.
*/
const functions = require('firebase-functions');
//import * as functions from 'firebase-functions';
const logger = functions.logger;    // for backend logging

const admin = require('firebase-admin');
//import * as admin from 'firebase-admin';

function fail(msg) { throw new Error(msg); }

const EMULATION = !! process.env.FUNCTIONS_EMULATOR;    // "true"|...
//const BACKEND_TEST = !! process.env.BACKEND_TEST;   // to differentiate between backend 'npm test' and use in app development

/*
* For production (not emulation) and deploying to a region, provide the region where the Firebase project has been set up.
*/
function prodRegion() {   // () => string|null
  const arr = functions.config().regions;
  const ret = arr && arr[0];
  return ret;
}

// To have your Functions work, if you chose *ANY* other location than 'us-central1', you need to mention the region
// in CODE (that's against good principles of programming; this should be a CONFIGURATION!!!)
//
// See -> https://stackoverflow.com/questions/43569595/firebase-deploy-to-custom-region-eu-central1#43572246
//
const regionalFunctions = EMULATION ? functions : (() => {
  const reg = prodRegion();
  return !reg ? functions : functions.region(reg);
})();

exports.logger = logger;
exports.fail = fail;
exports.EMULATION = EMULATION;
exports.regionalFunctions = regionalFunctions;

/*export default {
  logger,
  fail,
  EMULATION,
  regionalFunctions
}*/
