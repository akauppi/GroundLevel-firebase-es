/*
* Ops adapters for RayGun:
*
* - application performance monitoring
* - real user monitoring
* - crash reporting
*/

// raygun4js (2.22.3) defaults ('main' field) to UMD packaging.
//
import 'raygun4js/dist/raygun.vanilla.min'

const rg = window.Raygun;

function reportTrack_v0() {   // (string, Array of integer /*ms of epoch*/) => ()
}

function counterInc_v0() {    // (string, num) => ()
}

/*
* Initialize with an API KEY provided by the caller.
*/
function init({ apiKey }) {   // ({ apiKey: string }) => ()

  const opts = {
    //from:     // "localhost" or net

    debugMode: true,

    disablePulse: false,    // needed for enabling it???
    //trackCoreWebVitals: true,   // default: true

    // Suppressse Raygun (2.22.3) debug mode from giving:
    //  <<
    //    Cannot read property '_captureMissingRequests' of undefined
    //  <<
    captureMissingRequests: false   // default: false
  };

  rg.init(apiKey, opts);

  // tbd. eventually place this in a crash reporting interface
  //??? rg('enableCrashReporting', true);

  // -''-
  //??? rg('enablePulse', true); // Enables Real User Monitoring
}

export {
  init,
  reportTrack_v0,
  counterInc_v0
}
