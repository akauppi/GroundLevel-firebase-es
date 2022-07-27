/*
* functions/regional.js
*
* Common import for all the functions.
*
* Hides emulator specific details, when dealing with Cloud Functions.
*/
import functions from 'firebase-functions'

const functions_v1 = functions;
const f1_region = functions.region;

//import functions_v1, { region as f1_region } from 'firebase-functions/v1'
//import functions_v2, { region as f2_region } from 'firebase-functions/v2'

const EMULATION = !! process.env.FUNCTIONS_EMULATOR;    // set to "true" by Firebase Emulators

// 'import.meta.env. LOCATION_ID' is injected by deployment
//
// Note: Tried using '.env' file for passing the location but they don't seem to kick in at the meta-load.
//
const DEPLOYMENT_REGION = !EMULATION && import.meta.env.LOCATION_ID;    // Firebase Emulators shouldn't get to 'import.meta...' - only for production

// Under emulation, run as the default region (makes testing simpler).
//
// For deployments, the "location id" value (e.g. "europe-west2") is passed to us. And we pass it to 'functions.region',
// ..which Cloud Functions deployment listens to, and pushes the functions in the right way. OH BOY!!!
//
// NOTE: Unlike Firebase, we give NO SPECIAL ROLE to 'us-central1'.
//
const regionalFunctions_v1 =
  EMULATION ? functions_v1 /*.runWith({ minInstances: 1 })*/   // trying whether this would reduce the need for warm-up
  : DEPLOYMENT_REGION ? f1_region( DEPLOYMENT_REGION )
  : functions_v1;

export {
  regionalFunctions_v1
}
