/*
* functions/common.js
*
* Common import for all the functions.
*
* Hides emulator specific details, initialization etc.
*/
import { region } from './config.js'

import functions_v1, { region as f1_region } from 'firebase-functions/v1'
import functions_v2 from 'firebase-functions/v2'

//--- Region

// Under emulation, run as the default region (makes testing simpler).
//
// For deployments, the "location id" value (e.g. "europe-west2") is built-in to 'config.js'. We pass it to 'functions.region',
// ..which Cloud Functions deployment listens to, and pushes the functions in the right way. OH BOY!!!
//
// NOTE: Unlike Firebase, we give NO SPECIAL ROLE to 'us-central1'.
//
const regionalFunctions_v1 = region ? f1_region(region)
  : functions_v1;   // Note: 'minInstances: 1' does not seem to remove the delay (~3s) of cold launch

export {
  regionalFunctions_v1,
  //functions_v2
}
