/*
* functions/common.js
*
* Common import for all the functions.
*
* Hides emulator specific details, initialization etc.
*/
import { region, INITIAL_LOAD } from './config.js'

import functions from 'firebase-functions'

//--- Region
const functions_v1 = functions;
const f1_region = functions.region;

//import functions_v1, { region as f1_region } from 'firebase-functions/v1'
//import functions_v2, { region as f2_region } from 'firebase-functions/v2'

const EMULATION = !! process.env.FUNCTIONS_EMULATOR;    // set to "true" by Firebase Emulators

// Under emulation, run as the default region (makes testing simpler).
//
// For deployments, the "location id" value (e.g. "europe-west2") is passed to us. And we pass it to 'functions.region',
// ..which Cloud Functions deployment listens to, and pushes the functions in the right way. OH BOY!!!
//
// NOTE: Unlike Firebase, we give NO SPECIAL ROLE to 'us-central1'.
//
const regionalFunctions_v1 =
  EMULATION ? functions_v1   // Note: 'minInstances: 1' does not seem to remove the delay (~3s) of cold launch
    : region ? f1_region(region)
      : functions_v1;

export {
  regionalFunctions_v1
}
