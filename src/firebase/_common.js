/*
* src/firebase/_common.js
*
* Code used by any cloud function modules.
*/
import {functionsRegion} from "../config"

assert(firebase.functions);

// In order for local emulation to work, there must NOT be any regions.
//
// NOTE: If you give emulated a region, things will just silently stop working! (would be appropriate to get browser
//    console errors)
//
// tbd. The fact that the application code needs to know, whether it's dealing with a normal or emulated back-end
//    can be seen as a BUG of Firebase client library (7.16.1).
//
const fns = window.LOCAL ? firebase.app().functions(/*functionsRegion*/) :
  firebase.app().functions(functionsRegion);

export { fns }
