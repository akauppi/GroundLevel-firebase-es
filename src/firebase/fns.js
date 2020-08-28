/*
* src/firebase/fns.js
*
* Code because Firebase 'functions' needs to be set up differently for local emulation, or working against cloud
* (when regions are used).
*/
import {functionsRegion} from "../config"

assert(firebase.functions);

// WARN:
//  Whether a function was deployed to the cloud or not SEEMS TO AFFECT how it should be used, under emulation.
//  This is weird and maybe a BUG in Firebase (8.8.1).
//
//  Had this:
//    <<
//      const fns = window.LOCAL ? firebase.app().functions(/*functionsRegion*/) : ...
//    <<
//
//  That worked for local (notice NO REGION), until the code was deployed. From there on, got this:
//    <<
//      Access to fetch at 'http://localhost:5001/vue-rollup-example/us-central1/logs_v190720' from origin 'http://localhost:3000'
//      has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No
//      'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs,
//      set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
//    <<
//
//  It's weird that a deployment step affects a locally emulated code.
//
//  It seems:
//    - If one creates a new function a) with a region but b) DOES NOT DEPLOY IT, one must access it as if there's no
//      region when emulating.
//    - Once deploying, the region must be added.
//
//  Note: This behaviour is not effected by having an active project ('firebase use') or not ('firebase use --clear').
//
// !!! The fact that the application code needs to know, whether it's dealing with a normal or emulated back-end
//    can be seen as a BUG of Firebase client library (7.16.1, 8.8.1).
//
const localSkipRegion = false;    // set to 'true' if needed

const fns = (window.LOCAL && localSkipRegion) ? firebase.app().functions() :
  firebase.app().functions(functionsRegion);

export { fns }
