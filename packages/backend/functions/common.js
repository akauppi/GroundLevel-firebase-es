/*
* functions/common.js
*
* Common import for all the functions.
*
* Hides emulator specific details, when dealing with Cloud Functions.
*/
import functions_v1, { region as f1_region, config as f1_config, https as f1_https } from 'firebase-functions/v1'
//import functions_v2, { region as f2_region, config as f2_config, https as f2_https } from 'firebase-functions/v2'

const EMULATION = !! process.env.FUNCTIONS_EMULATOR;    // "true"|...

// Under emulation, run as the default region (makes testing simpler).
// In production, the region is brought via Cloud Function configuration.
//
const regionalFunctions_v1 = EMULATION ? functions_v1
  : f1_region( f1_config().regions[0] );

export {
  regionalFunctions_v1,
  EMULATION
}
