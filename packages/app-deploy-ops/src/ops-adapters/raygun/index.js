/*
* Ops adapters for RayGun:
*
* - application performance monitoring
* - real user monitoring
* - crash reporting
*/
import { subscribe } from '@ops/userChange'

// raygun4js (2.22.3) defaults ('main' field) to UMD packaging.
//
import 'raygun4js/dist/raygun.vanilla.min'

const rg = window.Raygun;

function reportTrack_v0() {   // (string, Array of integer /*ms of epoch*/) => ()
}

function counterInc_v0() {    // (string, num) => ()
}

let initialized = false;

/*
* Initialize with an API KEY provided by the caller.
*
* Note: This may be called multiple times, with same API KEY but different options (different types of uses).
*/
function init(apiKey, opts) {   // (string, { enableCrashReporting: boolean|undefined }|undefined) => ()
  opts = opts || {};

  const { enableCrashReporting } = opts;
  checkOpts(opts, ['enableCrashReporting']);

  if (enableCrashReporting) {
    console.warn("Not sure whether RayGun crash reporting is enabled..");     // tbd.
  }

  if (initialized) return;    // already initialized

  const tmp = {
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
  rg.init(apiKey, tmp);

  // tbd. eventually place this in a crash reporting interface
  //??? rg('enableCrashReporting', true);

  // -''-
  //??? rg('enablePulse', true); // Enables Real User Monitoring

  // Let us - and Raygun - know when user changes.
  //
  subscribe( user => {

    if (user) {
      const { uid, email, isAnonymous, displayName } = user;

      // With out adventurous linking to Raygun, got to give the parameters in a certain order (no object).
      //
      rg.setUser(
        email || uid,   // identifier; RayGun: "email address or unique id"
        isAnonymous,
        email,
        displayName,    // fullName
        null,           // firstName (tbd. try 'null')?
        uid             // uuid
      );
      /***
      rg.setUser({
        identifier: uid,    // Firebase user id -- RayGun: "email address or unique id"
        isAnonymous,
        email,
        //firstName,
        fullName: displayName
      });
      ***/
    } else {
      rg.setUser(null);   // tbd. how to signal "no current user"?
    }

    console.log("Sent Raygun about user: ", user);  // DEBUG
  });

  initialized = true;
}

function checkOpts(o,valid) {   // (object, Array of string) => ()    ; or throws if unknown keys

  Object.keys(o).forEach( k => {
    valid.includes(k) || fail(`Unknown option: ${k}`)
  })
}

function fail(msg) { throw new Error(msg) }

export {
  init,
  reportTrack_v0,
  counterInc_v0
}
