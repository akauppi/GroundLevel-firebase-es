/*
* functions/regional.js
*
* Common import for all the functions.
*
* Hides emulator specific details, when dealing with Cloud Functions.
*/
import functions_v1, { region as f1_region } from 'firebase-functions/v1'
//import functions_v2, { region as f2_region } from 'firebase-functions/v2'

// 'import.meta.env. LOCATION_ID' is injected by deployment
// 'process.env.FUNCTIONS_EMULATOR' is set by Firebase Emulators
//
// Note: Tried using '.env' file for passing the location id but they don't seem to kick in at the meta-load.
//
const DEPLOYMENT_REGION =
  ! process.env.FUNCTIONS_EMULATOR ? import.meta.env.LOCATION_ID : undefined;

// Under emulation, run as the default region (makes testing simpler).
//
// For deployments, the "location id" value (e.g. "europe-west2") is passed to us. And we pass it to 'functions.region',
// ..which Cloud Functions deployment listens to, and pushes the functions in the right way. OH BOY!!!
//
// NOTE: Unlike Firebase, we give NO SPECIAL ROLE to 'us-central1'.
//
const regionalFunctions_v1 = DEPLOYMENT_REGION ? f1_region( DEPLOYMENT_REGION ) : functions_v1;

export {
  regionalFunctions_v1
}
