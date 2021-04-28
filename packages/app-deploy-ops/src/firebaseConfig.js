/*
* Provide access to the '/__/firebase/init.json' information.
*
* This is served automatically by Firebase hosting.
*/
const fail = (msg) => { throw new Error(msg); }

// Access values from Firebase hosting (we don't use its 'init.js').
//
// Note: Once browsers can 'import' JSON natively, we can make this a one-liner.
//
const firebaseProm = fetch('/__/firebase/init.json').then( async resp => {
  if (!resp.ok) {
    throw new Error(`Unable to fetch '/__/firebase/init.json' (${ resp.status }): ${ resp.body }`);
  } else {
    const o = await resp.json();

    // Do minimal sanity checking, e.g. 'appId' is required but will not be there if the person didn't create an app
    // in Firebase Console.
    //
    if (!o.appId) {
      fail("No '.appId' in Firebase configuration - have you created a web app in Firebase Console?")
    }
    return o;
  }
});

// The logging adapter web worker needs to initialize Firebase separately. By that time, 'firebaseProm' is already
// known (since 'main.js' initializes it prior to running app code, and logging only happens there). Thus, we can
// provide a synchronic copy to the worker.
//
let firebaseDirect;

firebaseProm.then( o => { firebaseDirect = o });

function getFirebase() {
  if (!firebaseDirect) { fail("Too early. Firebase config not received, yet."); }
  return firebaseDirect;
}

/*** not needed
// The proxy logging adapter may need to know the 'locationId' (it's currently provided at build time; this would be
// the runtime alternative).
//
// Since we already get this information for 'main.js', we can pick the 'locationId' field and keep it aside. No Promise
// is needed (it would complicate the use), since the logging adapters _only_ get initialized when the app is running;
// and at that point Firebase has been initialized.
//
// This is timing-wise a bit so-and-so approach, but stable.
//
let locationId;   // needed for using regional Cloud Functions

firebaseProm.then( o => {
  console.log("!!! received", o);
  locationId = o.locationId || fail("Firebase configuration without '.locationId'!");
});

function getLocationId() {
  if (!locationId) fail("Too early! 'locationId' not initialized.");
  return locationId;
}
***/

export {
  firebaseProm,
  getFirebase
}
