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

/*** disabled
// The logging adapter web worker needs to initialize Firebase separately. By that time, 'firebaseProm' is already
// known (since 'main.js' initializes it prior to running app code, and logging only happens there). Thus, we can
// provide a synchronous copy to the worker.
//
let firebaseDirect;

firebaseProm.then( o => { firebaseDirect = o });

function getFirebase() {
  if (!firebaseDirect) { fail("Too early. Firebase config not received, yet."); }
  return firebaseDirect;
}***/

export {
  firebaseProm,
  //getFirebase
}
