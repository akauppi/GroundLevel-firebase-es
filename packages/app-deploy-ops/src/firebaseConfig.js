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
const firebaseProm = fetch('/__/firebase/init.json').then( resp => {
  if (!resp.ok) {
    throw new Error(`Unable to fetch '/__/firebase/init.json' (${ resp.status }): ${ resp.body }`);
  } else {
    return resp.json();   // returns a 'Promise' but above '.then' merges them
  }
});

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

export {
  firebaseProm,
  getLocationId
}
