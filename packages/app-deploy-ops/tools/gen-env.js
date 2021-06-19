/*
* tools/gen-env.js
*
* Based on the active Firebase project, print a JS module that contains its access values on the stdout.
*/
//import firebaseTools from 'firebase-tools'

// tbd. values from active project

// TEMP
const apiKey = "AIzaSyDtBcQpkbfz73LgP013fvG98xNMnYB-MIo";
const appId = "1:337689549369:web:27714618f3aec67899cbe8";
const authDomain = "groundlevel-160221.firebaseapp.com";
const projectId = "groundlevel-160221";
const locationId = "europe-west6";

const out = `// Access values for the Firebase project.
// DON'T MAKE CHANGES HERE. THIS FILE IS OVERRIDDEN by build scripts.
//
const API_KEY="${apiKey}"
const APP_ID="${appId}"
const AUTH_DOMAIN="${authDomain}"
const PROJECT_ID="${projectId}"
const LOCATION_ID=${ locationId ? `"${locationId}"` : 'undefined' }

export {
  API_KEY,
  APP_ID,
  AUTH_DOMAIN,
  PROJECT_ID,
  LOCATION_ID
}
`;

process.stdout.write(out);
