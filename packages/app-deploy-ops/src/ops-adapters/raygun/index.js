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

  initialized = true;
}

/*
* Called if the Firebase user changes.
*
* Note: Caller may filter some information out, and e.g. only provide verified email addresses.
*/
function userChanged({ displayName, email, isAnonymous, uid }) {

  rg.setUser({
    identifier: uid,    // Firebase user id -- RayGun: "email address or unique id"
    isAnonymous,
    email,
    //firstName,
    fullName: displayName
  });
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
  counterInc_v0,
    //
  userChanged
}
